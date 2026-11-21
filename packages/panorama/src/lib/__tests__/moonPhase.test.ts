import { describe, expect, it } from 'vitest';

import { moonShape, moonView } from '../moonPhase';

const LAT = 51.2562;
const LNG = 7.1508;

describe('moonView', () => {
    it('is dark at the new moon of 6 January 2000', () => {
        const view = moonView(new Date('2000-01-06T18:14:00Z'), LAT, LNG);

        expect(view.fraction).toBeLessThan(0.01);
    });

    it('is full at the full moon of 21 January 2000', () => {
        const view = moonView(new Date('2000-01-21T04:40:00Z'), LAT, LNG);

        expect(view.fraction).toBeGreaterThan(0.99);
    });

    it('is half lit at the quarters, waxing first and waning second', () => {
        const first = moonView(new Date('2000-01-14T13:34:00Z'), LAT, LNG);
        const last = moonView(new Date('2000-01-28T07:57:00Z'), LAT, LNG);

        expect(first.fraction).toBeCloseTo(0.5, 1);
        expect(first.waxing).toBe(true);
        expect(last.fraction).toBeCloseTo(0.5, 1);
        expect(last.waxing).toBe(false);
    });

    it('keeps the rotation within a half turn', () => {
        const { rotation } = moonView(new Date('2026-11-21T21:00:00Z'), LAT, LNG);

        expect(rotation).toBeGreaterThanOrEqual(-180);
        expect(rotation).toBeLessThanOrEqual(180);
    });
});

describe('moonShape', () => {
    it('lights the right half at the first quarter', () => {
        const { path, flip } = moonShape(0.25);

        expect(path.startsWith('M25 0A25 25 0 0 1 25 50A0.000 25 0 0')).toBe(true);
        expect(flip).toBe(false);
    });

    it('mirrors the waning moon', () => {
        expect(moonShape(0.75).flip).toBe(true);
    });

    it('bulges the terminator to the right for a crescent and to the left for a gibbous moon', () => {
        expect(moonShape(0.1).path).toContain('0 0 0 25 0Z');
        expect(moonShape(0.4).path).toContain('0 0 1 25 0Z');
    });

    it('covers the whole disc at the full moon and nothing at the new moon', () => {
        expect(moonShape(0.5).path).toContain('A25.000 25 0 0 1 25 0Z');
        expect(moonShape(0).path).toContain('A25.000 25 0 0 0 25 0Z');
    });
});
