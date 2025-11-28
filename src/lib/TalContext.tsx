import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import SunCalc from 'suncalc';

const LAT = 51.2562;
const LNG = 7.1508;

export interface SunTimes {
    sunrise: number;
    sunset: number;
    dawn: number;
    dusk: number;
    currentTime: number;
    isDay: boolean;
    skyOpacity: number;
    windowOpacity: number;
}

interface TalContextType {
    animate: boolean;
    time: Date;
    timeFactor: number;
    setTimeFactor: (factor: number) => void;
    sunTimes: SunTimes;
}

const TalContext = createContext<TalContextType | undefined>(undefined);

export const TalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [animate, setAnimate] = useState<boolean>(false);

    const [time, setTime] = useState(() => new Date());
    const [timeFactor, setTimeFactor] = useState(1000); // Default: 10x Geschwindigkeit

    const lastFrameRef = useRef<number | null>(null);
    const lastRealTimeRef = useRef(performance.now());
    const simulatedTimeRef = useRef(time.getTime());

    const sunTimes = useMemo(() => {
        const times = SunCalc.getTimes(time, LAT, LNG);
        const sunrise = times.sunrise.getTime();
        const sunset = times.sunset.getTime();
        const dawn = times.dawn.getTime();
        const dusk = times.dusk.getTime();
        const currentTime = time.getTime();
        const isDay = currentTime >= sunrise && currentTime < sunset;

        const dawnDuration = sunrise - dawn;
        const duskDuration = dusk - sunset;

        let skyOpacity = 1;
        if (currentTime < dawn) skyOpacity = 1;
        else if (currentTime < sunrise) skyOpacity = 1 - (currentTime - dawn) / dawnDuration;
        else if (currentTime < sunset) skyOpacity = 0;
        else if (currentTime < dusk) skyOpacity = (currentTime - sunset) / duskDuration;

        let windowOpacity = 0;
        if (currentTime >= sunset && currentTime < dusk) {
            windowOpacity = (currentTime - sunset) / duskDuration;
        } else if (currentTime >= dusk || currentTime < dawn) {
            windowOpacity = 1;
        } else if (currentTime >= dawn && currentTime < sunrise) {
            windowOpacity = 1 - (currentTime - dawn) / dawnDuration;
        }

        return {
            sunrise,
            sunset,
            dawn,
            dusk,
            currentTime,
            isDay,
            skyOpacity,
            windowOpacity,
        };
    }, [time]);

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

    return (
        <TalContext.Provider value={{ animate, time, timeFactor, setTimeFactor, sunTimes }}>
            {children}
        </TalContext.Provider>
    );
};

export const useTal = (): TalContextType => {
    const context = useContext(TalContext);
    if (!context) {
        throw new Error('useTalmust be used within a TalProvider');
    }
    return context;
};
