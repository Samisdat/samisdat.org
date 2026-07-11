import { useEffect, useRef } from "react";

type FrameCallback = (deltaTime: number) => void;

export function useAnimationFrame(callback: FrameCallback, enabled = true) {
  const callbackRef = useRef<FrameCallback>(callback);
  const requestAnimationFrameRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    const animate = (time: number) => {
      if (previousTimeRef.current !== null) {
        callbackRef.current(time - previousTimeRef.current);
      }
      previousTimeRef.current = time;
      requestAnimationFrameRef.current = requestAnimationFrame(animate);
    };

    requestAnimationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestAnimationFrameRef.current !== null) {
        cancelAnimationFrame(requestAnimationFrameRef.current);
      }
      previousTimeRef.current = null;
    };
  }, [enabled]);
}
