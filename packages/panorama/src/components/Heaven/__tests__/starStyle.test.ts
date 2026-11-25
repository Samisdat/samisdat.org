import { describe, expect, it } from 'vitest';

import { starLimit } from '../starStyle';

describe('starLimit', () => {
    it('keeps the 3 brightest stars while twilight has not got to nautical', () => {
        expect(starLimit(120, 0)).toBe(3);
    });

    it('lets the others in by the reveal until all show', () => {
        expect(starLimit(120, 0.5)).toBe(62);
        expect(starLimit(120, 1)).toBe(120);
    });

    it('never shows more stars than are in the window', () => {
        expect(starLimit(2, 0)).toBe(2);
        expect(starLimit(0, 1)).toBe(0);
    });
});
