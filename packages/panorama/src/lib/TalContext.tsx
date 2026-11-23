import { usePrefersReducedMotion } from '@samisdat/tools';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { computeSunTimes, type SunTimes } from './sunTimes';

export type { SunTimes };

interface TalContextType {
    animate: boolean;
    time: Date;
    timeFactor: number;
    setTimeFactor: (factor: number) => void;
    /** False once the clock has moved away from the real time. */
    atRealTime: boolean;
    paused: boolean;
    setPaused: (paused: boolean) => void;
    /** Normal speed, running, and the clock back on the real time. */
    reset: () => void;
    sunTimes: SunTimes;
}

/** How far the clock may be off the real time and still count as on it. */
const REAL_TIME_TOLERANCE_MS = 1500;

const TalContext = createContext<TalContextType | undefined>(undefined);

export const TalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const reduceMotion = usePrefersReducedMotion();
    const [paused, setPaused] = useState(false);
    const [atRealTime, setAtRealTime] = useState(true);
    const [animate, setAnimate] = useState<boolean>(false);

    const [time, setTime] = useState(() => new Date());
    const [timeFactor, setTimeFactor] = useState(1); // 1 = normal time

    const lastFrameRef = useRef<number | null>(null);
    const lastRealTimeRef = useRef(0);
    const simulatedTimeRef = useRef(time.getTime());

    const sunTimes = useMemo(() => computeSunTimes(time), [time]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimate(true);
        }, 100);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    useEffect(() => {
        const tick = (now: number) => {
            if (lastFrameRef.current != null) {
                const deltaReal = now - lastRealTimeRef.current;
                const deltaSim = deltaReal * timeFactor;

                if (!reduceMotion && !paused) {
                    simulatedTimeRef.current += deltaSim;
                }

                setAtRealTime(Math.abs(simulatedTimeRef.current - Date.now()) < REAL_TIME_TOLERANCE_MS);
                setTime(() => {
                    return new Date(simulatedTimeRef.current);
                });
            }
            lastRealTimeRef.current = now;
            lastFrameRef.current = requestAnimationFrame(tick);
        };

        lastFrameRef.current = requestAnimationFrame(tick);
        return () => {
            if (lastFrameRef.current) cancelAnimationFrame(lastFrameRef.current);
        };
    }, [timeFactor, reduceMotion, paused]);

    const reset = useCallback(() => {
        simulatedTimeRef.current = Date.now();
        setTimeFactor(1);
        setPaused(false);
        setAtRealTime(true);
        setTime(new Date(simulatedTimeRef.current));
    }, []);

    const value = useMemo(
        () => ({ animate, time, timeFactor, setTimeFactor, atRealTime, paused, setPaused, reset, sunTimes }),
        [animate, time, timeFactor, atRealTime, paused, reset, sunTimes]
    );

    return <TalContext.Provider value={value}>{children}</TalContext.Provider>;
};

export const useTal = (): TalContextType => {
    const context = useContext(TalContext);
    if (!context) {
        throw new Error('useTalmust be used within a TalProvider');
    }
    return context;
};
