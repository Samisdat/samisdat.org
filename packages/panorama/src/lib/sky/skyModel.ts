/**
 * Sky model: pure functions, no rendering.
 *
 * Sun and moon run on a fixed arc in the panorama (see ADR 0025), so there is
 * no azimuth/altitude to x/y projection. The model returns values, not
 * positions:
 *
 * - progress of the active body on the arc (0 = left end, 1 = right end),
 * - twilight stage,
 * - moon phase, illuminated fraction and angle,
 * - an arc height factor that follows the solar noon altitude of the day.
 *
 * The rise and set points never move; only the height of the arc changes.
 */

import * as SunCalc from 'suncalc';

/** Wuppertal. */
export const WUPPERTAL = { lat: 51.2562, lng: 7.1508 } as const;

export interface Coordinates {
    lat: number;
    lng: number;
}

/**
 * Twilight stages, derived from the altitude of the sun's centre.
 *
 * | stage        | sun altitude                          |
 * | ------------ | ------------------------------------- |
 * | day          | above 6 deg                           |
 * | golden hour  | 6 deg down to the horizon (-0.833)    |
 * | civil        | horizon down to 6 deg below           |
 * | nautical     | 6 deg to 12 deg below the horizon     |
 * | astronomical | 12 deg to 18 deg below the horizon    |
 * | night        | more than 18 deg below the horizon    |
 *
 * -0.833 deg is the standard sunrise/sunset altitude (refraction plus the
 * sun's radius), identical to the one suncalc uses for sunrise and sunset.
 */
export type TwilightStage = 'day' | 'goldenHour' | 'civil' | 'nautical' | 'astronomical' | 'night';

export const TWILIGHT_THRESHOLDS_DEG = {
    goldenHour: 6,
    horizon: -0.833,
    civil: -6,
    nautical: -12,
    astronomical: -18,
} as const;

/**
 * Arc height factor range. The factor multiplies the vertical extent of the
 * arc. At the equinox (noon altitude = 90 - latitude) it is exactly 1, so the
 * original artwork is the "spring/autumn" arc. It reaches the minimum at the
 * winter solstice and the maximum at the summer solstice.
 */
export const ARC_HEIGHT_FACTOR = { min: 0.7, equinox: 1, max: 1.3 } as const;

/** Axial tilt in degrees, used for the solstice noon altitudes. */
const OBLIQUITY_DEG = 23.44;

const DAY_MS = 24 * 60 * 60 * 1000;

export interface MoonState {
    /** 0 = new moon, 0.25 = first quarter, 0.5 = full moon, 0.75 = last quarter. */
    phase: number;
    /** Illuminated fraction of the disc, 0..1. */
    fraction: number;
    /** Position angle of the bright limb in degrees, as returned by suncalc (v2 reports degrees). */
    angle: number;
    /** Bright limb angle relative to the zenith in degrees (rotation of the crescent as seen). */
    zenithAngle: number;
}

export interface SkyState {
    /** Sun above the horizon (between sunrise and sunset). */
    isDay: boolean;
    /** The body that travels the arc right now: the sun by day, the moon by night. */
    body: 'sun' | 'moon';
    /** Progress of that body on the arc, 0..1. Sun: sunrise to sunset. Moon: sunset to next sunrise. */
    arcProgress: number;
    twilight: TwilightStage;
    /** Altitude of the sun's centre in degrees. */
    sunAltitudeDeg: number;
    moon: MoonState;
    /** Factor for the arc height of this day, see {@link ARC_HEIGHT_FACTOR}. */
    arcHeightFactor: number;
}

/** Maps a sun altitude in degrees to a twilight stage. */
export const twilightStageFromAltitude = (altitudeDeg: number): TwilightStage => {
    const t = TWILIGHT_THRESHOLDS_DEG;
    if (altitudeDeg > t.goldenHour) return 'day';
    if (altitudeDeg > t.horizon) return 'goldenHour';
    if (altitudeDeg > t.civil) return 'civil';
    if (altitudeDeg > t.nautical) return 'nautical';
    if (altitudeDeg > t.astronomical) return 'astronomical';
    return 'night';
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const fraction = (value: number, from: number, to: number) => {
    const span = to - from;
    return Number.isFinite(span) && span > 0 ? clamp01((value - from) / span) : 0.5;
};

/** Sunrise/sunset of the day around `date` as timestamps; NaN if the sun does not rise or set. */
const sunEvents = (date: Date, { lat, lng }: Coordinates) => {
    const times = SunCalc.getTimes(date, lat, lng);
    return {
        sunrise: times.sunrise?.getTime() ?? Number.NaN,
        sunset: times.sunset?.getTime() ?? Number.NaN,
        solarNoon: times.solarNoon,
    };
};

/** Progress on the arc: sun from sunrise to sunset, moon from sunset to the next sunrise. */
export const getArcProgress = (date: Date, coords: Coordinates = WUPPERTAL) => {
    const now = date.getTime();
    const { sunrise, sunset } = sunEvents(date, coords);

    if (now >= sunrise && now < sunset) {
        return { body: 'sun' as const, progress: fraction(now, sunrise, sunset) };
    }

    if (now >= sunset) {
        const nextSunrise = sunEvents(new Date(now + DAY_MS), coords).sunrise;
        return { body: 'moon' as const, progress: fraction(now, sunset, nextSunrise) };
    }

    const prevSunset = sunEvents(new Date(now - DAY_MS), coords).sunset;
    return { body: 'moon' as const, progress: fraction(now, prevSunset, sunrise) };
};

/** Noon altitude of the sun in degrees at the solstices for the given latitude. */
export const solsticeNoonAltitudesDeg = (lat: number) => ({
    winter: 90 - lat - OBLIQUITY_DEG,
    equinox: 90 - lat,
    summer: 90 - lat + OBLIQUITY_DEG,
});

/**
 * Arc height factor for a solar noon altitude (degrees): linear between the
 * winter and summer solstice values, 1 at the equinox, clamped to the range.
 */
export const arcHeightFactorFromNoonAltitude = (noonAltitudeDeg: number, lat: number = WUPPERTAL.lat) => {
    const { winter, equinox, summer } = solsticeNoonAltitudesDeg(lat);
    const { min, equinox: mid, max } = ARC_HEIGHT_FACTOR;

    const factor =
        noonAltitudeDeg >= equinox
            ? mid + ((noonAltitudeDeg - equinox) / (summer - equinox)) * (max - mid)
            : mid - ((equinox - noonAltitudeDeg) / (equinox - winter)) * (mid - min);

    return Math.max(min, Math.min(max, factor));
};

/** Arc height factor for the day of `date`. */
export const getArcHeightFactor = (date: Date, coords: Coordinates = WUPPERTAL) => {
    const { solarNoon } = sunEvents(date, coords);
    const noonAltitudeDeg = SunCalc.getPosition(solarNoon, coords.lat, coords.lng).altitude;
    return arcHeightFactorFromNoonAltitude(noonAltitudeDeg, coords.lat);
};

export const getMoonState = (date: Date, coords: Coordinates = WUPPERTAL): MoonState => {
    const illumination = SunCalc.getMoonIllumination(date);
    const { parallacticAngle } = SunCalc.getMoonPosition(date, coords.lat, coords.lng);

    return {
        phase: illumination.phase,
        fraction: illumination.fraction,
        angle: illumination.angle,
        zenithAngle: illumination.angle - parallacticAngle,
    };
};

/** Complete sky state for a point in time. */
export const getSkyState = (date: Date, coords: Coordinates = WUPPERTAL): SkyState => {
    const sunAltitudeDeg = SunCalc.getPosition(date, coords.lat, coords.lng).altitude;
    const { body, progress } = getArcProgress(date, coords);

    return {
        isDay: body === 'sun',
        body,
        arcProgress: progress,
        twilight: twilightStageFromAltitude(sunAltitudeDeg),
        sunAltitudeDeg,
        moon: getMoonState(date, coords),
        arcHeightFactor: getArcHeightFactor(date, coords),
    };
};
