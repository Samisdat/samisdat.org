'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { getSkyState, seasonFromArcHeight, skyPalette } from '@/lib/sky';
import { useTal } from '@/lib/TalContext';

import { Clouds } from '../Clouds/Clouds';
import { Moon } from './Moon';
import { SkyGradient } from './SkyGradient';
import { Stars } from './Stars';
import { Sun } from './Sun';

// y of both end points of #sunAndMoonPath; the arc height is scaled around this line.
const ARC_BASELINE_Y = 275.894;

interface Point {
    x: number;
    y: number;
}

export const Heaven = () => {
    const pathRef = useRef<SVGPathElement>(null);

    const { time, weather } = useTal();

    const [sunPosition, setSunPosition] = useState<Point>({ x: 146.43, y: 306 });
    const [moonPosition, setMoonPosition] = useState<Point>({
        x: 146.43,
        y: 306,
    });

    const sky = useMemo(() => getSkyState(time), [time]);
    const { isDay, arcProgress: celestialProgress, arcHeightFactor } = sky;

    // The colours follow the real sun altitude; the season comes from the arc height of the day.
    const palette = useMemo(
        () => skyPalette(sky.sunAltitudeDeg, seasonFromArcHeight(arcHeightFactor)),
        [sky.sunAltitudeDeg, arcHeightFactor]
    );

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
                <SkyGradient palette={palette} />

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
            <Stars amount={palette.stars} />
            {/* Sun and moon are infinitely far away: no parallax layer, only their own path moves them */}
            {isDay && (
                <Sun
                    x={sunPosition.x}
                    y={sunPosition.y}
                    color={palette.sun}
                    scale={palette.sunScale}
                    glow={palette.glow}
                />
            )}

            {!isDay && (
                <Moon
                    x={moonPosition.x}
                    y={moonPosition.y}
                />
            )}

            <Clouds
                weather={weather}
                night={palette.night}
                glow={{ color: palette.cloudLight, amount: palette.glow }}
            />
        </g>
    );
};
