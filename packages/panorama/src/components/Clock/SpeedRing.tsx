'use client';

import { factorAt, formatEquivalence, formatFactor, SPEED_STEPS } from '@/lib/timeFactor';

import { arcTo, pointAt, useSpeedRing } from './useSpeedRing';

const FULL_ARC = arcTo(SPEED_STEPS);

const Tortoise = () => (
    <>
        <path d="M4 21C4 12.5 9.5 8 16 8s12 4.5 12 13z" />
        <circle
            cx="29.2"
            cy="17.6"
            r="3"
        />
        <rect
            x="7"
            y="20"
            width="5"
            height="5"
            rx="1.4"
        />
        <rect
            x="19"
            y="20"
            width="5"
            height="5"
            rx="1.4"
        />
        <path d="M4 20.5 1 22.6l3 .9z" />
        <path
            className="speedRingCut"
            d="M16 8.6v11.6M10.4 11.6 12 20M21.6 11.6 20 20M5.6 18h20.8"
        />
    </>
);

const Hare = () => (
    <>
        <ellipse
            cx="14"
            cy="20.5"
            rx="9.5"
            ry="5.2"
        />
        <circle
            cx="25"
            cy="16"
            r="4"
        />
        <path d="M22.6 13.2C20.6 5.4 23.6 3 24.8 4c1.2 1.6 1.4 5.6 1.4 9.4zM26.2 13.2C26.6 6.4 29.4 4 30.6 5c.8 1.8-.6 5.4-2 9z" />
        <circle
            cx="4.6"
            cy="18.4"
            r="2.6"
        />
        <path d="M10 24 4.6 28.6h6.4zM19 25l7 3.6h-7z" />
        <circle
            className="speedRingEye"
            cx="26.6"
            cy="15.2"
            r=".9"
        />
    </>
);

interface SpeedRingProps {
    /** Centre of the ring in the coordinates of the panorama. */
    cx: number;
    cy: number;
}

/** Ring around the clock: tortoise (normal time) to hare (fast). Shows on hover, on tap on the clock and on focus. */
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
                    r={78}
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
                    x={-80}
                    y={50}
                    width={34}
                    height={34}
                    viewBox="0 0 32 32"
                    aria-hidden="true"
                >
                    <Tortoise />
                </svg>
                <svg
                    className="speedRingAnimal"
                    x={46}
                    y={50}
                    width={34}
                    height={34}
                    viewBox="0 0 32 32"
                    aria-hidden="true"
                >
                    <Hare />
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
                y={60}
                aria-hidden="true"
            >
                {formatFactor(factor)}
            </text>
            <text
                className="speedRingText speedRingTextSmall"
                y={76}
                aria-hidden="true"
            >
                {formatEquivalence(factor)}
            </text>
        </g>
    );
};
