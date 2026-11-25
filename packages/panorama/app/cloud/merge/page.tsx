'use client';

import '@/components/panorama.css';

import { useEffect, useRef, useState } from 'react';

import { bumpCloud } from '@/components/Clouds/bumpCloud';

import type { CSSProperties } from 'react';

const STRIP = { width: 1200, height: 160, base: 140 };

const CLOUDS = [bumpCloud({ seed: 3, type: 'cumulus' }), bumpCloud({ seed: 43, type: 'cumulus' })];

const COLOURS = {
    '--d-b': '#d7d7d7',
    '--d-s': '#a7bed0',
    '--night': 0,
    '--glow': 0,
    '--glow-c': 'transparent',
    animation: 'none',
} as CSSProperties;

/** Left edge of each cloud, wrapping around the strip. */
type Positions = [number, number];

const wrap = (x: number, width: number) =>
    ((((x + width) % (STRIP.width + width)) + STRIP.width + width) % (STRIP.width + width)) - width;

/** Moves both clouds; once they overlap and `stick` is on, they go on together at the mean speed. */
const useDrift = (speeds: [number, number], stick: boolean) => {
    const [positions, setPositions] = useState<Positions>([40, 700]);
    const joined = useRef(false);

    useEffect(() => {
        joined.current = false;
    }, [stick]);

    useEffect(() => {
        let last = performance.now();
        let frame = 0;

        const tick = (now: number) => {
            const seconds = (now - last) / 1000;

            last = now;
            setPositions(([a, b]) => {
                const overlap =
                    Math.abs(a + CLOUDS[0].width / 2 - (b + CLOUDS[1].width / 2)) <
                    (CLOUDS[0].width + CLOUDS[1].width) * 0.3;

                joined.current = stick && (joined.current || overlap);
                const mean = (speeds[0] + speeds[1]) / 2;
                const [va, vb] = joined.current ? [mean, mean] : speeds;

                return [wrap(a + va * seconds, CLOUDS[0].width), wrap(b + vb * seconds, CLOUDS[1].width)];
            });
            frame = requestAnimationFrame(tick);
        };

        frame = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(frame);
    }, [speeds, stick]);

    return positions;
};

const y = (index: number) => STRIP.base - CLOUDS[index].height;

/** Each cloud whole: body and underside of the first, then of the second. The front one covers the back one. */
const Separate = ({ positions }: { positions: Positions }) => (
    <>
        {CLOUDS.map((cloud, index) => (
            <g
                key={cloud.body}
                transform={`translate(${positions[index]} ${y(index)})`}
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
    </>
);

/** Both bodies first, then both undersides: light flows into light, dark into dark, and the pair reads as one cloud. */
const Merged = ({ positions }: { positions: Positions }) => (
    <>
        {(['body', 'shade'] as const).map(part => (
            <g
                key={part}
                className={'body' === part ? 'cloudBody' : 'cloudShade'}
            >
                {CLOUDS.map((cloud, index) => (
                    <path
                        key={cloud.body}
                        transform={`translate(${positions[index]} ${y(index)})`}
                        d={cloud[part]}
                    />
                ))}
            </g>
        ))}
    </>
);

const Strip = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section>
        <h2 style={{ font: '600 14px system-ui', margin: '0 0 4px' }}>{title}</h2>
        <svg
            viewBox={`0 0 ${STRIP.width} ${STRIP.height}`}
            style={{ display: 'block', width: '100%', background: 'linear-gradient(#0376bf, #a8d0f5)' }}
        >
            <g
                className="clouds"
                style={COLOURS}
            >
                {children}
            </g>
        </svg>
    </section>
);

/** Two cumulus at one height and different speeds, drawn apart and drawn as one. Prototype, not part of the library. */
export default function CloudMergePage() {
    const [speeds, setSpeeds] = useState<[number, number]>([60, 20]);
    const [stick, setStick] = useState(false);
    const positions = useDrift(speeds, stick);

    return (
        <main
            className="panorama"
            style={{
                aspectRatio: 'auto',
                boxSizing: 'border-box',
                overflow: 'visible',
                textAlign: 'left',
                padding: 16,
                display: 'grid',
                gap: 12,
                font: '14px system-ui',
            }}
        >
            <section style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
                {speeds.map((speed, index) => (
                    <label key={CLOUDS[index].body}>
                        cloud {index + 1}: {speed} px/s{' '}
                        <input
                            type="range"
                            min={0}
                            max={150}
                            value={speed}
                            onChange={event =>
                                setSpeeds(
                                    index === 0
                                        ? [Number(event.target.value), speeds[1]]
                                        : [speeds[0], Number(event.target.value)]
                                )
                            }
                        />
                    </label>
                ))}
                <label>
                    <input
                        type="checkbox"
                        checked={stick}
                        onChange={event => setStick(event.target.checked)}
                    />{' '}
                    stay together once they touch
                </label>
            </section>
            <Strip title="separate: each cloud drawn whole">
                <Separate positions={positions} />
            </Strip>
            <Strip title="merged: all bodies, then all undersides">
                <Merged positions={positions} />
            </Strip>
        </main>
    );
}
