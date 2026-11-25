/**
 * Sky colours as a pure function of the sun altitude.
 *
 * `skyPalette(altitudeDeg, season)` interpolates between keyframes that sit on
 * the twilight thresholds of the sky model (golden hour, civil, nautical,
 * astronomical). There is no crossfade over wall-clock time: the colours are
 * wherever the sun is. The season (derived from the arc height factor) tints
 * the low-sun keyframes: winter dusk is a narrow, deep red band, summer dusk a
 * wider, yellower and paler one.
 */

import { ARC_HEIGHT_FACTOR } from './skyModel';

export type Rgb = readonly [number, number, number];

export interface SkyPalette {
    /** Top of the sky gradient, hex. */
    zenith: string;
    /** Middle of the sky gradient, hex. */
    horizon: string;
    /** Lowest band of the sky gradient, where the sun glow sits, hex. */
    glowBand: string;
    /** Colour of the sun disc, hex. */
    sun: string;
    /** Sun radius relative to its size at high altitude, 1..~1.55. */
    sunScale: number;
    /** 0..1: how strongly the horizon glows (sun halo and light on cloud undersides). */
    glow: number;
    /** Colour of the low sunlight on the clouds, hex. */
    cloudLight: string;
    /** 0 by day, 1 at night; drives the cloud tones. */
    night: number;
    /** 0..1: how many stars show besides the brightest few; 0 until nautical twilight, 1 at its end. */
    starReveal: number;
    /** 0..1: how bright the stars are, 0 in daylight, 1 when astronomically dark. */
    stars: number;
}

/** A value for winter and one for summer; the season blends between them. */
type Seasonal = Rgb | readonly [Rgb, Rgb];

interface Key {
    alt: number;
    zenith: Rgb;
    horizon: Rgb;
    glowBand: Seasonal;
    sun: Seasonal;
    sunScale: number;
    glow: number;
    cloudLight: Seasonal;
    stars: number;
}

const hex = (value: string): Rgb => [1, 3, 5].map(i => parseInt(value.slice(i, i + 2), 16)) as unknown as Rgb;

const isPair = (value: Seasonal): value is readonly [Rgb, Rgb] => Array.isArray(value[0]);

const SUN_DAY = hex('#EBDD1A');
const SKY_DAY = { zenith: hex('#0376BF'), horizon: hex('#A8D0F5') };

/** Keyframes from high sun down to the end of astronomical twilight; the sky beyond stays as the last key. */
const KEYS: readonly Key[] = [
    {
        alt: 20,
        ...SKY_DAY,
        glowBand: SKY_DAY.horizon,
        sun: SUN_DAY,
        sunScale: 1,
        glow: 0,
        cloudLight: hex('#FFE9C8'),
        stars: 0,
    },
    {
        alt: 8,
        ...SKY_DAY,
        glowBand: SKY_DAY.horizon,
        sun: hex('#F5D21C'),
        sunScale: 1.05,
        glow: 0,
        cloudLight: hex('#FFE0B0'),
        stars: 0,
    },
    {
        alt: 3,
        zenith: hex('#0A6AAF'),
        horizon: hex('#BFD3EA'),
        glowBand: [hex('#F2BE86'), hex('#F8D79A')],
        sun: [hex('#FFA630'), hex('#FFC52E')],
        sunScale: 1.25,
        glow: 0.4,
        cloudLight: [hex('#FF9A5A'), hex('#FFC080')],
        stars: 0,
    },
    {
        alt: -0.833,
        zenith: hex('#2A5DA0'),
        horizon: hex('#E3B5A0'),
        glowBand: [hex('#F2764F'), hex('#F6A45C')],
        sun: [hex('#F5401C'), hex('#FF7A22')],
        sunScale: 1.55,
        glow: 1,
        cloudLight: [hex('#FF5238'), hex('#FF8A4A')],
        stars: 0,
    },
    {
        alt: -4,
        zenith: hex('#24478A'),
        horizon: hex('#B07DA0'),
        glowBand: [hex('#D0506E'), hex('#E88A6A')],
        sun: [hex('#E03A2A'), hex('#F5642A')],
        sunScale: 1.55,
        glow: 0.75,
        cloudLight: [hex('#E8506A'), hex('#F57A62')],
        stars: 0.5,
    },
    {
        alt: -6,
        zenith: hex('#1A3068'),
        horizon: hex('#6B6AA8'),
        glowBand: [hex('#9A4888'), hex('#C0707E')],
        sun: [hex('#E03A2A'), hex('#F5642A')],
        sunScale: 1.55,
        glow: 0.45,
        cloudLight: [hex('#B8508C'), hex('#D8707E')],
        stars: 0.6,
    },
    {
        alt: -9,
        zenith: hex('#12234F'),
        horizon: hex('#3A4A8A'),
        glowBand: [hex('#4E4486'), hex('#6E5688')],
        sun: [hex('#E03A2A'), hex('#F5642A')],
        sunScale: 1.55,
        glow: 0.15,
        cloudLight: [hex('#6A4C90'), hex('#8A5C90')],
        stars: 0.75,
    },
    {
        alt: -12,
        zenith: hex('#0C1838'),
        horizon: hex('#1E2C5E'),
        glowBand: hex('#2A3568'),
        sun: hex('#E03A2A'),
        sunScale: 1.55,
        glow: 0.03,
        cloudLight: hex('#3A3A78'),
        stars: 0.9,
    },
    {
/** Sun altitudes where nautical twilight starts and ends. */
const NAUTICAL_START = -6;
const NAUTICAL_END = -12;

        alt: -18,
        zenith: hex('#060F22'),
        horizon: hex('#0A1630'),
        glowBand: hex('#0E1A38'),
        sun: hex('#E03A2A'),
        sunScale: 1.55,
        glow: 0,
        cloudLight: hex('#2A2A60'),
        stars: 1,
    },
];

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const smooth = (t: number) => t * t * (3 - 2 * t);

const mix = (a: number, b: number, t: number) => a + (b - a) * t;

const mixRgb = (a: Rgb, b: Rgb, t: number): Rgb => [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)];

export const toHex = ([r, g, b]: Rgb) =>
    `#${[r, g, b]
        .map(channel =>
            Math.round(Math.max(0, Math.min(255, channel)))
                .toString(16)
                .padStart(2, '0')
        )
        .join('')}`;

/**
 * Season in -1 (winter solstice) .. 1 (summer solstice) from the arc height
 * factor of the sky model; 0 at the equinox.
 */
export const seasonFromArcHeight = (arcHeightFactor: number) =>
    Math.max(
        -1,
        Math.min(1, (arcHeightFactor - ARC_HEIGHT_FACTOR.equinox) / (ARC_HEIGHT_FACTOR.max - ARC_HEIGHT_FACTOR.equinox))
    );

const resolve = (value: Seasonal, season: number): Rgb =>
    isPair(value) ? mixRgb(value[0], value[1], (season + 1) / 2) : value;

/** The two keyframes around an altitude and the position between them; clamped at both ends. */
const bracket = (altitudeDeg: number): [Key, Key, number] => {
    const first = KEYS[0];
    const last = KEYS[KEYS.length - 1];

    if (altitudeDeg >= first.alt) return [first, first, 0];
    if (altitudeDeg <= last.alt) return [last, last, 0];

    const index = KEYS.findIndex(key => key.alt <= altitudeDeg);
    const upper = KEYS[index - 1];
    const lower = KEYS[index];

    return [upper, lower, smooth((upper.alt - altitudeDeg) / (upper.alt - lower.alt))];
};

/** Palette for a sun altitude in degrees. `season` runs from -1 (winter) to 1 (summer), see {@link seasonFromArcHeight}. */
export const skyPalette = (altitudeDeg: number, season = 0): SkyPalette => {
    const [a, b, t] = bracket(altitudeDeg);
        starReveal: smooth(clamp01((NAUTICAL_START - altitudeDeg) / (NAUTICAL_START - NAUTICAL_END))),
    const s = Math.max(-1, Math.min(1, season));
    const rgb = (pick: (key: Key) => Seasonal) => toHex(mixRgb(resolve(pick(a), s), resolve(pick(b), s), t));

    return {
        zenith: rgb(key => key.zenith),
        horizon: rgb(key => key.horizon),
        glowBand: rgb(key => key.glowBand),
        sun: rgb(key => key.sun),
        sunScale: mix(a.sunScale, b.sunScale, t),
        glow: mix(a.glow, b.glow, t),
        cloudLight: rgb(key => key.cloudLight),
        night: smooth(clamp01((0 - altitudeDeg) / 14)),
        stars: mix(a.stars, b.stars, t),
    };
};
