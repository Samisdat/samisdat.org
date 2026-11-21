import { CSSProperties } from 'react';

import { useTal } from '@/lib/TalContext';
import { Rain as RainIntensity } from '@/lib/weather';

import { SKY_WIDTH } from './cloudLayout';

const HEIGHT = 500;

interface Drops {
    count: number;
    length: number;
    angle: number;
    width: number;
    opacity: number;
    /** Seconds for a drop to fall the height of the panorama. */
    duration: number;
}

const DROPS: Record<Exclude<RainIntensity, 'none'>, Drops> = {
    light: { count: 70, length: 26, angle: 8, width: 1.6, opacity: 0.45, duration: 1.1 },
    steady: { count: 210, length: 32, angle: 10, width: 1.8, opacity: 0.55, duration: 0.8 },
    heavy: { count: 480, length: 44, angle: 16, width: 2, opacity: 0.6, duration: 0.55 },
};

const random = (seed: number) => () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;

    return seed / 4294967296;
};

const strokes = (drops: Drops, seed: number) => {
    const next = random(seed);
    const run = drops.length * Math.tan((drops.angle * Math.PI) / 180);

    return Array.from({ length: drops.count }, (_, index) => {
        const x = -200 + next() * (SKY_WIDTH + 400);
        const y = next() * HEIGHT;

        return (
            <line
                key={index}
                x1={x}
                y1={y}
                x2={x - run}
                y2={y + drops.length}
                strokeWidth={drops.width}
                opacity={drops.opacity * (0.55 + 0.45 * next())}
            />
        );
    });
};

/** Slanted rain over the whole panorama. Two tiles, so the fall loops without a seam. */
export const Rain = () => {
    const { weather } = useTal();

    if ('none' === weather.rain) {
        return null;
    }

    const drops = DROPS[weather.rain];
    const lines = strokes(drops, drops.count);

    return (
        <g className="rain">
            <g
                className="rainFall"
                style={
                    {
                        ['--duration' as string]: `${drops.duration}s`,
                        ['--run' as string]: `${-HEIGHT * Math.tan((drops.angle * Math.PI) / 180)}px`,
                    } as CSSProperties
                }
            >
                <g>{lines}</g>
                <g transform={`translate(0 ${-HEIGHT})`}>{lines}</g>
            </g>
        </g>
    );
};
