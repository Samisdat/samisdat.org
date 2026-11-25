'use client';

import '@/components/panorama.css';

import { useMemo, useState } from 'react';

import { bumpCloud } from '@/components/Clouds/bumpCloud';

import { Controls, DEFAULT_SETTINGS } from './Controls';
import { ReviewNotes } from './ReviewNotes';

import type { CSSProperties } from 'react';

export interface HandCloud {
    id: string;
    body: string;
    shade: string;
    /** Box in the coordinates of the hand-made file. */
    x: number;
    y: number;
    width: number;
    height: number;
}

/** Every cell shares one box, so the sizes can be compared by eye. */
const CELL = { width: 540, height: 130, base: 124 };

const GRID: CSSProperties = { display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' };
const HEADING: CSSProperties = { font: '600 14px system-ui' };

/** The sky behind one cloud, from the panorama's day blue to its night blue (skyPalette at -18°). */
const sky = (night: number) => {
    const mix = (dark: string, day: string) => `color-mix(in oklch, ${dark} ${night * 100}%, ${day})`;

    return `linear-gradient(${mix('#060f22', '#0376bf')}, ${mix('#0a1630', '#a8d0f5')})`;
};

interface CellProps {
    label: string;
    body: string;
    shade: string;
    /** Where the cloud's own box starts and how big it is. */
    box: { x: number; y: number; width: number; height: number };
    night: number;
    /** A note field under the cloud, for the generated ones. */
    note?: { value: string; onChange: (value: string) => void };
}

const Cell = ({ label, body, shade, box, night, note }: CellProps) => (
    <figure style={{ margin: 0, display: 'grid', gap: 2 }}>
        <div style={{ position: 'relative', background: sky(night) }}>
            <svg
                viewBox={`0 0 ${CELL.width} ${CELL.height}`}
                style={{ display: 'block', width: '100%' }}
            >
                <g transform={`translate(${(CELL.width - box.width) / 2 - box.x} ${CELL.base - box.height - box.y})`}>
                    <path
                        className="cloudBody"
                        d={body}
                    />
                    <path
                        className="cloudShade"
                        d={shade}
                    />
                </g>
            </svg>
            <span style={{ position: 'absolute', left: 6, top: 4, font: '11px monospace', color: '#fff' }}>
                {label}
            </span>
        </div>
        {note && (
            <input
                aria-label={`note for ${label}`}
                placeholder="note"
                value={note.value}
                onChange={event => note.onChange(event.target.value)}
                style={{ border: `1px solid ${note.value ? '#ff3b30' : '#ccc'}`, padding: '2px 4px' }}
            />
        )}
    </figure>
);

export const CloudReview = ({ hand }: { hand: HandCloud[] }) => {
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [notes, setNotes] = useState<Record<number, string>>({});
    const { type, count, start, light, night, colours } = settings;

    const clouds = useMemo(
        () =>
            Array.from({ length: count }, (_, index) => {
                const seed = start + index;

                return { seed, ...bumpCloud({ seed, type, light }) };
            }),
        [count, start, type, light]
    );
    const collect = () => ({
        type,
        light,
        seeds: { first: start, count },
        notes: clouds
            .filter(({ seed }) => (notes[seed] ?? '').trim())
            .map(({ seed, width, height }) => ({ seed, width, height, note: notes[seed].trim() })),
    });

    return (
        <main style={{ padding: 16, display: 'grid', gap: 12, font: '14px system-ui' }}>
            <Controls
                settings={settings}
                onChange={setSettings}
            />
            <ReviewNotes
                collect={collect}
                onClear={() => setNotes({})}
            />
            <div
                className="panorama"
                style={{ aspectRatio: 'auto', overflow: 'visible', textAlign: 'left' }}
            >
                <div
                    className="clouds tone-fair"
                    style={
                        {
                            ...colours,
                            '--night': night,
                            '--glow': 0,
                            '--glow-c': 'transparent',
                            animation: 'none',
                            display: 'grid',
                            gap: 12,
                        } as CSSProperties
                    }
                >
                    <h2 style={HEADING}>hand-made (reference)</h2>
                    <div style={GRID}>
                        {hand.map(({ id, body, shade, ...box }) => (
                            <Cell
                                key={id}
                                label={`${id} ${box.width}×${box.height}`}
                                body={body}
                                shade={shade}
                                box={box}
                                night={night}
                            />
                        ))}
                    </div>
                    <h2 style={HEADING}>generated: {type} (write a note under every cloud that does not fit)</h2>
                    <div style={GRID}>
                        {clouds.map(({ seed, body, shade, width, height }) => (
                            <Cell
                                key={seed}
                                label={`#${seed} ${width}×${height}`}
                                body={body}
                                shade={shade}
                                box={{ x: 0, y: 0, width, height }}
                                night={night}
                                note={{
                                    value: notes[seed] ?? '',
                                    onChange: value => setNotes(current => ({ ...current, [seed]: value })),
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
};
