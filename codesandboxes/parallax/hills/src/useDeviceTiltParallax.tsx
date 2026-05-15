'use client';

import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { useAnimationFrame } from './useAnimationFrame';
import { useMatchMediaQuery } from './useMatchMediaQuery';

export type Coords = { x: number; y: number };

type Options = {
    maxAngleDeg?: number;
    invertX?: boolean;
    invertY?: boolean;
};

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export const useDeviceTiltParallax = (ref: RefObject<HTMLDivElement | null>, options: Options = {}) => {
    const { maxAngleDeg = 15, invertX = false, invertY = false } = options;

    const reduceMotion = useMatchMediaQuery('(prefers-reduced-motion: reduce)', true);

    const lastCoordsRef = useRef<Coords>({ x: 0, y: 0 });
    const [permissionState, setPermissionState] = useState<'unknown' | 'granted' | 'denied'>('unknown');

    // schreibt die aktuellsten Werte pro Frame in CSS Vars
    const doParallax = useCallback(() => {
        const el = ref.current;
        if (!el) return;

        const { x, y } = lastCoordsRef.current;

        el.style.setProperty('--parallax-x', String(x));
        el.style.setProperty('--parallax-y', String(y));
    }, [ref]);

    useAnimationFrame(doParallax);

    // iOS: Permission muss durch User-Geste angefragt werden.
    const requestMotionPermission = useCallback(async () => {
        if (reduceMotion) return;

        // Wenn Browser kein permission API hat, einfach "granted" annehmen und hoffen, dass Events kommen.
        const anyDO = DeviceOrientationEvent as any;
        if (typeof anyDO?.requestPermission === 'function') {
            try {
                const res = await anyDO.requestPermission();
                const next = res === 'granted' ? 'granted' : 'denied';
                setPermissionState(next);
                return next;
            } catch {
                setPermissionState('denied');
                return 'denied';
            }
        } else {
            setPermissionState('granted');
            return 'granted';
        }
    }, [reduceMotion]);

    // Orientierung -> normalisierte coords
    const handleOrientation = useCallback(
        (event: DeviceOrientationEvent) => {
            if (reduceMotion) return;

            // beta: front/back (-180..180), gamma: left/right (-90..90)
            const beta = event.beta; // y-tilt
            const gamma = event.gamma; // x-tilt

            if (beta == null || gamma == null) return;

            // Mappe gamma/beta auf -1..+1 (mit clamp) anhand maxAngleDeg
            let x = clamp(gamma / maxAngleDeg, -1, 1);
            let y = clamp(beta / maxAngleDeg, -1, 1);

            if (invertX) x *= -1;
            if (invertY) y *= -1;

            // optional: wenn du „y“ eher wie Pointer haben willst (oben=-1, unten=+1)
            // fühlt sich je nach Gerät unterschiedlich an — ggf. y invertieren:
            // y *= -1;

            const prev = lastCoordsRef.current;
            if (prev.x === x && prev.y === y) return;

            lastCoordsRef.current = { x, y };
        },
        [reduceMotion, maxAngleDeg, invertX, invertY]
    );

    // Reset bei reduced motion
    useEffect(() => {
        if (reduceMotion) {
            lastCoordsRef.current = { x: 0, y: 0 };
        }
    }, [reduceMotion]);

    // Listener setzen (nur wenn permission ok bzw. unbekannt – Events kommen dann evtl. einfach nicht)
    useEffect(() => {
        if (reduceMotion) return;
        if (permissionState === 'denied') return;

        window.addEventListener('deviceorientation', handleOrientation, { passive: true });
        return () => window.removeEventListener('deviceorientation', handleOrientation);
    }, [handleOrientation, reduceMotion, permissionState]);

    return {
        permissionState,
        requestMotionPermission,
    };
};
