'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

type LiveListener = (event: unknown) => void;

/**
 * Fire-and-forget channel outside of React state, for per-frame data that
 * must not trigger renders. Listeners write straight into the DOM.
 */
export type LiveStore = {
    publish: (event: unknown) => void;
    subscribe: (listener: LiveListener) => () => void;
};

const createLiveStore = (): LiveStore => {
    const listeners = new Set<LiveListener>();
    return {
        publish: event => listeners.forEach(listener => listener(event)),
        subscribe: listener => {
            listeners.add(listener);
            return () => {
                listeners.delete(listener);
            };
        },
    };
};

type CtxValue = {
    values: Record<string, string>;
    setValue: (key: string, value: string) => void;
    live: LiveStore;
};

const Ctx = createContext<CtxValue | null>(null);

export function useDemoContext() {
    return useContext(Ctx);
}

export function DemoContext({ children, ...props }: { children?: ReactNode; [k: string]: unknown }) {
    const initial = Object.fromEntries(Object.entries(props).filter(([, v]) => typeof v === 'string')) as Record<
        string,
        string
    >;

    const [values, setValues] = useState(initial);
    const [live] = useState(createLiveStore);

    const setValue = useCallback((key: string, value: string) => setValues(prev => ({ ...prev, [key]: value })), []);

    return <Ctx.Provider value={{ values, setValue, live }}>{children}</Ctx.Provider>;
}
