import { describe, expect, it } from 'vitest';

import { computeSunTimes } from '../sunTimes';

const NOON = new Date('2024-06-21T12:00:00+02:00');
const day = computeSunTimes(NOON);
const at = (ms: number) => computeSunTimes(new Date(ms));

describe('computeSunTimes', () => {
    it('orders the twilight and sun events within one day', () => {
        expect(day.dawn).toBeLessThan(day.sunrise);
        expect(day.sunrise).toBeLessThan(day.sunset);
        expect(day.sunset).toBeLessThan(day.dusk);
        expect(day.currentTime).toBe(NOON.getTime());
    });

    it('has a longer day in summer than in winter', () => {
        const winter = computeSunTimes(new Date('2024-12-21T12:00:00+01:00'));

        expect(day.sunset - day.sunrise).toBeGreaterThan(winter.sunset - winter.sunrise);
    });

    it('is full day at noon: clear sky, dark windows', () => {
        expect(day).toMatchObject({ isDay: true, skyOpacity: 0, windowOpacity: 0 });
    });

    it('is full night before dawn: dark sky, lit windows', () => {
        expect(at(day.dawn - 60_000)).toMatchObject({ isDay: false, skyOpacity: 1, windowOpacity: 1 });
    });

    it('is full night after dusk', () => {
        expect(at(day.dusk + 60_000)).toMatchObject({ isDay: false, skyOpacity: 1, windowOpacity: 1 });
    });

    it('fades the sky out and the windows off between dawn and sunrise', () => {
        const mid = at((day.dawn + day.sunrise) / 2);

        expect(mid.isDay).toBe(false);
        expect(mid.skyOpacity).toBeCloseTo(0.5, 5);
        expect(mid.windowOpacity).toBeCloseTo(0.5, 5);
    });

    it('fades the sky in and the windows on between sunset and dusk', () => {
        const mid = at((day.sunset + day.dusk) / 2);

        expect(mid.isDay).toBe(false);
        expect(mid.skyOpacity).toBeCloseTo(0.5, 5);
        expect(mid.windowOpacity).toBeCloseTo(0.5, 5);
    });

    it('switches to day exactly at sunrise and back to night exactly at sunset', () => {
        expect(at(day.sunrise).isDay).toBe(true);
        expect(at(day.sunset).isDay).toBe(false);
    });

    it('keeps both opacities within 0..1 across the whole day', () => {
        for (let ms = day.dawn - 3_600_000; ms <= day.dusk + 3_600_000; ms += 600_000) {
            const { skyOpacity, windowOpacity } = at(ms);

            expect(skyOpacity).toBeGreaterThanOrEqual(0);
            expect(skyOpacity).toBeLessThanOrEqual(1);
            expect(windowOpacity).toBeGreaterThanOrEqual(0);
            expect(windowOpacity).toBeLessThanOrEqual(1);
        }
    });
});
