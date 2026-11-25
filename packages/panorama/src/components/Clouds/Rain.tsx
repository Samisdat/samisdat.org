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
    light: { count: 90, length: 46, angle: 9, width: 1, opacity: 0.5, duration: 1.2 },
    steady: { count: 260, length: 64, angle: 12, width: 1.1, opacity: 0.55, duration: 0.9 },
    heavy: { count: 520, length: 92, angle: 16, width: 1.3, opacity: 0.6, duration: 0.6 },
};

const random = (seed: number) => () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;

    return seed / 4294967296;
};

/** Drops of one opacity share a path: one element instead of hundreds keeps the browser's work per frame small. */
const OPACITY_STEPS = 3;

const strokes = (drops: Drops, seed: number) => {
    const next = random(seed);
    const slope = Math.tan((drops.angle * Math.PI) / 180);
    const paths = Array.from({ length: OPACITY_STEPS }, () => '');

    for (let index = 0; index < drops.count; index++) {
        const x = -200 + next() * (SKY_WIDTH + 400);
        const y = next() * HEIGHT;
        const length = drops.length * (0.45 + 0.75 * next());
        const step = Math.min(OPACITY_STEPS - 1, Math.floor(next() * OPACITY_STEPS));

        paths[step] += `M${x.toFixed(1)} ${y.toFixed(1)}l${(-length * slope).toFixed(1)} ${length.toFixed(1)}`;
    }

    return paths.map((d, step) => {
        const opacity = (drops.opacity * (0.4 + (0.6 * (step + 0.5)) / OPACITY_STEPS)).toFixed(2);

        return (
            <path
                key={opacity}
                d={d}
                strokeWidth={drops.width}
                opacity={opacity}
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
