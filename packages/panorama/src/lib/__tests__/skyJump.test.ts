import * as SunCalc from 'suncalc';
import { describe, expect, it } from 'vitest';

import { closestMoonPhase, MOON_PHASES, nightOfMoonPhase, timeOfDay } from '../skyJump';

describe('timeOfDay', () => {
    it('gives midday and the start of the same local day', () => {
        const from = new Date(2026, 6, 21, 17, 45, 12);

        expect(timeOfDay(from, 'day')).toEqual(new Date(2026, 6, 21, 12, 0, 0));
        expect(timeOfDay(from, 'night')).toEqual(new Date(2026, 6, 21, 0, 0, 0));
    });
});

describe('nightOfMoonPhase', () => {
    it.each(MOON_PHASES)('finds a night with the $label within a month', ({ phase, label }) => {
        const from = new Date(2026, 10, 23, 12, 0, 0);
        const night = nightOfMoonPhase(from, phase);
        const found = SunCalc.getMoonIllumination(night).phase;
        const gap = Math.min(Math.abs(found - phase), 1 - Math.abs(found - phase));

        expect(night.getTime(), label).toBeGreaterThanOrEqual(from.getTime() - 12 * 3600_000);
        expect(gap).toBeLessThan(0.02);
    });
});

describe('closestMoonPhase', () => {
    it('reads back the phase it jumped to', () => {
        MOON_PHASES.forEach(({ phase }, index) => {
            expect(closestMoonPhase(nightOfMoonPhase(new Date(2026, 10, 23, 12), phase))).toBe(index);
        });
    });
});
