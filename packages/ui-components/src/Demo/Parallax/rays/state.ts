import { useEffect, useRef } from 'react';

import { XMIN } from './scene';

type Listener = (tx: number, dir: number) => void;

/**
 * Where the train is and which way it drives. The ride itself is a CSS animation; this state mirrors it
 * for the views that cannot be written in CSS (the map). Views subscribe and write straight into their DOM,
 * so a frame creates no React renders.
 */
export type RaysState = {
    tx: number;
    /** direction of travel: 1 forward, -1 back */
    dir: number;
    subscribe: (listener: Listener) => () => void;
    set: (tx: number, dir?: number) => void;
};

export const createRaysState = (): RaysState => {
    const listeners = new Set<Listener>();
    const state: RaysState = {
        tx: XMIN,
        dir: 1,
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
    };

    return state;
};

/** Subscribes an effect-style callback to the state; the callback runs once right away. */
export const useRaysView = (state: RaysState, view: Listener) => {
    const latest = useRef(view);

    useEffect(() => {
        latest.current = view;
    });
    useEffect(() => state.subscribe((tx, dir) => latest.current(tx, dir)), [state]);
};
