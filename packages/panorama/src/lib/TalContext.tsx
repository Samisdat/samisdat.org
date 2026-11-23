import { usePrefersReducedMotion } from '@samisdat/tools';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { computeSunTimes, type SunTimes } from './sunTimes';
import { useWeather } from './useWeather';
import { Weather } from './weather';

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
    weather: Weather;
}

/** How far the clock may be off the real time and still count as on it. */
const REAL_TIME_TOLERANCE_MS = 1500;

const TalContext = createContext<TalContextType | undefined>(undefined);

export const TalProvider: React.FC<{ children: React.ReactNode; weather?: Weather }> = ({
    children,
    weather: forced,
}) => {
    const reduceMotion = usePrefersReducedMotion();
    const [paused, setPaused] = useState(false);
    const [atRealTime, setAtRealTime] = useState(true);
    const [animate, setAnimate] = useState<boolean>(false);

    const [time, setTime] = useState(() => new Date());
    const [timeFactor, setTimeFactor] = useState(1); // 1 = normal time

    const lastFrameRef = useRef<number | null>(null);
    const lastRealTimeRef = useRef(0);
    const simulatedTimeRef = useRef(time.getTime());
    const pinnedRef = useRef(false);

    const weather = useWeather(time, forced);

    const sunTimes = useMemo(() => computeSunTimes(time), [time]);

    // `?time=2026-12-21T15:30:00Z` pins the clock for testing and screenshots.
    useEffect(() => {
        const pinned = new Date(new URLSearchParams(window.location.search).get('time') ?? '');

        if (Number.isNaN(pinned.getTime())) {
            return;
        }

        // The animation loop publishes the time; a pinned clock does not advance.
        simulatedTimeRef.current = pinned.getTime();
        pinnedRef.current = true;
    }, []);

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

                if (!reduceMotion && !paused && !pinnedRef.current) {
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
        () => ({ animate, time, timeFactor, setTimeFactor, atRealTime, paused, setPaused, reset, sunTimes, weather }),
        [animate, time, timeFactor, atRealTime, paused, reset, sunTimes, weather]
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
