import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { afterAll, describe, expect, it } from 'vitest';

import { hellinger, labOf, loadNameModel, nearestCell, topTerms } from '../name-model';

// Two terms, three cells: cell 0 is only "red", cell 1 is only "blue", cell 2 is a 3:1 mix.
const dir = mkdtempSync(join(tmpdir(), 'c3-'));
const file = join(dir, 'tiny.json');
writeFileSync(
    file,
    JSON.stringify({
        terms: ['red', 'blue'],
        color: [50, 60, 40, 30, 0, -60, 40, 30, 10],
        // index = cell * terms + term
        T: [0, 10, 3, 10, 4, 6, 5, 2],
    })
);
const model = loadNameModel(pathToFileURL(file));

afterAll(() => rmSync(dir, { recursive: true, force: true }));

describe('loadNameModel', () => {
    it('splits the flat color list into LAB cells', () => {
        expect(model.cells).toEqual([
            [50, 60, 40],
            [30, 0, -60],
            [40, 30, 10],
        ]);
    });

    it('decodes sparse counts and totals per cell', () => {
        expect(model.counts[0].get(0)).toBe(10);
        expect(model.counts[1].get(1)).toBe(10);
        expect(model.counts[2]).toEqual(
            new Map([
                [0, 6],
                [1, 2],
            ])
        );
        expect(model.totals).toEqual([10, 10, 8]);
    });

    it('loads the vendored c3 model', () => {
        const c3 = loadNameModel();

        expect(c3.cells).toHaveLength(8325);
        expect(c3.terms).toHaveLength(153);
    });
});

describe('labOf', () => {
    it('converts white and black to the ends of the lightness axis', () => {
        expect(labOf('#ffffff')[0]).toBeCloseTo(100, 0);
        expect(labOf('#000000')[0]).toBeCloseTo(0, 0);
    });

    it('accepts oklch strings', () => {
        expect(labOf('oklch(0.6 0.2 25)')[1]).toBeGreaterThan(0);
    });

    it('throws for unparseable input', () => {
        expect(() => labOf('not-a-color')).toThrow('Cannot parse color: not-a-color');
    });
});

describe('nearestCell', () => {
    it('finds the closest cell and the euclidean distance', () => {
        expect(nearestCell(model, [50, 60, 40])).toEqual({ cell: 0, distance: 0 });
        expect(nearestCell(model, [30, 0, -57])).toEqual({ cell: 1, distance: 3 });
    });
});

describe('topTerms', () => {
    it('sorts by frequency, converts counts to probabilities and respects the limit', () => {
        expect(topTerms(model, 2, 5)).toEqual([
            { term: 'red', p: 0.75 },
            { term: 'blue', p: 0.25 },
        ]);
        expect(topTerms(model, 2, 1)).toEqual([{ term: 'red', p: 0.75 }]);
    });
});

describe('hellinger', () => {
    it('is 0 for identical distributions and 1 for disjoint ones', () => {
        expect(hellinger(model, 0, 0)).toBeCloseTo(0, 10);
        expect(hellinger(model, 0, 1)).toBe(1);
    });

    it('is symmetric and lies in between for overlapping distributions', () => {
        const d = hellinger(model, 0, 2);

        expect(d).toBeGreaterThan(0);
        expect(d).toBeLessThan(1);
        expect(hellinger(model, 2, 0)).toBeCloseTo(d, 10);
    });
});
