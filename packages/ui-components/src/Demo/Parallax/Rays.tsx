'use client';

import { styled } from '@linaria/react';
import { useEffect, useId, useState } from 'react';

import { DemoAnimation } from '../../DemoAnimation';
import { SPEED_MULTIPLIER_PROPS } from '../../PlaybackControl/useSpeedDuration';
import { MapView } from './rays/MapView';
import { panoramaTheme } from './rays/panoramaTheme';
import { XMIN } from './rays/scene';
import { createRaysState, useRaysClock } from './rays/state';
import { WindowView } from './rays/WindowView';

/* Semantic tokens only; the demo is dark by design (force-theme-dark). */
const Styling = styled.div`
    display: grid;
    gap: 0.75rem;

    & svg {
        display: block;
        width: 100%;
        height: auto;
        border-radius: 0.5rem;
    }

    & .map-bg,
    & .sky {
        fill: var(--color-surface-emphasis);
    }
    & .ground {
        fill: var(--color-surface-subtle);
    }
    & .horizon,
    & .rail line {
        stroke: var(--color-border-muted);
    }
    & .frame {
        fill: none;
        stroke: var(--color-border-default);
        stroke-width: 4;
    }
    & .axis,
    & .cone {
        stroke: var(--color-ink-turquoise);
        stroke-dasharray: 5 5;
    }
    & .axis {
        stroke-opacity: 0.6;
    }
    & .cone {
        fill: var(--color-ink-turquoise);
        fill-opacity: 0.07;
        stroke-opacity: 0.5;
    }
    & .contour {
        fill: none;
        stroke: var(--color-ink-amethyst);
        stroke-opacity: 0.3;
    }
    & .contour.index {
        stroke-opacity: 0.6;
        stroke-width: 1.5;
    }
    & .rail line {
        stroke-width: 1.5;
    }
    & .train rect {
        fill: var(--color-ink-turquoise);
    }
    & .train circle {
        fill: var(--color-ink-gold);
    }

    & .k-tree .wedge,
    & .k-tree circle,
    & .crown {
        fill: var(--color-ink-jade);
    }
    & .k-house .wedge,
    & .house-mark rect,
    & .wall {
        fill: var(--color-ink-lapis);
    }
    & .k-hill .wedge,
    & .hill-mark {
        fill: var(--color-ink-amethyst);
    }
    & .wedge {
        fill-opacity: 0.5;
    }
    & .ray {
        stroke-width: 1.5;
        stroke-opacity: 0.7;
    }
    & .k-tree .ray {
        stroke: var(--color-ink-jade);
    }
    & .k-house .ray,
    & .house-mark line {
        stroke: var(--color-ink-lapis);
    }
    & .k-hill .ray {
        stroke: var(--color-ink-amethyst);
    }
    & .trunk {
        fill: var(--color-ink-copper);
    }
    & .roof {
        fill: var(--color-ink-steel);
    }
    & .opening {
        fill: var(--color-surface-emphasis);
    }
    & .ridge {
        fill: var(--color-ink-amethyst);
    }
    & .ridge.far {
        fill-opacity: 0.4;
    }
    & .ridge.near {
        fill-opacity: 0.75;
    }
`;

/**
 * Train passing trees, a house and hills: top-down map with sight rays and the angle each ray swept in the
 * last half second, and below it the window view of the same scene.
 */
export const DemoParallaxRays = ({ variant = 'tokens' }: { variant?: 'tokens' | 'panorama' }) => {
    const ids = [useId(), useId()];
    const [state] = useState(() => createRaysState(false));
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(1);

    useRaysClock(state);
    useEffect(() => {
        state.setPlaying(isPlaying);
    }, [isPlaying, state]);
    useEffect(() => {
        state.setSpeed(speed);
    }, [speed, state]);

    const onReset = () => {
        state.set(XMIN, 1);
        setIsPlaying(false);
        setSpeed(1);
    };

    return (
        <DemoAnimation
            playbackControl={{
                isPlaying,
                ...SPEED_MULTIPLIER_PROPS,
                speedControl: true,
                speed,
                onSpeedChange: setSpeed,
                onPlay: () => setIsPlaying(true),
                onPause: () => setIsPlaying(false),
                onReset,
            }}
        >
            <Styling className={`force-theme-dark ${variant === 'panorama' ? panoramaTheme : ''}`} data-variant={variant}>
                <MapView state={state} titleId={ids[0]} />
                <WindowView state={state} titleId={ids[1]} panorama={variant === 'panorama'} />
            </Styling>
        </DemoAnimation>
    );
};
