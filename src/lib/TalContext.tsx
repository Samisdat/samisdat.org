import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

interface TalContextType {
    animate: boolean;
    time: Date;
    timeFactor: number;
    setTimeFactor: (factor: number) => void;
}

const TalContext = createContext<TalContextType | undefined>(undefined);

export const TalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [animate, setAnimate] = useState<boolean>(false);

    const [time, setTime] = useState(() => new Date());
    const [timeFactor, setTimeFactor] = useState(1000); // Default: 10x Geschwindigkeit

    const lastFrameRef = useRef<number | null>(null);
    const lastRealTimeRef = useRef(performance.now());
    const simulatedTimeRef = useRef(time.getTime());

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
                const deltaReal = now - lastRealTimeRef.current; // in ms
                const deltaSim = deltaReal * timeFactor;
                simulatedTimeRef.current += deltaSim;
                setTime(new Date(simulatedTimeRef.current));
            }
            lastRealTimeRef.current = now;
            lastFrameRef.current = requestAnimationFrame(tick);
        };

        lastFrameRef.current = requestAnimationFrame(tick);
        return () => {
            if (lastFrameRef.current) cancelAnimationFrame(lastFrameRef.current);
        };
    }, [timeFactor]);

    return <TalContext.Provider value={{ animate, time, timeFactor, setTimeFactor }}>{children}</TalContext.Provider>;
};

export const useTal = (): TalContextType => {
    const context = useContext(TalContext);
    if (!context) {
        throw new Error('useTalmust be used within a TalProvider');
    }
    return context;
};
