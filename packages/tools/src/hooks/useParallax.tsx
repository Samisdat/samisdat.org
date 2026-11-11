'use client';

import { RefObject, useCallback, useEffect, useRef } from 'react';

import { type Norm, type NormSource, pointerSource } from '../norm';
import { useAnimationFrame } from './useAnimationFrame';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

export type ParallaxCoords = { x: number; y: number };

export type UseParallaxOptions = {
    /** Also write `--scroll` (0..1): how far the element has scrolled out of view. */
    scroll?: boolean;
};

/**
 * Writes the pointer position inside `ref` as `--parallax-x` / `--parallax-y` (-1..1) on the element.
 * Also works on touch: `touch-action: pan-y` keeps vertical swipes scrolling, a tap or horizontal drag sets the position.
 * Pass a `source` to drive it from something other than the pointer (default: pointer on `ref`).
 * Does nothing for users who prefer reduced motion.
 */
export const useParallax = (
    ref: RefObject<HTMLDivElement | null>,
    { scroll = false }: UseParallaxOptions = {},
    source?: NormSource
) => {
    const reduceMotion = usePrefersReducedMotion();

    const lastCoordsRef = useRef<ParallaxCoords>({ x: 0, y: 0 });

    const doParallax = useCallback(() => {
        if (null === ref.current) {
            return;
        }

        const { x, y } = lastCoordsRef.current;

        ref.current.style.setProperty('--parallax-x', String(x));
        ref.current.style.setProperty('--parallax-y', String(y));

        if (!scroll) {
            return;
        }

        const boundingClientRect = ref.current.getBoundingClientRect();

        const scrolled = reduceMotion ? 0 : Math.min(Math.abs(boundingClientRect.y) / boundingClientRect.height, 1);

        ref.current.style.setProperty('--scroll', String(scrolled));
    }, [ref, reduceMotion, scroll]);

    useAnimationFrame(doParallax);

    const handleNorm = useCallback(
        ({ x, y }: Norm) => {
            if (reduceMotion) {
                return;
            }

            const prev = lastCoordsRef.current;
            if (prev.x === x && prev.y === y) return;

            lastCoordsRef.current = { x, y };
        },
        [reduceMotion]
    );

    useEffect(() => {
        if (reduceMotion) {
            lastCoordsRef.current = { x: 0, y: 0 };
        }
    }, [reduceMotion]);

    useEffect(() => {
        if (source) {
            return source.subscribe(handleNorm);
        }

        const el = ref.current;
        if (!el) return;

        // touch: vertical swipes keep scrolling the page, horizontal drags and taps drive the parallax
        el.style.touchAction = 'pan-y';
        const unsubscribe = pointerSource(el).subscribe(handleNorm);
        return () => {
            el.style.touchAction = '';
            unsubscribe();
        };
    }, [handleNorm, ref, source]);
};
