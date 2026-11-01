'use client';

import { RefObject, useCallback, useEffect, useRef } from 'react';

import { useAnimationFrame } from './useAnimationFrame';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

export type ParallaxCoords = { x: number; y: number };

export type UseParallaxOptions = {
    /** Also write `--scroll` (0..1): how far the element has scrolled out of view. */
    scroll?: boolean;
};

/**
 * Writes the pointer position inside `ref` as `--parallax-x` / `--parallax-y` (-1..1) on the element.
 * Does nothing for users who prefer reduced motion.
 */
export const useParallax = (ref: RefObject<HTMLDivElement | null>, { scroll = false }: UseParallaxOptions = {}) => {
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

    const handlePointerMove = useCallback(
        (event: PointerEvent) => {
            if (reduceMotion) {
                return;
            }

            const el = ref.current;
            if (!el) return;

            const rect = el.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return;

            const relativeX = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
            const relativeY = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));

            const x = (relativeX - 0.5) * 2;
            const y = (relativeY - 0.5) * 2;

            const prev = lastCoordsRef.current;
            if (prev.x === x && prev.y === y) return;

            lastCoordsRef.current = { x, y };
        },
        [ref, reduceMotion]
    );

    useEffect(() => {
        if (reduceMotion) {
            lastCoordsRef.current = { x: 0, y: 0 };
        }
    }, [reduceMotion]);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        el.addEventListener('pointermove', handlePointerMove, { passive: true });
        return () => el.removeEventListener('pointermove', handlePointerMove);
    }, [handlePointerMove, ref]);
};
