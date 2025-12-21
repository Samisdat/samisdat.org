import { useEffect, useRef } from 'react';

type FrameCallback = (deltaTime: number) => void;

export function useAnimationFrame(callback: FrameCallback) {
    const requestAnimationFrameRef = useRef<number | null>(null);
    const previousTimeRef = useRef<number | null>(null);

    useEffect(() => {
        const animate = (time: number) => {
            if (previousTimeRef.current !== null) {
                callback(time - previousTimeRef.current);
            }

            previousTimeRef.current = time;
            requestAnimationFrameRef.current = requestAnimationFrame(animate);
        };

        requestAnimationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            if (requestAnimationFrameRef.current !== null) {
                cancelAnimationFrame(requestAnimationFrameRef.current);
            }
        };
    }, [callback]);
}
