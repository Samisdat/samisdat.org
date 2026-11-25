'use client';

import { usePrefersReducedMotion } from '@samisdat/tools';
import { type ReactNode, useEffect, useId, useRef, useState } from 'react';

import { useTal } from '@/lib/TalContext';
import { factorAt, formatEquivalence, SPEED_STEPS, stepOf } from '@/lib/timeFactor';

import { Clock } from './Clock';

const PauseIcon = () => (
    <svg
        viewBox="0 0 10 10"
        aria-hidden="true"
    >
        <rect
            x="1.5"
            y="1"
            width="2.4"
            height="8"
            rx=".5"
        />
        <rect
            x="6.1"
            y="1"
            width="2.4"
            height="8"
            rx=".5"
        />
    </svg>
);

const PlayIcon = () => (
    <svg
        viewBox="0 0 10 10"
        aria-hidden="true"
    >
        <path d="M2 1v8l7-4z" />
    </svg>
);

const PlaybackRow = () => {
    const { timeFactor, paused, setPaused, reset, atRealTime } = useTal();
    const canReset = 0 !== stepOf(timeFactor) || paused || !atRealTime;

    return (
        <div className="timeControlRow timeControlTop">
            <span>
                [{' '}
                <button
                    type="button"
                    className="timeControlButton"
                    aria-pressed={paused}
                    onClick={() => {
                        setPaused(!paused);
                    }}
                >
                    {paused ? <PlayIcon /> : <PauseIcon />}
                    {paused ? ' Play ' : ' Pause'}
                </button>{' '}
                ][{' '}
                <button
                    type="button"
                    className="timeControlButton"
                    disabled={!canReset}
                    onClick={reset}
                >
                    ↺ Reset
                </button>{' '}
                ]
            </span>
        </div>
    );
};

const SpeedRow = () => {
    const { timeFactor, setTimeFactor } = useTal();
    const step = stepOf(timeFactor);

    return (
        <div className="timeControlRow">
            <span>[ </span>
            <button
                type="button"
                className="timeControlButton"
                aria-label="Langsamer"
                disabled={0 === step}
                onClick={() => {
                    setTimeFactor(factorAt(step - 1));
                }}
            >
                -
            </button>
            <span> ][</span>
            <input
                type="range"
                className="timeControlSlider"
                min={0}
                max={SPEED_STEPS}
                step={1}
                value={step}
                aria-label="Speed"
                aria-valuetext={`${timeFactor}x`}
                onChange={event => {
                    setTimeFactor(factorAt(Number(event.target.value)));
                }}
            />
            <span>][ </span>
            <button
                type="button"
                className="timeControlButton"
                aria-label="Schneller"
                disabled={SPEED_STEPS === step}
                onClick={() => {
                    setTimeFactor(factorAt(step + 1));
                }}
            >
                +
            </button>
            <span> ]</span>
            <span className="timeControlLabel">Speed ({timeFactor}x)</span>
        </div>
    );
};

interface TimeControlProps {
    /** Optional row below the controls, e.g. the weather. The shape only grows downwards. */
    footer?: ReactNode;
}

/** The clock in the top left corner; a click opens the overlay with pause, reset and the speed slider. */
export const TimeControl = ({ footer }: TimeControlProps) => {
    const { timeFactor, paused } = useTal();
    const reduceMotion = usePrefersReducedMotion();
    const [open, setOpen] = useState(false);
    const clockButton = useRef<HTMLButtonElement>(null);
    const panelId = useId();

    const shape = useRef<HTMLDivElement>(null);

    // Open: a click anywhere else and Escape close it again
    useEffect(() => {
        if (!open) {
            return undefined;
        }

        const onPointerDown = (event: PointerEvent) => {
            if (event.target instanceof Node && !shape.current?.contains(event.target)) {
                setOpen(false);
            }
        };
        const onKeyDown = (event: KeyboardEvent) => {
            if ('Escape' === event.key) {
                setOpen(false);
                clockButton.current?.focus();
            }
        };

        document.addEventListener('pointerdown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.removeEventListener('pointerdown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [open]);

    if (reduceMotion) {
        return null;
    }

    return (
        <div
            className="timeControl"
            data-open={open}
            data-paused={paused}
        >
            <div
                ref={shape}
                className="timeControlShape"
            >
                <div className="timeControlDisc">
                    <button
                        ref={clockButton}
                        type="button"
                        className="timeControlClock"
                        aria-expanded={open}
                        aria-controls={panelId}
                        aria-label="Zeitsteuerung der Panorama-Uhr"
                        onClick={() => {
                            setOpen(current => !current);
                        }}
                    >
                        <Clock />
                    </button>
                </div>
                <fieldset
                    id={panelId}
                    className="timeControlPanel"
                    aria-label="Zeitsteuerung"
                    inert={!open}
                >
                    <button
                        type="button"
                        className="timeControlClose"
                        aria-label="Schließen"
                        onClick={() => {
                            setOpen(false);
                            clockButton.current?.focus();
                        }}
                    >
                        <svg
                            viewBox="0 0 10 10"
                            aria-hidden="true"
                        >
                            <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" />
                        </svg>
                    </button>
                    <PlaybackRow />
                    <SpeedRow />
                    <div className="timeControlEquivalence">
                        {paused ? 'Angehalten' : formatEquivalence(timeFactor)}
                    </div>
                    {footer && <div className="timeControlFooter">{footer}</div>}
                </fieldset>
            </div>
        </div>
    );
};
