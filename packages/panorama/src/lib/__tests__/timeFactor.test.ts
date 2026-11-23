import { describe, expect, it } from 'vitest';

import { factorAt, FACTORS, formatEquivalence, SPEED_STEPS, stepOf } from '../timeFactor';

describe('factorAt', () => {
    it('is normal time at step 0', () => {
        expect(factorAt(0)).toBe(1);
    });

    it('ends at one hour per second', () => {
        expect(factorAt(SPEED_STEPS)).toBe(3600);
    });

    it('has eleven stops that never decrease', () => {
        expect(FACTORS).toHaveLength(11);

        for (let step = 1; step <= SPEED_STEPS; step += 1) {
            expect(factorAt(step)).toBeGreaterThan(factorAt(step - 1));
        }
    });

    it('clamps steps outside the slider', () => {
        expect(factorAt(-5)).toBe(1);
        expect(factorAt(SPEED_STEPS + 20)).toBe(3600);
    });
});

describe('stepOf', () => {
    it('is the inverse of factorAt on every stop', () => {
        for (let step = 0; step <= SPEED_STEPS; step += 1) {
            expect(stepOf(factorAt(step))).toBe(step);
        }
    });

    it('snaps a factor between two stops to the lower one and clamps below 1', () => {
        expect(stepOf(7)).toBe(stepOf(5));
        expect(stepOf(0.5)).toBe(0);
    });
});

describe('formatEquivalence', () => {
    it('names normal time', () => {
        expect(formatEquivalence(1)).toBe('1 s im Panorama = 1 s');
    });

    it('uses seconds, minutes and hours', () => {
        expect(formatEquivalence(5)).toBe('1 s = 5 s im Panorama');
        expect(formatEquivalence(600)).toBe('1 s = 10 min im Panorama');
        expect(formatEquivalence(3600)).toBe('1 s = 1 h im Panorama');
    });
});
