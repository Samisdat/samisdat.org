'use client';

import { RefObject, useEffect } from 'react';

import { type Norm, type NormSource, type ParallaxElement, pointerSource } from '../norm';
import { createParallaxWriter } from './parallaxWriter';
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
 * Writes only in a frame that follows a change; while nothing moves, nothing runs.
 */
export const useParallax = (
    ref: RefObject<ParallaxElement | null>,
    { scroll = false }: UseParallaxOptions = {},
    source?: NormSource
) => {
    const reduceMotion = usePrefersReducedMotion();

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const writer = createParallaxWriter(el, { scroll, reduceMotion });
        const handleNorm = ({ x, y }: Norm) => {
            if (!reduceMotion) writer.set(x, y);
        };

        let unsubscribe: () => void;
        if (source) {
            unsubscribe = source.subscribe(handleNorm);
        } else {
            // touch: vertical swipes keep scrolling the page, horizontal drags and taps drive the parallax
            el.style.touchAction = 'pan-y';
            const stop = pointerSource(el).subscribe(handleNorm);
            unsubscribe = () => {
                el.style.touchAction = '';
                stop();
            };
        }

        if (scroll) {
            // capture, so scrolling inside any container counts
            window.addEventListener('scroll', writer.refresh, { capture: true, passive: true });
            window.addEventListener('resize', writer.refresh, { passive: true });
        }

        return () => {
            unsubscribe();
            window.removeEventListener('scroll', writer.refresh, { capture: true });
            window.removeEventListener('resize', writer.refresh);
            writer.dispose();
        };
    }, [ref, reduceMotion, scroll, source]);
};
