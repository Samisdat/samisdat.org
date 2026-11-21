import { describe, expect, it } from 'vitest';

import { factorAt, formatEquivalence, formatFactor, SPEED_STEPS } from '../timeFactor';

describe('factorAt', () => {
    it('is normal time at step 0', () => {
        expect(factorAt(0)).toBe(1);
    });

    it('leaves normal time with the first step', () => {
        expect(factorAt(1)).toBe(2);
    });

    it('reaches about 53 minutes per second at the last step', () => {
        expect(factorAt(SPEED_STEPS)).toBeGreaterThan(3000);
        expect(factorAt(SPEED_STEPS)).toBeLessThan(3300);
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
        expect(formatFactor(21)).toBe('×21');
    });
});

describe('formatEquivalence', () => {
    it('uses seconds, minutes and hours with a decimal comma', () => {
        expect(formatEquivalence(1)).toBe('1 s = 1 s');
        expect(formatEquivalence(21)).toBe('1 s = 21 s');
        expect(formatEquivalence(150)).toBe('1 s = 2,5 min');
        expect(formatEquivalence(3170)).toBe('1 s = 53 min');
        expect(formatEquivalence(7200)).toBe('1 s = 2,0 h');
    });
});
