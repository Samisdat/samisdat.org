import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react';

export type ParallaxCoords = {
    x: number;
    y: number;
};

export const useParallaxPosition = () => {
    const [coords, setCoords] = useState<ParallaxCoords>({ x: 0, y: 0 });

    const frameRef = useRef<number | null>(null);
    const lastCoordsRef = useRef<ParallaxCoords>({ x: 0, y: 0 });

    const handleMouseMove = useCallback((event: MouseEvent<HTMLElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();

        const relativeX = (event.clientX - rect.left) / rect.width;
        const relativeY = (event.clientY - rect.top) / rect.height;

        const x = (relativeX - 0.5) * 2;
        const y = (relativeY - 0.5) * 2;

        const next: ParallaxCoords = { x, y };

        // Letzte geplante Animation canceln, wir wollen nur die neueste
        if (frameRef.current !== null) {
            cancelAnimationFrame(frameRef.current);
        }

        frameRef.current = requestAnimationFrame(() => {
            const prev = lastCoordsRef.current;

            if (prev.x === next.x && prev.y === next.y) return;

            lastCoordsRef.current = next;
            setCoords(next);
        });
    }, []);

    const handleMouseLeave = useCallback(() => {
        const next: ParallaxCoords = { x: 0, y: 0 };

        if (frameRef.current !== null) {
            cancelAnimationFrame(frameRef.current);
        }

        frameRef.current = requestAnimationFrame(() => {
            const prev = lastCoordsRef.current;

            if (prev.x === next.x && prev.y === next.y) return;

            lastCoordsRef.current = next;
            setCoords(next);
        });
    }, []);

    // Cleanup beim Unmount
    useEffect(() => {
        return () => {
            if (frameRef.current !== null) {
                cancelAnimationFrame(frameRef.current);
            }
        };
    }, []);

    return { coords, handleMouseMove, handleMouseLeave };
};
