import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

interface TalContextType {
    date?: number;
    time: number;
}

const TalContext = createContext<TalContextType | undefined>(undefined);

export const TalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [time, setTime] = useState<number>(0);

    const requestRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);

    const updateTimer = (timestamp: number) => {
        if (startTimeRef.current === null) startTimeRef.current = timestamp;
        const elapsed = timestamp - startTimeRef.current;
        setTime(elapsed / 1000);
        requestRef.current = requestAnimationFrame(updateTimer);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(updateTimer);
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    return <TalContext.Provider value={{ time }}>{children}</TalContext.Provider>;
};

export const useTal = (): TalContextType => {
    const context = useContext(TalContext);
    if (!context) {
        throw new Error('useTimer must be used within a TimerProvider');
    }
    return context;
};
