'use client';

import '@/components/panorama.css';

import { bumpCloud } from '@/components/Clouds/bumpCloud';
import { random } from '@/components/Clouds/random';

import type { BumpCloudOptions } from '@/components/Clouds/bumpCloud';
import type { CSSProperties } from 'react';

/** Night colours to compare: body and underside. A is what the panorama uses today. */
const CANDIDATES = [
    { id: 'A', note: 'today', body: 'oklch(0.42 0.055 266)', shade: 'oklch(0.29 0.07 272)' },
    { id: 'B', note: 'darker', body: 'oklch(0.33 0.05 266)', shade: 'oklch(0.23 0.06 272)' },
    { id: 'C', note: 'near silhouette', body: 'oklch(0.25 0.045 266)', shade: 'oklch(0.18 0.05 272)' },
    { id: 'D', note: 'moonlit crown, dark belly', body: 'oklch(0.44 0.03 250)', shade: 'oklch(0.24 0.05 270)' },
    { id: 'E', note: 'calm, low contrast', body: 'oklch(0.3 0.04 266)', shade: 'oklch(0.26 0.05 270)' },
    { id: 'F', note: 'blue, strong belly', body: 'oklch(0.37 0.07 268)', shade: 'oklch(0.2 0.06 276)' },
] as const;

/** The panorama's sky once astronomically dark (skyPalette at -18°). */
const NIGHT_SKY = 'linear-gradient(#060F22, #0A1630)';

const STRIP = { width: 1700, height: 260 };

/** A small sky: clouds of every bump type at fixed places. */
const PLACED: (Omit<BumpCloudOptions, 'light'> & { x: number; y: number })[] = [
    { type: 'cirrocumulus', seed: 4, x: 120, y: 40 },
    { type: 'cirrocumulus', seed: 17, x: 1350, y: 30 },
    { type: 'altocumulus', seed: 3, x: 520, y: 70 },
    { type: 'altocumulus', seed: 44, x: 1480, y: 95 },
    { type: 'cumulus', seed: 1, x: 60, y: 150 },
    { type: 'cumulus', seed: 43, x: 1020, y: 120 },
    { type: 'stratocumulus', seed: 2, x: 440, y: 200 },
];

const CLOUDS = PLACED.map(({ x, y, ...options }) => ({
    x,
    y,
    key: `${options.type}-${options.seed}`,
    ...bumpCloud(options),
}));

const STARS = (() => {
    const next = random(7);

    return Array.from({ length: 90 }, () => ({ x: next() * STRIP.width, y: next() * STRIP.height, r: 0.6 + next() }));
})();

const Strip = ({ body, shade }: { body: string; shade: string }) => (
    <svg
        viewBox={`0 0 ${STRIP.width} ${STRIP.height}`}
        style={{ display: 'block', width: '100%', background: NIGHT_SKY }}
    >
        {STARS.map(star => (
            <circle
                key={`${star.x}-${star.y}`}
                cx={star.x}
                cy={star.y}
                r={star.r}
                fill="#fff"
                opacity={0.7}
            />
        ))}
        <g
            className="clouds"
            style={
                {
                    '--n-b': body,
                    '--n-s': shade,
                    '--night': 1,
                    '--glow': 0,
                    '--glow-c': 'transparent',
                    animation: 'none',
                } as CSSProperties
            }
        >
            {CLOUDS.map(cloud => (
                <g
                    key={cloud.key}
                    transform={`translate(${cloud.x} ${cloud.y})`}
                >
                    <path
                        className="cloudBody"
                        d={cloud.body}
                    />
                    <path
                        className="cloudShade"
                        d={cloud.shade}
                    />
                </g>
            ))}
        </g>
    </svg>
);

/** Night colours for the clouds, side by side on the panorama's night sky. Dev tool, not part of the library. */
export default function CloudNightPage() {
    return (
        <main
            className="panorama"
            style={{ aspectRatio: 'auto', overflow: 'visible', textAlign: 'left', padding: 16, font: '14px system-ui' }}
        >
            {CANDIDATES.map(({ id, note, body, shade }) => (
                <section
                    key={id}
                    style={{ marginBottom: 16 }}
                >
                    <h2 style={{ font: '600 14px system-ui', margin: '0 0 4px' }}>
                        {id}: {note}{' '}
                        <code style={{ fontWeight: 400 }}>
                            body {body} · shade {shade}
                        </code>
                    </h2>
                    <Strip
                        body={body}
                        shade={shade}
                    />
                </section>
            ))}
        </main>
    );
}
