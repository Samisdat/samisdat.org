'use client';

import '@/components/panorama.css';

import { useEffect, useMemo, useState } from 'react';

import { bumpCloud, BumpCloudType } from '@/components/Clouds/bumpCloud';
import { splitCloud } from '@/components/Clouds/splitCloud';

import type { DrawnCloud } from '@/components/Clouds/cloudOutline';
import type { CSSProperties } from 'react';

const STRIP = { width: 1400, height: 170, base: 150, start: 120 };

/** Seconds until the cloud is put back together and parts again. */
const LOOP = 14;

const COLOURS = {
    '--d-b': '#d7d7d7',
    '--d-s': '#a7bed0',
    '--night': 0,
    '--glow': 0,
    '--glow-c': 'transparent',
    animation: 'none',
} as CSSProperties;

/** Seconds since the last start; starts over every `LOOP` seconds or when `restart` changes. */
const useClock = (restart: number) => {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        const begin = performance.now();
        let frame = 0;
        const tick = (now: number) => {
            setSeconds(((now - begin) / 1000) % LOOP);
            frame = requestAnimationFrame(tick);
        };

        frame = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(frame);
    }, [restart]);

    return seconds;
};

interface Setup {
    type: BumpCloudType;
    seed: number;
    at: number;
    speeds: [number, number];
}

const Range = ({
    label,
    value,
    min,
    max,
    step,
    onChange,
}: {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (value: number) => void;
}) => (
    <label>
        {label}: {value}{' '}
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={event => onChange(Number(event.target.value))}
        />
    </label>
);

/** The halves on the sky: all bodies first, then all undersides, so where they still touch they read as one cloud. */
const Sky = ({ halves, x, y }: { halves: DrawnCloud[]; x: (index: number) => number; y: number }) => (
    // Not a direct child of .panorama, whose svg children are placed absolutely.
    <div>
        <svg
            viewBox={`0 0 ${STRIP.width} ${STRIP.height}`}
            style={{ display: 'block', width: '100%', background: 'linear-gradient(#0376bf, #a8d0f5)' }}
        >
            <g
                className="clouds"
                style={COLOURS}
            >
                {(['body', 'shade'] as const).map(part => (
                    <g
                        key={part}
                        className={'body' === part ? 'cloudBody' : 'cloudShade'}
                    >
                        {halves.map((half, index) => (
                            <path
                                key={half.body}
                                transform={`translate(${x(index)} ${y})`}
                                d={half[part]}
                            />
                        ))}
                    </g>
                ))}
            </g>
        </svg>
    </div>
);

/** One cloud that parts at a notch into two smaller ones drifting on at their own speeds. Prototype, not part of the library. */
export default function CloudSplitPage() {
    const [setup, setSetup] = useState<Setup>({ type: 'stratocumulus', seed: 5, at: 0.5, speeds: [15, 45] });
    const [restart, setRestart] = useState(0);
    const seconds = useClock(restart);
    const { type, seed, at, speeds } = setup;
    const halves = useMemo(() => splitCloud({ seed, type }, at), [seed, type, at]);
    const { height } = useMemo(() => bumpCloud({ seed, type }), [seed, type]);
    const y = STRIP.base - height;
    const x = (index: number) => STRIP.start + speeds[index] * seconds;

    return (
        <main
            className="panorama"
            style={{
                aspectRatio: 'auto',
                overflow: 'visible',
                textAlign: 'left',
                padding: 16,
                boxSizing: 'border-box',
                display: 'grid',
                gap: 12,
                font: '14px system-ui',
            }}
        >
            <section style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
                <label>
                    type{' '}
                    <select
                        value={type}
                        onChange={event => setSetup({ ...setup, type: event.target.value as BumpCloudType })}
                    >
                        {(['cumulus', 'stratocumulus', 'altocumulus'] as const).map(name => (
                            <option key={name}>{name}</option>
                        ))}
                    </select>
                </label>
                <Range
                    label="seed"
                    value={seed}
                    min={1}
                    max={100}
                    step={1}
                    onChange={value => setSetup({ ...setup, seed: value })}
                />
                <Range
                    label="part at"
                    value={at}
                    min={0.2}
                    max={0.8}
                    step={0.05}
                    onChange={value => setSetup({ ...setup, at: value })}
                />
                <Range
                    label="left px/s"
                    value={speeds[0]}
                    min={0}
                    max={100}
                    step={1}
                    onChange={value => setSetup({ ...setup, speeds: [value, speeds[1]] })}
                />
                <Range
                    label="right px/s"
                    value={speeds[1]}
                    min={0}
                    max={100}
                    step={1}
                    onChange={value => setSetup({ ...setup, speeds: [speeds[0], value] })}
                />
                <button
                    type="button"
                    onClick={() => setRestart(restart + 1)}
                >
                    start over
                </button>
            </section>
            <Sky
                halves={halves}
                x={x}
                y={y}
            />
        </main>
    );
}
