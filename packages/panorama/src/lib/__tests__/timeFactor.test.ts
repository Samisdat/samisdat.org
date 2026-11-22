import { describe, expect, it } from 'vitest';

import { factorAt, formatEquivalence, formatFactor, SPEED_STEPS } from '../timeFactor';

describe('factorAt', () => {
    it('is normal time at step 0', () => {
        expect(factorAt(0)).toBe(1);
    });

    it('leaves normal time with the first step', () => {
        expect(factorAt(1)).toBe(10);
    });

    it('ends at two hours per second', () => {
        expect(factorAt(SPEED_STEPS)).toBe(7200);
    });

    it('never decreases', () => {
        for (let step = 1; step <= SPEED_STEPS; step += 1) {
            expect(factorAt(step)).toBeGreaterThanOrEqual(factorAt(step - 1));
        }
    });

    it('clamps steps outside the ring', () => {
        expect(factorAt(-5)).toBe(1);
        expect(factorAt(SPEED_STEPS + 20)).toBe(factorAt(SPEED_STEPS));
    });
});

describe('formatFactor', () => {
    it('names normal time and prefixes everything else with ×', () => {
        expect(formatFactor(1)).toBe('Normal');
        expect(formatFactor(60)).toBe('×60');
    });
});

describe('formatEquivalence', () => {
    it('uses seconds, minutes and hours with a decimal comma', () => {
        expect(formatEquivalence(1)).toBe('1 s = 1 s');
        expect(formatEquivalence(10)).toBe('1 s = 10 s');
        expect(formatEquivalence(150)).toBe('1 s = 2,5 min');
        expect(formatEquivalence(900)).toBe('1 s = 15 min');
        expect(formatEquivalence(7200)).toBe('1 s = 2,0 h');
    });
});
