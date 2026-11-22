/**
 * Star positions are checked against astronomy-engine (independent implementation)
 * for a few bright stars at fixed dates, plus the sky window projection.
 */

import * as Astronomy from 'astronomy-engine';
import { describe, expect, it } from 'vitest';

import { canEnterWindow, horizontalCoords, projectToSky, SKY_WINDOW, starPositions, type Star } from '../stars';

// Panorama coordinates (Wuppertal)
const LAT = 51.2562;
const LNG = 7.1508;

// The acceptance criterion asks for 0.5 degrees. Measured error is below 0.01 degrees;
// 0.05 still catches a missing precession correction (about 0.36 degrees in 2026).
const TOLERANCE_DEG = 0.05;

// J2000 right ascension (degrees) and declination (degrees), from the HYG extract
const STARS = {
    Sirius: { ra: 101.287, dec: -16.716 },
    Capella: { ra: 79.172, dec: 45.998 },
    Betelgeuse: { ra: 88.793, dec: 7.407 },
    Arcturus: { ra: 213.915, dec: 19.182 },
    Vega: { ra: 279.235, dec: 38.784 },
};

const DATES = [
    { label: 'winter evening', date: new Date('2026-01-15T21:00:00+01:00') },
    { label: 'summer night', date: new Date('2026-07-15T23:00:00+02:00') },
    { label: 'autumn small hours', date: new Date('2026-10-10T03:00:00+02:00') },
];

/** Reference: rotate J2000 to the equator of date, then convert to horizontal coordinates. */
const reference = (ra: number, dec: number, date: Date) => {
    const observer = new Astronomy.Observer(LAT, LNG, 0);
    const eqj = Astronomy.VectorFromSphere(new Astronomy.Spherical(dec, ra, 1), date);
    const eqd = Astronomy.RotateVector(Astronomy.Rotation_EQJ_EQD(date), eqj);
    const equator = Astronomy.EquatorFromVector(eqd);
    const horizon = Astronomy.Horizon(date, observer, equator.ra, equator.dec);

    return { azimuth: horizon.azimuth, altitude: horizon.altitude };
};

const angleDiff = (a: number, b: number) => Math.abs(((a - b + 540) % 360) - 180);

describe('horizontalCoords', () => {
    const cases = DATES.flatMap(({ label, date }) =>
        Object.entries(STARS).map(([name, { ra, dec }]) => ({ name, label, date, ra, dec }))
    );

    it.each(cases)('$name, $label matches astronomy-engine', ({ ra, dec, date }) => {
        const expected = reference(ra, dec, date);
        const actual = horizontalCoords(ra, dec, date, LAT, LNG);

        expect(Math.abs(actual.altitude - expected.altitude)).toBeLessThan(TOLERANCE_DEG);
        expect(angleDiff(actual.azimuth, expected.azimuth)).toBeLessThan(TOLERANCE_DEG);
    });

    it('puts Polaris near the north celestial pole at an altitude equal to the latitude', () => {
        const { altitude, azimuth } = horizontalCoords(37.95, 89.264, new Date('2026-01-15T21:00:00+01:00'), LAT, LNG);

        expect(Math.abs(altitude - LAT)).toBeLessThan(1);
        expect(angleDiff(azimuth, 0)).toBeLessThan(2);
    });
});

describe('projectToSky', () => {
    it('maps the window edges to the unit square', () => {
        expect(projectToSky(SKY_WINDOW.azimuthMin, 0)).toEqual({ u: 0, v: 0 });
        expect(projectToSky(SKY_WINDOW.azimuthMax, SKY_WINDOW.altitudeMax)).toEqual({ u: 1, v: 1 });
    });

    it('maps south at half the altitude to the centre', () => {
        const point = projectToSky(180, SKY_WINDOW.altitudeMax / 2);

        expect(point?.u).toBeCloseTo(0.5);
        expect(point?.v).toBeCloseTo(0.5);
    });

    it.each([
        { azimuth: 89.9, altitude: 10 },
        { azimuth: 270.1, altitude: 10 },
        { azimuth: 180, altitude: -0.1 },
        { azimuth: 180, altitude: SKY_WINDOW.altitudeMax + 0.1 },
        { azimuth: 0, altitude: 45 },
    ])('returns null outside the window ($azimuth, $altitude)', ({ azimuth, altitude }) => {
        expect(projectToSky(azimuth, altitude)).toBeNull();
    });
});

describe('starPositions', () => {
    const date = new Date('2026-01-15T21:00:00+01:00');
    const stars: Star[] = [
        [STARS.Sirius.ra, STARS.Sirius.dec, -1.44, 0.01],
        [37.95, 89.264, 2.0, 0.6],
    ];

    it('writes u and v per star, NaN for stars outside the window', () => {
        const positions = starPositions(stars, date, LAT, LNG);
        const sirius = horizontalCoords(STARS.Sirius.ra, STARS.Sirius.dec, date, LAT, LNG);
        const expected = projectToSky(sirius.azimuth, sirius.altitude);

        expect(positions).toHaveLength(stars.length * 2);
        expect(expected).not.toBeNull();
        expect(positions[0]).toBeCloseTo(expected?.u ?? NaN, 5);
        expect(positions[1]).toBeCloseTo(expected?.v ?? NaN, 5);
        // Polaris sits in the north, outside the southern window
        expect(positions[2]).toBeNaN();
        expect(positions[3]).toBeNaN();
    });

    it('reuses a passed buffer instead of allocating', () => {
        const out = new Float32Array(stars.length * 2);

        expect(starPositions(stars, date, LAT, LNG, out)).toBe(out);
    });
});

describe('canEnterWindow', () => {
    it('keeps every star that is inside the window at some time over a sidereal day', () => {
        const date = new Date('2026-03-01T00:00:00Z');

        // sample the whole sphere on a coarse grid, rotate it through a day
        for (let dec = -90; dec <= 90; dec += 3) {
            for (let ra = 0; ra < 360; ra += 15) {
                const everVisible = Array.from({ length: 48 }, (_, step) => {
                    const when = new Date(date.getTime() + step * 30 * 60_000);
                    const { azimuth, altitude } = horizontalCoords(ra, dec, when, LAT, LNG);

                    return projectToSky(azimuth, altitude) !== null;
                }).some(Boolean);

                if (everVisible) {
                    expect(canEnterWindow(dec, LAT), `dec ${dec}`).toBe(true);
                }
            }
        }
    });

    it('rejects the far north and far south', () => {
        expect(canEnterWindow(80, LAT)).toBe(false);
        expect(canEnterWindow(-60, LAT)).toBe(false);
    });
});
