'use client';

import { useAnimationFrame } from '@/components/hook/useAnimationFrame';
import { RefObject, useCallback, useEffect, useRef } from 'react';

export type ParallaxCoords = {
    x: number;
    y: number;
};

export const useMouseParallax = (ref: RefObject<HTMLDivElement | null>) => {
    const visiblePercent = useRef<number>(1);

    const frameRef = useRef<number | null>(null);
    const lastCoordsRef = useRef<ParallaxCoords>({ x: 0, y: 0 });

    const doParallax = () => {
        const el = ref.current;
        if (!el) return;

        const svg = el.querySelector<SVGGElement>('svg');

        if (!svg) return;

        const x = lastCoordsRef.current.x;
        const y = lastCoordsRef.current.y;

        svg.style.setProperty('--parallax-x', `${x}`);
        svg.style.setProperty('--parallax-y', `${y}`);
        svg.style.setProperty('--scroll', `${1 - visiblePercent.current}`);
    };

    useAnimationFrame(doParallax);

    const handlePointerMove = useCallback(
        (event: PointerEvent) => {
            const el = ref.current;
            if (!el) return;

            const rect = el.getBoundingClientRect();

            // Guard against zero size (extreme edge cases)
            if (rect.width === 0 || rect.height === 0) return;

            // Clamp to [0, 1] so we don't go wild when pointer leaves the element slightly
            const relativeX = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
            const relativeY = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));

            // Map to [-1, 1]
            const x = (relativeX - 0.5) * 2;
            const y = (relativeY - 0.5) * 2;

            const next: ParallaxCoords = { x, y };

            const prev = lastCoordsRef.current;

            if (prev.x === next.x && prev.y === next.y) return;

            lastCoordsRef.current = next;
        },
        [ref]
    );

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        el.addEventListener('pointermove', handlePointerMove);

        return () => {
            if (frameRef.current !== null) {
                cancelAnimationFrame(frameRef.current);
            }

            el.removeEventListener('pointermove', handlePointerMove);
        };
    }, [handlePointerMove, ref]);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }
        if (!('IntersectionObserver' in window)) {
            return;
        }

        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                const visibleHeight = entry.intersectionRect.height;
                const totalHeight = entry.boundingClientRect.height;

                const percent = totalHeight > 0 ? visibleHeight / totalHeight : 0;

                visiblePercent.current = Math.min(1, Math.max(0, percent));
            },
            {
                threshold: Array.from({ length: 101 }, (_, i) => i / 100),
            }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, [visiblePercent]);
};
