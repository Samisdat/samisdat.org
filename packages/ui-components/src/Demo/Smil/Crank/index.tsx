'use client';

import { useDemoContext } from '@samisdat/ui-components/Demo/DemoContext';
import { DemoAnimation } from '@samisdat/ui-components/DemoAnimation';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { SPEED_MULTIPLIER_PROPS, useSpeedDuration } from '../../../PlaybackControl/useSpeedDuration';
import { AUTO_RESET_AT, BASE_DURATION_FALLBACK, type CrankEvent } from './crankEvents';
import { angleAt, mod, prefersReducedMotion } from './crankMath';
import { CrankSvg } from './CrankSvg';

export { DemoSmilCrankFormula } from './Formula';

const GHOST_FADE_MS = 1600;

export const DemoSmilCrank = () => {
    const ctx = useDemoContext();
    const [baseDuration] = useState(() => parseFloat(ctx?.values.duration ?? '') || BASE_DURATION_FALLBACK);
    const live = ctx?.live;
    const publish = useCallback((event: CrankEvent) => live?.publish(event), [live]);

    const { speed, setSpeed, resetSpeed, duration } = useSpeedDuration(baseDuration);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const groupRef = useRef<SVGGElement | null>(null);
    const animRef = useRef<SVGAnimateTransformElement | null>(null);
    const ghostRef = useRef<SVGGElement | null>(null);
    const ghostAnimationRef = useRef<Animation | null>(null);

    // The rAF loop is set up once; it must always call the latest reset closure.
    const resetRef = useRef<(reason: 'button' | 'limit') => void>(() => {});
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
    }, [publish]);

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
    }, [duration, publish]);

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

    useLayoutEffect(() => {
        resetRef.current = reset;
    });

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
