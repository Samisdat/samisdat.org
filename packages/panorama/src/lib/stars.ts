/**
 * Star positions for the panorama: catalogue (J2000) -> horizontal coordinates for a
 * date and place -> the visible sky window. Pure functions, no React, no DOM.
 */

/** [right ascension (deg), declination (deg), magnitude, B-V colour index], J2000. */
export type Star = readonly [ra: number, dec: number, mag: number, ci: number];

export interface Horizontal {
    /** Degrees from north, clockwise (east 90, south 180, west 270). */
    azimuth: number;
    /** Degrees above the horizon. */
    altitude: number;
}

export interface SkyPoint {
    /** 0 at the left edge of the window (east), 1 at the right edge (west). */
    u: number;
    /** 0 at the horizon, 1 at the top of the window. */
    v: number;
}

/** Looking south: east to the left, west to the right, the lower part of the sky. */
export const SKY_WINDOW = {
    azimuthMin: 90,
    azimuthMax: 270,
    altitudeMax: 32,
};

const RAD = Math.PI / 180;
const J2000_UNIX_MS = Date.UTC(2000, 0, 1, 12, 0, 0);
const MS_PER_DAY = 86_400_000;
const DAYS_PER_YEAR = 365.25;

/** Greenwich mean sidereal time in degrees. */
const greenwichSiderealTime = (date: Date) => {
    const daysSinceJ2000 = (date.getTime() - J2000_UNIX_MS) / MS_PER_DAY;

    return (280.46061837 + 360.98564736629 * daysSinceJ2000) % 360;
};

/** Low-precision precession of J2000 coordinates to the equator of the date (arc minutes at this scale). */
const precess = (raDeg: number, decDeg: number, years: number) => {
    const m = 46.1244 / 3600; // deg/year
    const n = 20.0431 / 3600; // deg/year
    const ra = raDeg * RAD;
    const dec = decDeg * RAD;

    return {
        ra: raDeg + (m + n * Math.sin(ra) * Math.tan(dec)) * years,
        dec: decDeg + n * Math.cos(ra) * years,
    };
};

export const horizontalCoords = (raDeg: number, decDeg: number, date: Date, lat: number, lng: number): Horizontal => {
    const years = (date.getTime() - J2000_UNIX_MS) / MS_PER_DAY / DAYS_PER_YEAR;
    const { ra, dec } = precess(raDeg, decDeg, years);

    const hourAngle = (greenwichSiderealTime(date) + lng - ra) * RAD;
    const decRad = dec * RAD;
    const latRad = lat * RAD;

    const sinAltitude = Math.sin(decRad) * Math.sin(latRad) + Math.cos(decRad) * Math.cos(latRad) * Math.cos(hourAngle);
    const azimuth = Math.atan2(
        -Math.cos(decRad) * Math.sin(hourAngle),
        Math.sin(decRad) * Math.cos(latRad) - Math.cos(decRad) * Math.sin(latRad) * Math.cos(hourAngle)
    );

    return {
        azimuth: (azimuth / RAD + 360) % 360,
        altitude: Math.asin(sinAltitude) / RAD,
    };
};

/** Equirectangular mapping of the sky window to the unit square; null outside the window. */
export const projectToSky = (azimuth: number, altitude: number): SkyPoint | null => {
    const { azimuthMin, azimuthMax, altitudeMax } = SKY_WINDOW;

    if (azimuth < azimuthMin || azimuth > azimuthMax || altitude < 0 || altitude > altitudeMax) {
        return null;
    }

    return {
        u: (azimuth - azimuthMin) / (azimuthMax - azimuthMin),
        v: altitude / altitudeMax,
    };
};

/**
 * Whether a star of this declination can ever be inside the sky window at this latitude.
 * Lower bound: it must rise above the horizon. Upper bound: at the eastern/western window
 * edge (azimuth 90/270) the altitude is limited to the window height. One degree of margin
 * covers precession and rounding.
 */
export const canEnterWindow = (decDeg: number, lat: number): boolean => {
    const margin = 1;
    const lowest = -(90 - Math.abs(lat)) - margin;
    const highest = Math.asin(Math.sin(SKY_WINDOW.altitudeMax * RAD) * Math.sin(Math.abs(lat) * RAD)) / RAD + margin;

    return decDeg >= lowest && decDeg <= highest;
};

/**
 * Window coordinates for every star as [u0, v0, u1, v1, ...]; NaN for stars outside the window.
 * Pass `out` (length stars * 2) to reuse the buffer between frames.
 */
export const starPositions = (
    stars: readonly Star[],
    date: Date,
    lat: number,
    lng: number,
    out: Float32Array = new Float32Array(stars.length * 2)
): Float32Array => {
    stars.forEach(([ra, dec], index) => {
        const { azimuth, altitude } = horizontalCoords(ra, dec, date, lat, lng);
        const point = projectToSky(azimuth, altitude);

        out[index * 2] = point ? point.u : NaN;
        out[index * 2 + 1] = point ? point.v : NaN;
    });

    return out;
};
