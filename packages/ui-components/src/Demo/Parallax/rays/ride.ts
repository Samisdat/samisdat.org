import { css } from '@linaria/core';
import { useEffect } from 'react';

import { NORM_HALF, RIDE_MS, rideAt } from './scene';

import type { RaysState } from './state';
import type { RefObject } from 'react';

/** Registers --rays-tx as a number so that the animation interpolates it instead of jumping. */
if (typeof CSS !== 'undefined' && 'registerProperty' in CSS) {
    try {
        CSS.registerProperty({ name: '--rays-tx', syntax: '<number>', inherits: true, initialValue: '-1' });
    } catch {
        // already registered
    }
}

/**
 * The ride is one custom property, animated from -1 to 1 and back by a keyframe animation. The window view
 * reads it in calc(): `.shift` moves by `k * (ds - NORM_HALF * norm)`, see `shiftFromNorm`.
 */
export const rideStyle = css`
    --rays-tx: -1;

    @keyframes rays-tx {
        from {
            --rays-tx: -1;
        }

        to {
            --rays-tx: 1;
        }
    }

    animation: rays-tx ${RIDE_MS}ms linear infinite alternate;

    & .shift {
        transform: translate(calc((400 + var(--k) * (var(--ds) - ${NORM_HALF} * var(--rays-tx))) * 1px), var(--y, 0px))
            scale(var(--scale, 1));
    }
`;

const animationOf = (el: HTMLElement | null) => el?.getAnimations()[0];

/** Linaria renames the keyframes, so the animation is the one the element carries. */
export const setRideSpeed = (el: HTMLElement | null, speed: number) => animationOf(el)?.updatePlaybackRate(speed);

export const resetRide = (el: HTMLElement | null) => {
    const animation = animationOf(el);
    if (animation) {
        animation.currentTime = 0;
    }
};

/**
 * Mirrors the position of the CSS ride into the state: one frame per animation frame while it runs, once when
 * it stops. A paused ride costs nothing.
 */
export const useRideSync = (state: RaysState, ref: RefObject<HTMLElement | null>, isPlaying: boolean) => {
    useEffect(() => {
        const sync = () => {
            const time = animationOf(ref.current)?.currentTime;
            if (typeof time === 'number') {
                const { tx, dir } = rideAt(time);
                state.set(tx, dir);
            }
        };

        sync();
        if (!isPlaying) {
            return;
        }

        let frame = requestAnimationFrame(function step() {
            sync();
            frame = requestAnimationFrame(step);
        });

        return () => cancelAnimationFrame(frame);
    }, [state, ref, isPlaying]);
};
