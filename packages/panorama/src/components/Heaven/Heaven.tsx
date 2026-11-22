'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { getSkyState } from '@/lib/sky';
import { useTal } from '@/lib/TalContext';

import { ParallaxLayer } from '../ParallaxLayer';
import { Moon } from './Moon';
import { Sun } from './Sun';

// y of both end points of #sunAndMoonPath; the arc height is scaled around this line.
const ARC_BASELINE_Y = 275.894;

interface Point {
    x: number;
    y: number;
}

export const Heaven = () => {
    const pathRef = useRef<SVGPathElement>(null);

    const { time, sunTimes } = useTal();

    const [sunPosition, setSunPosition] = useState<Point>({ x: 146.43, y: 306 });
    const [moonPosition, setMoonPosition] = useState<Point>({
        x: 146.43,
        y: 306,
    });

    const { skyOpacity } = sunTimes;

    const { isDay, arcProgress: celestialProgress, arcHeightFactor } = useMemo(() => getSkyState(time), [time]);

    useEffect(() => {
        if (!pathRef.current) return;

        const pathLength = pathRef.current.getTotalLength();
        const distance = pathLength * celestialProgress;
        const point = pathRef.current.getPointAtLength(distance);

        // Only the height scales with the season; both end points lie on the baseline and stay put.
        const scaled = {
            x: point.x,
            y: ARC_BASELINE_Y - (ARC_BASELINE_Y - point.y) * arcHeightFactor,
        };

        if (isDay) {
            setSunPosition(scaled);
        } else {
            setMoonPosition(scaled);
        }
    }, [celestialProgress, arcHeightFactor, isDay]);

    return (
        <g id={'heaven'}>
            <defs>
                <linearGradient
                    id="dayskyGradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                >
                    <stop
                        offset="0%"
                        style={{ stopColor: '#0376BF' }}
                    />
                    <stop
                        offset="10%"
                        style={{ stopColor: '#0376BF' }}
                    />
                    <stop
                        offset="60%"
                        style={{ stopColor: '#A8D0F5' }}
                    />

                    <stop
                        offset="100%"
                        style={{ stopColor: '#A8D0F5' }}
                    />
                </linearGradient>

                <path
                    ref={pathRef}
                    id="sunAndMoonPath"
                    d="M432.747,275.894c-0,-0 -0.819,-23.505 -0.693,-55.807c0.409,-105.344 187.757,-167.513 419.022,-167.513c231.264,0 418.626,81.505 419.021,188.513c0.126,34.091 0.305,34.807 0.305,34.807"
                />
            </defs>

            <rect
                x="0"
                width="1700"
                height="500"
                fill="url(#dayskyGradient)"
            />
            <path
                className={'night'}
                id="night"
                d="M0,-0l0,500l1700,-0l0,-500l-1700,-0Z"
                opacity={skyOpacity}
                suppressHydrationWarning
            />
            <ParallaxLayer
                scrollspeed={15}
                depth={-7}
            >
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
            </ParallaxLayer>
        </g>
    );
};
