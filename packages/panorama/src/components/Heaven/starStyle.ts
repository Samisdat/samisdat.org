/**
 * Look of a star (variant "Kontrastreich"): flat discs, size and opacity from the magnitude,
 * colour from the catalogue colour index, a quick flash in brightness on the brightest ones.
 */
import type { CSSProperties } from 'react';

/**
 * Stars brighter than this flash. Every flashing star is an animation of its own that the browser lifts onto a
 * compositor layer, so only the very brightest ones flash: at 3.8 it were 45 extra layers at dusk.
 */
export const FLASH_MAGNITUDE = 2;

/** The stars that show through the whole of twilight, the brightest ones above the horizon. */
const DUSK_STARS = 3;

const MAGNITUDE_FAINTEST = 5.5;
const MAGNITUDE_RANGE = 5;
export const RADIUS = { min: 0.7, max: 1.6 };
const OPACITY = { min: 0.3, max: 1 };

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

/** 0 for the faintest star in the extract, 1 for the brightest. */
const brightness = (mag: number) => clamp((MAGNITUDE_FAINTEST - mag) / MAGNITUDE_RANGE, 0, 1);

export const starRadius = (mag: number) => RADIUS.min + (RADIUS.max - RADIUS.min) * brightness(mag) ** 1.2;

export const starOpacity = (mag: number) => OPACITY.min + (OPACITY.max - OPACITY.min) * Math.sqrt(brightness(mag));

/** Pale blue, white, linen, peach, rose by B-V colour index; the tints are only a hint, halfway to white. */
export const starTint = (ci: number) => {
    if (ci < 0.2) return '#dce9ff';
    if (ci < 0.6) return '#ffffff';
    if (ci < 1.0) return '#fff8eb';
    if (ci < 1.4) return '#ffe3cd';

    return '#ffcebd';
};

/** The faintest magnitude that shows at the start of the reveal; no star but the brightest few is that bright. */
const MAGNITUDE_REVEAL_START = -1.5;

/**
 * Whether a star shows at dusk: the brightest few in the window always, the others once the reveal (0..1) has got
 * down to their magnitude. The magnitude is the star's own, so a star keeps its place while others rotate in and out.
 * `rank` is the star's place by brightness among those in the window (0 = brightest).
 */
export const starShows = (rank: number, mag: number, reveal: number) =>
    rank < DUSK_STARS || mag <= MAGNITUDE_REVEAL_START + reveal * (MAGNITUDE_FAINTEST - MAGNITUDE_REVEAL_START);

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
