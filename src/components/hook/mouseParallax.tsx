import { RefObject, useCallback, useEffect, useRef } from 'react';

export type ParallaxCoords = {
    x: number;
    y: number;
};

export const mouseParallax = (ref: RefObject<HTMLDivElement | null>) => {
    const frameRef = useRef<number | null>(null);
    const lastCoordsRef = useRef<ParallaxCoords>({ x: 0, y: 0 });

    const doParallax = () => {
        const el = ref.current;
        if (!el) return;

        const layers = el.querySelectorAll<SVGGElement>('g[data-depth] ');

        for (const layer of layers) {
            const depthAttr = layer.getAttribute('data-depth');

            if (!depthAttr) {
                return;
            }

            const depth = parseInt(depthAttr);

            const x = lastCoordsRef.current.x * depth || 0;
            const y = lastCoordsRef.current.y * depth || 0;

            layer.style.setProperty('--parallax-x', `${4 * x}px`);
            layer.style.setProperty('--parallax-y', `${4 * y}px`);
        }
    };

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

            // Cancel the last scheduled animation frame, we only care about the latest
            if (frameRef.current !== null) {
                cancelAnimationFrame(frameRef.current);
            }

            frameRef.current = requestAnimationFrame(() => {
                const prev = lastCoordsRef.current;

                if (prev.x === next.x && prev.y === next.y) return;

                lastCoordsRef.current = next;

                doParallax();
            });
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
};
