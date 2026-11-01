'use client';

import { styled } from '@linaria/react';
import { aubergine, ivory } from '@samisdat/color-scheme/primitives';
import { DemoAnimation } from '@samisdat/ui-components/DemoAnimation';
import { useEffect, useRef, useState, type RefObject } from 'react';

import { SPEED_MULTIPLIER_PROPS, useSpeedDuration } from '../../PlaybackControl/useSpeedDuration';
import { useDemoContext } from '../DemoContext';
import { AUTO_RESET_AT, BASE_DURATION_FALLBACK, CRANK_ELEMENT_ID, type CrankEvent } from './crankEvents';

const GHOST_FADE_MS = 1600;

const CrankStyling = styled.svg`
    .plate {
        fill: ${ivory[100]};
    }

    .arm {
        fill: ${aubergine[950]};
    }

    .hub {
        fill: ${aubergine[950]};
    }

    .grip {
        fill: ${aubergine[950]};
    }

    .grip-highlight {
        fill: ${ivory[100]};
    }

    .ghost {
        opacity: 0;
        pointer-events: none;
    }

    .ghost * {
        fill: none;
        stroke: var(--color-status-danger);
        stroke-width: 2;
        stroke-dasharray: 4 3;
    }
`;

type CrankSvgProps = {
    groupRef: RefObject<SVGGElement | null>;
    animRef: RefObject<SVGAnimateTransformElement | null>;
    ghostRef: RefObject<SVGGElement | null>;
    baseDuration: number;
};

// `dur` is only ever written via setAttribute: a changing prop would make
// React touch the element, and the running interval must stay untouched.
const CrankSvg = ({ groupRef, animRef, ghostRef, baseDuration }: CrankSvgProps) => {
    return (
        <CrankStyling viewBox="0 0 200 200">
            <circle
                cx={100}
                cy={100}
                r={80}
                className="plate"
            ></circle>
            <g
                ref={groupRef}
                id={CRANK_ELEMENT_ID}
            >
                <rect
                    x={96}
                    y={30}
                    width={8}
                    height={72}
                    rx={4}
                    className="arm"
                ></rect>
                <circle
                    cx={100}
                    cy={100}
                    r={12}
                    className="hub"
                ></circle>
                <circle
                    cx={100}
                    cy={30}
                    r={16}
                    className="grip"
                ></circle>
                <circle
                    cx={100}
                    cy={30}
                    r={6}
                    className="grip-highlight"
                ></circle>
                <animateTransform
                    ref={animRef}
                    attributeName="transform"
                    type="rotate"
                    from="0 100 100"
                    to="360 100 100"
                    dur={`${baseDuration}s`}
                    repeatCount="indefinite"
                ></animateTransform>
            </g>
            <g
                ref={ghostRef}
                className="ghost"
                transform="rotate(0 100 100)"
            >
                <rect
                    x={96}
                    y={30}
                    width={8}
                    height={72}
                    rx={4}
                ></rect>
                <circle
                    cx={100}
                    cy={30}
                    r={16}
                ></circle>
            </g>
        </CrankStyling>
    );
};

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const mod = (a: number, b: number) => ((a % b) + b) % b;

// angle = from + frac · (to − from) with from = 0°, to = 360°
const angleAt = (t: number, begin: number, dur: number) => (mod(t - begin, dur) / dur) * 360;

export const DemoAnimationsCrank = () => {
    const ctx = useDemoContext();
    const [baseDuration] = useState(() => parseFloat(ctx?.values.duration ?? '') || BASE_DURATION_FALLBACK);
    const publish = (event: CrankEvent) => ctx?.live.publish(event);

    const { speed, setSpeed, resetSpeed, duration } = useSpeedDuration(baseDuration);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const groupRef = useRef<SVGGElement | null>(null);
    const animRef = useRef<SVGAnimateTransformElement | null>(null);
    const ghostRef = useRef<SVGGElement | null>(null);
    const ghostAnimationRef = useRef<Animation | null>(null);

    // The duration the browser currently runs with.
    const durRef = useRef(baseDuration);

    const [isPlaying, setIsPlaying] = useState(false);

    const getSvg = () => containerRef.current?.querySelector<SVGSVGElement>('svg') ?? null;

    const getBegin = () => {
        try {
            return animRef.current?.getStartTime() ?? 0;
        } catch {
            return 0;
        }
    };

    useEffect(() => {
        const svg = getSvg();
        if (!svg) {
            return;
        }
        svg.pauseAnimations();
        svg.setCurrentTime(0);
    }, []);

    useEffect(() => {
        let frame = 0;
        const tick = () => {
            const svg = getSvg();
            if (svg) {
                const dur = durRef.current;
                const t = svg.getCurrentTime();
                if (t >= AUTO_RESET_AT) {
                    resetRef.current('limit');
                    frame = requestAnimationFrame(tick);
                    return;
                }
                const begin = getBegin();
                const local = mod(t - begin, dur);
                const frac = local / dur;

                const m = groupRef.current?.getCTM();
                const measured = m ? mod((Math.atan2(m.b, m.a) * 180) / Math.PI, 360) : 0;

                publish({ kind: 'frame', t, begin, dur, local, frac, theta: frac * 360, measured });
            }
            frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(frame);
    }, []);

    useEffect(() => {
        const before = durRef.current;
        if (before === duration) {
            return;
        }
        durRef.current = duration;

        const svg = getSvg();
        const t = svg?.getCurrentTime() ?? 0;
        const begin = getBegin();
        const thetaBefore = angleAt(t, begin, before);
        const thetaAfter = angleAt(t, begin, duration);
        const delta = mod(thetaAfter - thetaBefore + 180, 360) - 180;

        animRef.current?.setAttribute('dur', `${duration}s`);

        const reducedMotion = prefersReducedMotion();
        publish({
            kind: 'jump',
            before,
            after: duration,
            t,
            thetaBefore,
            thetaAfter,
            delta,
            flash: !reducedMotion,
        });

        const ghost = ghostRef.current;
        ghostAnimationRef.current?.cancel();
        if (ghost) {
            ghost.setAttribute('transform', `rotate(${thetaBefore} 100 100)`);
            if (reducedMotion) {
                ghost.style.opacity = '1';
            } else {
                ghost.style.opacity = '';
                ghostAnimationRef.current = ghost.animate([{ opacity: 1 }, { opacity: 0 }], {
                    duration: GHOST_FADE_MS,
                    easing: 'ease-out',
                });
            }
        }
    }, [duration]);

    const onPlay = () => {
        getSvg()?.unpauseAnimations();
        setIsPlaying(true);
    };

    const onPause = () => {
        getSvg()?.pauseAnimations();
        setIsPlaying(false);
    };

    const reset = (reason: 'button' | 'limit') => {
        const svg = getSvg();
        if (svg) {
            svg.pauseAnimations();
            svg.setCurrentTime(0);
        }

        // Apply the base duration right away so the duration effect sees no
        // change and does not report a jump for a reset.
        durRef.current = baseDuration;
        animRef.current?.setAttribute('dur', `${baseDuration}s`);
        resetSpeed();

        ghostAnimationRef.current?.cancel();
        if (ghostRef.current) {
            ghostRef.current.style.opacity = '0';
        }
        publish({ kind: 'reset', reason });
        setIsPlaying(false);
    };

    // The rAF loop is set up once; it must always call the latest closure.
    const resetRef = useRef(reset);
    resetRef.current = reset;

    const onReset = () => reset('button');

    return (
        <DemoAnimation
            ref={containerRef}
            playbackControl={{
                isPlaying,
                ...SPEED_MULTIPLIER_PROPS,
                speed,
                onSpeedChange: setSpeed,
                onPlay,
                onPause,
                onReset,
            }}
        >
            <CrankSvg
                groupRef={groupRef}
                animRef={animRef}
                ghostRef={ghostRef}
                baseDuration={baseDuration}
            />
        </DemoAnimation>
    );
};
