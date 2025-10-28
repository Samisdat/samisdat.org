'use client';

import { useTal } from '@/lib/TalContext';
import { useEffect, useRef, useState } from 'react';
import SunCalc from 'suncalc';
import { Moon } from './Moon';
import { Stars } from './Stars';
import { Sun } from './Sun';

const LAT = 51.2562;
const LNG = 7.1508;
const MILISECS_PER_DAY = 24 * 60 * 60 * 1000;

interface Point {
    x: number;
    y: number;
}

export const Heaven = () => {
    const { time, sunTimes } = useTal();
    const pathRef = useRef<SVGPathElement>(null);
    const [sunPosition, setSunPosition] = useState<Point>({ x: 146.43, y: 306 });
    const [moonPosition, setMoonPosition] = useState<Point>({ x: 146.43, y: 306 });

    const { sunrise, sunset, currentTime, isDay, skyOpacity } = sunTimes;

    const celestialProgress = (() => {
        if (isDay) {
            const dayDuration = sunset - sunrise;
            return Math.max(0, Math.min(1, (currentTime - sunrise) / dayDuration));
        } else {
            const nextDay = new Date(time);
            nextDay.setDate(nextDay.getDate() + 1);
            const nextSunrise = SunCalc.getTimes(nextDay, LAT, LNG).sunrise.getTime();

            if (currentTime >= sunset) {
                const nightDuration = nextSunrise - sunset;
                return Math.max(0, Math.min(1, (currentTime - sunset) / nightDuration));
            } else {
                const prevDay = new Date(time);
                prevDay.setDate(prevDay.getDate() - 1);
                const prevSunset = SunCalc.getTimes(prevDay, LAT, LNG).sunset.getTime();
                const nightDuration = sunrise - prevSunset;
                const timeSincePrevSunset =
                    MILISECS_PER_DAY - (prevSunset % MILISECS_PER_DAY) + (currentTime % MILISECS_PER_DAY);
                return Math.max(0, Math.min(1, timeSincePrevSunset / nightDuration));
            }
        }
    })();

    useEffect(() => {
        if (!pathRef.current) return;

        const pathLength = pathRef.current.getTotalLength();
        const distance = pathLength * celestialProgress;
        const point = pathRef.current.getPointAtLength(distance);

        if (isDay) {
            setSunPosition({ x: point.x, y: point.y });
        } else {
            setMoonPosition({ x: point.x, y: point.y });
        }
    }, [time, isDay, celestialProgress]);

    return (
        <g id={'heaven'}>
            <defs>
                <linearGradient
                    id="heavenGradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                >
                    <stop
                        offset="0%"
                        style={{ stopColor: '#2F95E5', stopOpacity: 1 }}
                    />
                    <stop
                        offset="100%"
                        style={{ stopColor: '#72B7ED', stopOpacity: 1 }}
                    />
                </linearGradient>

                <path
                    ref={pathRef}
                    id="sunAndMoonPath"
                    d="M146.43,306C146.43,306 145.247,257.566 145.428,210.872C146.02,58.59 416.844,41 751.152,41C1085.46,41 1356.31,56.184 1356.88,210.872C1357.06,260.153 1357.32,306 1357.32,306"
                />
            </defs>
            <rect
                x="0"
                width="1500"
                height="400"
            />
            <rect
                x="0"
                width="1500"
                height="400"
                fill="url(#heavenGradient)"
                opacity={skyOpacity}
            />

            <path
                style={{ stroke: '#f00' }}
                strokeWidth={3}
                id="sunAndMoonPath"
                d="M146.43,306C146.43,306 145.247,257.566 145.428,210.872C146.02,58.59 416.844,41 751.152,41C1085.46,41 1356.31,56.184 1356.88,210.872C1357.06,260.153 1357.32,306 1357.32,306"
            />

            {!isDay && <Stars opacity={1 - skyOpacity} />}

            {isDay && (
                <Sun
                    x={sunPosition.x}
                    y={sunPosition.y}
                />
            )}

            {!isDay && (
                <Moon
                    x={moonPosition.x}
                    y={moonPosition.y}
                />
            )}
        </g>
    );
};
