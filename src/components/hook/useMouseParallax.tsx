'use client';

import { useAnimationFrame } from '@/components/hook/useAnimationFrame';
import { RefObject, useCallback, useEffect, useRef } from 'react';

export type ParallaxCoords = { x: number; y: number };

export const useMouseParallax = (ref: RefObject<HTMLDivElement | null>) => {
    const lastCoordsRef = useRef<ParallaxCoords>({ x: 0, y: 0 });

    const doParallax = useCallback(() => {
        if (null === ref.current) {
            return;
        }

        const boundingClientRect = ref.current.getBoundingClientRect();

        const { x, y } = lastCoordsRef.current;

        ref.current.style.setProperty('--parallax-x', String(x));
        ref.current.style.setProperty('--parallax-y', String(y));
        ref.current.style.setProperty(
            '--scroll',
            String(Math.min(Math.abs(boundingClientRect.y) / boundingClientRect.height, 1))
        );
    }, [ref]);

    useAnimationFrame(doParallax);

    const handlePointerMove = useCallback(
        (event: PointerEvent) => {
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
        [ref]
    );

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        el.addEventListener('pointermove', handlePointerMove, { passive: true });
        return () => el.removeEventListener('pointermove', handlePointerMove);
    }, [handlePointerMove, ref]);
};
