'use client';

import { factorAt, formatEquivalence, formatFactor, SPEED_STEPS } from '@/lib/timeFactor';

import { arcTo, pointAt, useSpeedRing } from './useSpeedRing';

const FULL_ARC = arcTo(SPEED_STEPS);

// Icons "turtle" and "rabbit" from Lucide (ISC), see THIRD-PARTY-NOTICES.txt. 24 x 24 grid, drawn as strokes.
const TURTLE = [
    'm12 10 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a8 8 0 1 0-16 0v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3l2-4h4Z',
    'M4.82 7.9 8 10',
    'M15.18 7.9 12 10',
    'M16.93 10H20a2 2 0 0 1 0 4H2',
];

const RABBIT = [
    'M13 16a3 3 0 0 1 2.24 5',
    'M18 12h.01',
    'M18 21h-8a4 4 0 0 1-4-4 7 7 0 0 1 7-7h.2L9.6 6.4a1 1 0 1 1 2.8-2.8L15.8 7h.2c3.3 0 6 2.7 6 6v1a2 2 0 0 1-2 2h-1a3 3 0 0 0-3 3',
    'M20 8.54V4a2 2 0 1 0-4 0v3',
    'M7.612 12.524a3 3 0 1 0-1.6 4.3',
];

/** The outline underneath keeps the white stroke readable on bright sky. */
const Glyph = ({ paths }: { paths: string[] }) => (
    <>
        <g className="speedRingGlyphOutline">
            {paths.map(d => (
                <path
                    key={d}
                    d={d}
                />
            ))}
        </g>
        <g className="speedRingGlyph">
            {paths.map(d => (
                <path
                    key={d}
                    d={d}
                />
            ))}
        </g>
    </>
);

interface SpeedRingProps {
    /** Centre of the ring in the coordinates of the panorama. */
    cx: number;
    cy: number;
}

/** Ring around the clock: turtle (normal time) to rabbit (fast). Shows on hover, on tap on the clock and on focus. */
export const SpeedRing = ({ cx, cy }: SpeedRingProps) => {
    const { step, ...handlers } = useSpeedRing(cx, cy);

    const factor = factorAt(step);
    const knob = pointAt(step);

    return (
        <g
            className="speedRing"
            transform={`translate(${cx} ${cy})`}
        >
            <g
                className="speedRingDial"
                onPointerDown={handlers.onPointerDown}
                onPointerMove={handlers.onPointerMove}
                onPointerUp={handlers.onPointerUp}
                onPointerCancel={handlers.onPointerCancel}
            >
                <circle
                    className="speedRingHit"
                    r={67}
                />
                <path
                    className="speedRingHalo"
                    d={FULL_ARC}
                />
                <path
                    className="speedRingTrack"
                    d={FULL_ARC}
                />
                <path
                    className="speedRingFill"
                    d={arcTo(step)}
                />
                <svg
                    className="speedRingAnimal"
                    x={-77}
                    y={46}
                    width={34}
                    height={34}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <Glyph paths={TURTLE} />
                </svg>
                <svg
                    className="speedRingAnimal"
                    x={43}
                    y={46}
                    width={34}
                    height={34}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <Glyph paths={RABBIT} />
                </svg>
                <g
                    className="speedRingKnob"
                    transform={`translate(${knob.x} ${knob.y})`}
                    // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- an SVG has no input element
                    role="slider"
                    tabIndex={0}
                    aria-label="Geschwindigkeit der Panorama-Uhr, von Normalzeit bis schnell"
                    aria-valuemin={0}
                    aria-valuemax={SPEED_STEPS}
                    aria-valuenow={step}
                    aria-valuetext={
                        1 === factor ? 'Normalzeit' : `${factor}-fache Geschwindigkeit, ${formatEquivalence(factor)}`
                    }
                    onKeyDown={handlers.onKeyDown}
                >
                    <circle
                        className="speedRingFocus"
                        r={16}
                    />
                    <circle
                        className="speedRingHandle"
                        r={11}
                    />
                </g>
            </g>
            <text
                className="speedRingText"
                y={62}
                aria-hidden="true"
            >
                {formatFactor(factor)}
            </text>
            <text
                className="speedRingText speedRingTextSmall"
                y={74}
                aria-hidden="true"
            >
                {formatEquivalence(factor)}
            </text>
        </g>
    );
};
