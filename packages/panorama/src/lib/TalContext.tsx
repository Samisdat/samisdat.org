import { usePrefersReducedMotion } from '@samisdat/tools';
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { computeSunTimes, type SunTimes } from './sunTimes';

export type { SunTimes };

interface TalContextType {
    animate: boolean;
    time: Date;
    timeFactor: number;
    setTimeFactor: (factor: number) => void;
    sunTimes: SunTimes;
}

const TalContext = createContext<TalContextType | undefined>(undefined);

export const TalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const reduceMotion = usePrefersReducedMotion();
    const [animate, setAnimate] = useState<boolean>(false);

    const [time, setTime] = useState(() => new Date());
    const [timeFactor, setTimeFactor] = useState(1000); // Default: 10x Geschwindigkeit

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

                if (!reduceMotion) {
                    simulatedTimeRef.current += deltaSim;
                }

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
    }, [timeFactor, reduceMotion]);

    const value = useMemo(
        () => ({ animate, time, timeFactor, setTimeFactor, sunTimes }),
        [animate, time, timeFactor, setTimeFactor, sunTimes]
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
