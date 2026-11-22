import { describe, expect, it } from 'vitest';

import {
    ARC_HEIGHT_FACTOR,
    arcHeightFactorFromNoonAltitude,
    getArcHeightFactor,
    getArcProgress,
    getSkyState,
    solsticeNoonAltitudesDeg,
    twilightStageFromAltitude,
    WUPPERTAL,
} from '../skyModel';

const minutes = (a: Date | number, b: Date | number) => Math.abs(+a - +b) / 60000;

describe('arc progress', () => {
    // Wuppertal, 2024-06-21: sunrise 05:15 CEST, sunset 21:51 CEST.
    const sunrise = new Date('2024-06-21T03:15:30Z');
    const sunset = new Date('2024-06-21T19:51:10Z');

    it('is 0 at sunrise and 1 at sunset (within 2 minutes)', () => {
        const rise = getArcProgress(sunrise);
        expect(rise.body).toBe('sun');
        expect(rise.progress).toBeLessThan(0.005);

        const set = getArcProgress(new Date(+sunset - 2 * 60000));
        expect(set.body).toBe('sun');
        expect(set.progress).toBeGreaterThan(0.99);
    });

    it('is about 0.5 at solar noon', () => {
        const { body, progress } = getArcProgress(new Date('2024-06-21T11:30:00Z'));
        expect(body).toBe('sun');
        expect(progress).toBeCloseTo(0.5, 1);
    });

    it('hands over to the moon after sunset and runs until the next sunrise', () => {
        const night = getArcProgress(new Date('2024-06-21T21:00:00Z'));
        expect(night.body).toBe('moon');
        expect(night.progress).toBeGreaterThan(0);
        expect(night.progress).toBeLessThan(0.5);

        const lateNight = getArcProgress(new Date('2024-06-22T02:00:00Z'));
        expect(lateNight.body).toBe('moon');
        expect(lateNight.progress).toBeGreaterThan(0.5);
    });

    it('is continuous over midnight', () => {
        const before = getArcProgress(new Date('2024-12-21T22:59:00Z')).progress;
        const after = getArcProgress(new Date('2024-12-21T23:01:00Z')).progress;
        expect(Math.abs(after - before)).toBeLessThan(0.01);
    });

    it('matches suncalc sunrise and sunset in winter', () => {
        // 2024-12-21: sunrise 08:33 CET, sunset 16:25 CET.
        const rise = new Date('2024-12-21T07:33:36Z');
        const set = new Date('2024-12-21T15:25:48Z');
        expect(getArcProgress(new Date(+rise + 3 * 60000)).body).toBe('sun');
        expect(getArcProgress(new Date(+rise - 3 * 60000)).body).toBe('moon');
        expect(getArcProgress(new Date(+set - 3 * 60000)).body).toBe('sun');
        expect(getArcProgress(new Date(+set + 3 * 60000)).body).toBe('moon');
        expect(minutes(rise, rise)).toBe(0);
    });
});

describe('twilight stage', () => {
    it.each([
        [30, 'day'],
        [6.1, 'day'],
        [5.9, 'goldenHour'],
        [0, 'goldenHour'],
        [-0.9, 'civil'],
        [-5.9, 'civil'],
        [-6.1, 'nautical'],
        [-11.9, 'nautical'],
        [-12.1, 'astronomical'],
        [-17.9, 'astronomical'],
        [-18.1, 'night'],
        [-40, 'night'],
    ] as const)('altitude %d deg is %s', (altitude, stage) => {
        expect(twilightStageFromAltitude(altitude)).toBe(stage);
    });

    it('derives the stage from the date', () => {
        expect(getSkyState(new Date('2024-06-21T11:30:00Z')).twilight).toBe('day');
        expect(getSkyState(new Date('2024-12-21T00:00:00Z')).twilight).toBe('night');
        // Midsummer: the sun stays less than 18 deg below the horizon in Wuppertal.
        expect(getSkyState(new Date('2024-06-21T22:00:00Z')).twilight).not.toBe('night');
    });
});

describe('arc height factor', () => {
    const summer = new Date('2024-06-21T12:00:00+02:00');
    const winter = new Date('2024-12-21T12:00:00+01:00');
    const equinox = new Date('2024-03-20T12:00:00+01:00');

    it('uses the solstice noon altitudes of Wuppertal', () => {
        const { summer: s, winter: w } = solsticeNoonAltitudesDeg(WUPPERTAL.lat);
        expect(s).toBeCloseTo(62.2, 1);
        expect(w).toBeCloseTo(15.3, 1);
    });

    it('is highest at the summer solstice and lowest at the winter solstice', () => {
        expect(getArcHeightFactor(summer)).toBeCloseTo(ARC_HEIGHT_FACTOR.max, 1);
        expect(getArcHeightFactor(winter)).toBeCloseTo(ARC_HEIGHT_FACTOR.min, 1);
        expect(getArcHeightFactor(summer)).toBeGreaterThan(getArcHeightFactor(winter));
    });

    it('is about 1 at the equinox', () => {
        expect(getArcHeightFactor(equinox)).toBeCloseTo(1, 1);
    });

    it('is the same for the whole day, including the night after sunset', () => {
        const morning = getSkyState(new Date('2024-06-21T05:00:00Z')).arcHeightFactor;
        const noon = getSkyState(new Date('2024-06-21T11:30:00Z')).arcHeightFactor;
        const evening = getSkyState(new Date('2024-06-21T20:30:00Z')).arcHeightFactor;
        expect(morning).toBeCloseTo(noon, 6);
        expect(evening).toBeCloseTo(noon, 6);
    });

    it('clamps out of range altitudes', () => {
        expect(arcHeightFactorFromNoonAltitude(89)).toBe(ARC_HEIGHT_FACTOR.max);
        expect(arcHeightFactorFromNoonAltitude(0)).toBe(ARC_HEIGHT_FACTOR.min);
    });
});

describe('moon', () => {
    it('is full at the full moon of 2024-06-22 01:08 UTC', () => {
        const { moon } = getSkyState(new Date('2024-06-22T01:08:00Z'));
        expect(moon.phase).toBeCloseTo(0.5, 1);
        expect(moon.fraction).toBeGreaterThan(0.99);
    });

    it('is full at the full moon of 2024-09-18 02:34 UTC', () => {
        const { moon } = getSkyState(new Date('2024-09-18T02:34:00Z'));
        expect(moon.fraction).toBeGreaterThan(0.99);
    });

    it('is new at the new moon of 2024-06-06 12:38 UTC', () => {
        const { moon } = getSkyState(new Date('2024-06-06T12:38:00Z'));
        const distanceToNew = Math.min(moon.phase, 1 - moon.phase);
        expect(distanceToNew).toBeLessThan(0.02);
        expect(moon.fraction).toBeLessThan(0.01);
    });

    it('is a half moon at first quarter 2024-06-14 05:18 UTC', () => {
        const { moon } = getSkyState(new Date('2024-06-14T05:18:00Z'));
        expect(moon.phase).toBeCloseTo(0.25, 1);
        expect(moon.fraction).toBeCloseTo(0.5, 1);
    });

    it('exposes finite angles', () => {
        const { moon } = getSkyState(new Date('2024-06-14T05:18:00Z'));
        expect(Number.isFinite(moon.angle)).toBe(true);
        expect(Number.isFinite(moon.zenithAngle)).toBe(true);
    });
});
