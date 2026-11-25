import { describe, expect, it } from 'vitest';

import { bumpCloud } from '../bumpCloud';
import { splitCloud } from '../splitCloud';

describe('splitCloud', () => {
    it('parts every cloud into two halves that each have a body', () => {
        for (let seed = 0; seed < 50; seed += 1) {
            const [left, right] = splitCloud({ seed, type: 'cumulus' });

            expect(left.body).toMatch(/^M[\d.]+ [\d.]+A/);
            expect(right.body).toMatch(/^M[\d.]+ [\d.]+A/);
        }
    });

    it('keeps the whole cloud’s reach between the two halves', () => {
        for (let seed = 0; seed < 50; seed += 1) {
            const { width } = bumpCloud({ seed, type: 'cumulus' });
            const [left, right] = splitCloud({ seed, type: 'cumulus' });

            expect(left.from).toBeCloseTo(0, 0);
            expect(right.to).toBeCloseTo(width, 0);
            expect(left.from).toBeLessThan(right.from);
            expect(left.to).toBeLessThan(right.to);
        }
    });

    it('parts near the asked place', () => {
        const [atThird] = splitCloud({ seed: 5, type: 'stratocumulus' }, 0.3);
        const [atTwoThirds] = splitCloud({ seed: 5, type: 'stratocumulus' }, 0.7);

        expect(atThird.to).toBeLessThan(atTwoThirds.to);
    });

    it('splits the same way every time', () => {
        expect(splitCloud({ seed: 9, type: 'cumulus' })).toEqual(splitCloud({ seed: 9, type: 'cumulus' }));
    });
});
