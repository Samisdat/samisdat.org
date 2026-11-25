import { describe, expect, it } from 'vitest';

import { starShows } from '../starStyle';

describe('starShows', () => {
    it('keeps the 3 brightest stars of the window while twilight has not got to nautical', () => {
        expect(starShows(0, 0.5, 0)).toBe(true);
        expect(starShows(2, 1.5, 0)).toBe(true);
        expect(starShows(3, 1.5, 0)).toBe(false);
    });

    it('lets the fainter stars in by the reveal until all show', () => {
        expect(starShows(40, 3, 0.5)).toBe(false);
        expect(starShows(40, 3, 0.7)).toBe(true);
        expect(starShows(900, 4.5, 1)).toBe(true);
    });

    it('does not depend on how many stars are in the window', () => {
        expect(starShows(10, 2, 0.5)).toBe(starShows(500, 2, 0.5));
    });
});
