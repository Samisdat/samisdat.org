/**
 * Color naming model c3 (Heer & Stone 2012, "Color Naming Models for Color
 * Selection, Image Editing and Palette Design", CHI 2012), loaded from the
 * vendored model vendor/c3/c3_data.json (BSD-3-Clause, see vendor/c3/README.md).
 *
 * The model splits the CIELAB space (D65) into 8325 cells and counts, per
 * cell, how often participants of the XKCD color survey called it by each of
 * 153 names. Two colors are "named differently" when their name distributions
 * differ: the Hellinger distance (0 identical, 1 disjoint) between the rows of
 * that count table, exactly as `c3.color.hellinger` in the original library.
 * A color outside the grid is mapped to the nearest cell first.
 */
import { readFileSync } from 'node:fs';

import { converter, parse } from 'culori';

type Lab = readonly [number, number, number];

type RawModel = { color: number[]; terms: string[]; T: number[] };

export type NameModel = {
    terms: string[];
    /** Cell centers in CIELAB (D65). */
    cells: Lab[];
    /** Per cell: sparse name counts (term index -> count) and their sum. */
    counts: Map<number, number>[];
    totals: number[];
};

export function loadNameModel(file = new URL('../vendor/c3/c3_data.json', import.meta.url)): NameModel {
    const raw = JSON.parse(readFileSync(file, 'utf8')) as RawModel;
    const words = raw.terms.length;
    const cells: Lab[] = [];
    for (let i = 0; i < raw.color.length; i += 3) {
        cells.push([raw.color[i], raw.color[i + 1], raw.color[i + 2]]);
    }
    const counts = cells.map(() => new Map<number, number>());
    const totals = cells.map(() => 0);
    // T is a flat list of [index, count] pairs with index = cell * words + term.
    for (let i = 0; i < raw.T.length; i += 2) {
        const cell = Math.floor(raw.T[i] / words);
        const term = raw.T[i] % words;
        counts[cell].set(term, raw.T[i + 1]);
        totals[cell] += raw.T[i + 1];
    }
    return { terms: raw.terms, cells, counts, totals };
}

const toLab = converter('lab65');

export const labOf = (color: string): Lab => {
    const parsed = parse(color);
    if (!parsed) throw new Error(`Cannot parse color: ${color}`);
    const lab = toLab(parsed);
    return [lab.l, lab.a, lab.b];
};

const sq = (n: number) => n * n;

/** Nearest model cell (Euclidean in CIELAB) and its distance. */
export function nearestCell(model: NameModel, lab: Lab): { cell: number; distance: number } {
    let best = -1;
    let bestSq = Number.POSITIVE_INFINITY;
    model.cells.forEach((c, i) => {
        const d = sq(c[0] - lab[0]) + sq(c[1] - lab[1]) + sq(c[2] - lab[2]);
        if (d < bestSq) {
            bestSq = d;
            best = i;
        }
    });
    return { cell: best, distance: Math.sqrt(bestSq) };
}

/** The most frequent names of a cell with their probability. */
export function topTerms(model: NameModel, cell: number, limit: number): { term: string; p: number }[] {
    return [...model.counts[cell]]
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([term, n]) => ({ term: model.terms[term], p: n / model.totals[cell] }));
}

/** Hellinger distance of the name distributions of two cells (0..1). */
export function hellinger(model: NameModel, a: number, b: number): number {
    let overlap = 0;
    for (const [term, na] of model.counts[a]) {
        const nb = model.counts[b].get(term);
        if (nb) overlap += Math.sqrt(na * nb);
    }
    const z = Math.sqrt(model.totals[a] * model.totals[b]);
    return Math.sqrt(Math.max(0, 1 - overlap / z));
}
