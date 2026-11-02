import { useEffect, useRef, type RefObject } from 'react';

import { AUTO_RESET_AT, type CrankEvent } from './crankEvents';
import { angleAt, mod, prefersReducedMotion } from './crankMath';

const GHOST_FADE_MS = 1600;

export type CrankHandles = {
    groupRef: RefObject<SVGGElement | null>;
    animRef: RefObject<SVGAnimateTransformElement | null>;
    ghostRef: RefObject<SVGGElement | null>;
    ghostAnimationRef: RefObject<Animation | null>;
    /** The duration the browser currently runs with. */
    durRef: RefObject<number>;
    getSvg: () => SVGSVGElement | null;
    getBegin: () => number;
};

export const useCrankHandles = (containerRef: RefObject<HTMLDivElement | null>, baseDuration: number): CrankHandles => {
    const groupRef = useRef<SVGGElement | null>(null);
    const animRef = useRef<SVGAnimateTransformElement | null>(null);
    const ghostRef = useRef<SVGGElement | null>(null);
    const ghostAnimationRef = useRef<Animation | null>(null);
    const durRef = useRef(baseDuration);

    const getSvg = () => containerRef.current?.querySelector<SVGSVGElement>('svg') ?? null;

    const getBegin = () => {
        try {
            return animRef.current?.getStartTime() ?? 0;
        } catch {
            return 0;
        }
    };

    return {
        groupRef,
        animRef,
        ghostRef,
        ghostAnimationRef,
        durRef,
        getSvg,
        getBegin,
    };
};

type EffectArgs = {
    handles: CrankHandles;
    publish: (event: CrankEvent) => void;
    resetRef: RefObject<(reason: 'button' | 'limit') => void>;
    duration: number;
};

// Starts paused at t = 0.
const usePauseOnMount = ({ getSvg }: CrankHandles) => {
    useEffect(() => {
        const svg = getSvg();
        if (!svg) {
            return;
        }
        svg.pauseAnimations();
        svg.setCurrentTime(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};

// Publishes one `frame` event per animation frame.
const useFrameLoop = ({ handles, publish, resetRef }: Omit<EffectArgs, 'duration'>) => {
    const { durRef, groupRef, getSvg, getBegin } = handles;

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

                publish({
                    kind: 'frame',
                    t,
                    begin,
                    dur,
                    local,
                    frac,
                    theta: frac * 360,
                    measured,
                });
            }
            frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(frame);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};

// Applies a new `dur`, reports the resulting jump and shows the ghost crank.
const useDurationChange = ({ handles, publish, duration }: Omit<EffectArgs, 'resetRef'>) => {
    const { durRef, animRef, ghostRef, ghostAnimationRef, getSvg, getBegin } = handles;

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [duration]);
};

export const useCrankEffects = (args: EffectArgs) => {
    usePauseOnMount(args.handles);
    useFrameLoop(args);
    useDurationChange(args);
};
