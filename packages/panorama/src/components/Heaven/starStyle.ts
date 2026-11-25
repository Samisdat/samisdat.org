/**
 * Look of a star (variant "Kontrastreich"): flat discs, size and opacity from the magnitude,
 * colour from the catalogue colour index, a quick flash in brightness on the brightest ones.
 */
import type { CSSProperties } from 'react';

/** Stars brighter than this flash. */
export const FLASH_MAGNITUDE = 3.8;

const MAGNITUDE_FAINTEST = 5.5;
const MAGNITUDE_RANGE = 5;
export const RADIUS = { min: 0.7, max: 1.6 };
const OPACITY = { min: 0.3, max: 1 };

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

/** 0 for the faintest star in the extract, 1 for the brightest. */
const brightness = (mag: number) => clamp((MAGNITUDE_FAINTEST - mag) / MAGNITUDE_RANGE, 0, 1);

export const starRadius = (mag: number) => RADIUS.min + (RADIUS.max - RADIUS.min) * brightness(mag) ** 1.2;

export const starOpacity = (mag: number) => OPACITY.min + (OPACITY.max - OPACITY.min) * Math.sqrt(brightness(mag));

/** Blue-white, white, linen, peach, salmon by B-V colour index. */
export const starTint = (ci: number) => {
    if (ci < 0.2) return '#b9d2ff';
    if (ci < 0.6) return '#ffffff';
    if (ci < 1.0) return '#fff0d6';
    if (ci < 1.4) return '#ffc79a';

    return '#ff9d7a';
};

/** Deterministic pseudo random number in [0, 1) from an index. */
const random = (index: number) => {
    const value = Math.sin(index * 127.1 + 311.7) * 43758.5453;

    return value - Math.floor(value);
};

/** Own duration and (negative) delay per star, so the flashes never line up. */
export const flashStyle = (index: number): CSSProperties =>
    ({
        animationDuration: `${(6 + random(index) * 6).toFixed(1)}s`,
        animationDelay: `-${(random(index + 9) * 7).toFixed(1)}s`,
    }) as CSSProperties;
