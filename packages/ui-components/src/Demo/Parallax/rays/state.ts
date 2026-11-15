import { useEffect, useRef } from 'react';

import { V, XMAX, XMIN } from './scene';

type Listener = (tx: number, dir: number) => void;

/**
 * Shared state of the demo: the train position and whether it runs. Views subscribe and write straight
 * into their DOM, so a frame creates no React renders. More views (e.g. the layer view) can subscribe too.
 */
export type RaysState = {
    tx: number;
    /** direction of travel: 1 forward, -1 back */
    dir: number;
    playing: boolean;
    /** playback multiplier */
    speed: number;
    subscribe: (listener: Listener) => () => void;
    /** advance by dt seconds (only while playing); the train drives there and back */
    tick: (dt: number) => void;
    set: (tx: number, dir?: number) => void;
    setPlaying: (playing: boolean) => void;
    setSpeed: (speed: number) => void;
};

export const createRaysState = (playing: boolean): RaysState => {
    const listeners = new Set<Listener>();
    const state: RaysState = {
        tx: XMIN,
        dir: 1,
        playing,
        speed: 1,
        subscribe: listener => {
            listeners.add(listener);
            listener(state.tx, state.dir);

            return () => {
                listeners.delete(listener);
            };
        },
        set: (tx, dir = state.dir) => {
            state.tx = tx;
            state.dir = dir;
            listeners.forEach(listener => listener(tx, dir));
        },
        setPlaying: playing => {
            state.playing = playing;
        },
        setSpeed: speed => {
            state.speed = speed;
        },
        tick: dt => {
            if (!state.playing) {
                return;
            }
            const next = state.tx + state.dir * V * dt * state.speed;
            // turn around at both ends, keeping the overshoot so the speed stays even
            if (next > XMAX) {
                state.set(2 * XMAX - next, -1);
            } else if (next < XMIN) {
                state.set(2 * XMIN - next, 1);
            } else {
                state.set(next);
            }
        },
    };

    return state;
};

/** Runs the animation frames. dt is capped at 50 ms so nothing jumps after a tab switch. */
export const useRaysClock = (state: RaysState) => {
    const frame = useRef(0);

    useEffect(() => {
        let last: number | null = null;
        const step = (ts: number) => {
            state.tick(last === null ? 0 : Math.min(0.05, (ts - last) / 1000));
            last = ts;
            frame.current = requestAnimationFrame(step);
        };
        frame.current = requestAnimationFrame(step);

        return () => cancelAnimationFrame(frame.current);
    }, [state]);
};

/** Subscribes an effect-style callback to the state; the callback runs once right away. */
export const useRaysView = (state: RaysState, view: Listener) => {
    const latest = useRef(view);

    useEffect(() => {
        latest.current = view;
    });
    useEffect(() => state.subscribe((tx, dir) => latest.current(tx, dir)), [state]);
};
