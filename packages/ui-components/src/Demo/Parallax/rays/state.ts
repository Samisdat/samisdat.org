import { useEffect, useRef } from 'react';

import { V, XMAX, XMIN } from './scene';

type Listener = (tx: number) => void;

/**
 * Shared state of the demo: the train position and whether it runs. Views subscribe and write straight
 * into their DOM, so a frame creates no React renders. More views (e.g. the layer view) can subscribe too.
 */
export type RaysState = {
    tx: number;
    playing: boolean;
    subscribe: (listener: Listener) => () => void;
    /** advance by dt seconds (only while playing) */
    tick: (dt: number) => void;
    set: (tx: number) => void;
    setPlaying: (playing: boolean) => void;
};

export const createRaysState = (playing: boolean): RaysState => {
    const listeners = new Set<Listener>();
    const state: RaysState = {
        tx: XMIN,
        playing,
        subscribe: listener => {
            listeners.add(listener);
            listener(state.tx);

            return () => {
                listeners.delete(listener);
            };
        },
        set: tx => {
            state.tx = tx;
            listeners.forEach(listener => listener(tx));
        },
        setPlaying: playing => {
            state.playing = playing;
        },
        tick: dt => {
            if (!state.playing) {
                return;
            }
            state.set(state.tx + V * dt > XMAX ? XMIN : state.tx + V * dt);
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
    useEffect(() => state.subscribe(tx => latest.current(tx)), [state]);
};
