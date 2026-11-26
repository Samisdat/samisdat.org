import { describe, expect, it } from 'vitest';

import { BUMP_KINDS, bumpCloud, BumpCloudType } from '../bumpCloud';

const TYPES = Object.keys(BUMP_KINDS) as BumpCloudType[];

/** End points of the path's commands; arcs carry radii and flags before theirs. */
const points = (path: string) =>
    [...path.matchAll(/([MLA])([^MLAZ]*)/g)].map(([, command, args]) => {
        const values = args.trim().split(/\s+/).map(Number);

        return 'A' === command ? values.slice(5, 7) : values.slice(0, 2);
    });

describe('bumpCloud', () => {
    it('draws the same cloud for the same seed', () => {
        TYPES.forEach(type => {
            expect(bumpCloud({ seed: 7, type })).toEqual(bumpCloud({ seed: 7, type }));
        });
    });

    it('draws different clouds for different seeds', () => {
        expect(bumpCloud({ seed: 1, type: 'cumulus' }).body).not.toBe(bumpCloud({ seed: 2, type: 'cumulus' }).body);
    });

    it('keeps width and aspect inside the type', () => {
        TYPES.forEach(type => {
            for (let seed = 0; seed < 100; seed += 1) {
                const { width, height } = bumpCloud({ seed, type });
                const kind = BUMP_KINDS[type];

                expect(width).toBeGreaterThanOrEqual(kind.width[0] - 0.1);
                expect(width).toBeLessThanOrEqual(kind.width[1] + 0.1);
                expect(width / height).toBeGreaterThanOrEqual(kind.aspect[0] - 0.05);
                expect(width / height).toBeLessThanOrEqual(kind.aspect[1] + 0.05);
            }
        });
    });

    it('stays inside its box', () => {
        for (let seed = 0; seed < 100; seed += 1) {
            const { width, height, body, shade } = bumpCloud({ seed, type: 'cumulus' });

            [body, shade].forEach(path => {
                const xs = points(path).map(([x]) => x);
                const ys = points(path).map(([, y]) => y);

                expect(Math.min(...xs)).toBeGreaterThanOrEqual(0);
                expect(Math.max(...xs)).toBeLessThanOrEqual(width + 0.1);
                expect(Math.min(...ys)).toBeGreaterThanOrEqual(-0.1);
                expect(Math.max(...ys)).toBeLessThanOrEqual(height + 0.1);
            });
        }
    });

    it('takes the width when given', () => {
        expect(bumpCloud({ seed: 3, type: 'cumulus', width: 300 }).width).toBe(300);
    });

    it('moves the shade with the light, and not the crown', () => {
        const left = bumpCloud({ seed: 5, type: 'cumulus', light: -2 });
        const right = bumpCloud({ seed: 5, type: 'cumulus', light: 2 });
        // The bottom edge is shared with the underside, so only the crown up to the first line stays put.
        const crown = (body: string) => body.slice(0, body.indexOf('L'));

        expect(crown(left.body)).toBe(crown(right.body));
        expect(left.shade).not.toBe(right.shade);
    });

    it('draws the outline from arcs', () => {
        expect(bumpCloud({ seed: 4, type: 'cumulus' }).body).toMatch(/^M0 [\d.]+A/);
    });

    it('writes only rounded numbers', () => {
        expect(bumpCloud({ seed: 11, type: 'stratocumulus' }).body).not.toMatch(/\d\.\d\d/);
    });
});
