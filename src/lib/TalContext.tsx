import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

interface TalContextType {
    date: Date;
    time: number;
    animate: boolean;
}

const TalContext = createContext<TalContextType | undefined>(undefined);

export const TalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [animate, setAnimate] = useState<boolean>(false);

    const [date] = useState<Date>(new Date());

    const [time, setTime] = useState<number>(Date.now());

    const requestRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);

    const updateTimer = (timestamp: number) => {
        if (startTimeRef.current === null) {
            startTimeRef.current = timestamp;
        }
        const elapsed = timestamp - startTimeRef.current;

        setTime(time + (elapsed / 1000) * 60 * 60 * 60);
        requestRef.current = requestAnimationFrame(updateTimer);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(updateTimer);

        setTimeout(() => {
            setAnimate(true);
        }, 100);

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    return <TalContext.Provider value={{ time, date, animate }}>{children}</TalContext.Provider>;
};

export const useTal = (): TalContextType => {
    const context = useContext(TalContext);
    if (!context) {
        throw new Error('useTimer must be used within a TimerProvider');
    }
    return context;
};
