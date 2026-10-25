import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { buildItems, unifiedDiff } from '../build';
import type { Item, Part } from '../types';

const DIR = join(__dirname, '../../../../content/diff-demo/story');
const STEPS = 8;
const version = (n: number) => readFileSync(join(DIR, `v${n}.txt`), 'utf8');

/** The items of step n: the change from v(n-1) to v(n). */
const step = (n: number): Item[] => buildItems(version(n - 1), version(n));
const rows = (items: Item[]) => items.flatMap(item => (item.type === 'change' ? item.rows : []));
const lines = (items: Item[]) => rows(items).flatMap(row => (row.type === 'line' ? [row.line] : []));
const partsOf = (items: Item[]) => lines(items).flatMap(line => line.parts);
const text = (parts: Part[]) => parts.map(part => part.t).join('');
const places = (parts: Part[]) => parts.filter((part, i) => part.k && !parts[i - 1]?.k).length;

describe('the story of the made-up file in eight small steps', () => {
    it('changes something in every step', () => {
        for (let n = 1; n <= STEPS; n++) {
            expect(version(n)).not.toBe(version(n - 1));
        }
    });

    it('shows every line of the new file exactly once in every step', () => {
        for (let n = 1; n <= STEPS; n++) {
            const numbers = step(n).flatMap(item => {
                if (item.type === 'lines' || item.type === 'fold') return item.lines.map(line => line.no);
                return item.rows.flatMap(row => (row.type === 'line' ? [row.line.no] : []));
            });

            expect(numbers).toEqual(Array.from({ length: version(n).trimEnd().split('\n').length }, (_, i) => i + 1));
        }
    });

    it('is written in one style: constants and arrow functions, never the function keyword', () => {
        for (let n = 0; n <= STEPS; n++) {
            expect(version(n)).not.toMatch(/\bfunction\b/);
        }
    });

    it('step 1: new lines, a whole block of them', () => {
        const added = lines(step(1)).filter(line => line.kind === 'add');

        expect(added.length).toBeGreaterThanOrEqual(8);
        expect(rows(step(1)).every(row => row.type === 'line')).toBe(true);
    });

    it('step 2: a single new line, everything else folds', () => {
        const items = step(2);
        const folded = items.filter(item => item.type === 'fold').reduce((n, item) => n + item.lines.length, 0);

        expect(lines(items).map(line => line.kind)).toEqual(['add']);
        expect(folded).toBeGreaterThan(40);
    });

    it('step 3: one token changes in three lines', () => {
        const changed = lines(step(3)).filter(line => line.kind === 'chg');

        expect(changed).toHaveLength(3);
        for (const line of changed) {
            expect(text(line.parts.filter(part => part.k === 'old'))).toBe('string');
            expect(text(line.parts.filter(part => part.k === 'new'))).toBe('Amet');
        }
    });

    it('step 4: a token falls away and a line disappears', () => {
        const items = step(4);
        const deleted = partsOf(items).filter(part => part.k === 'old' && part.g === undefined);

        expect(deleted.map(part => part.t)).toEqual(['?', '?']);
        expect(rows(items).filter(row => row.type === 'ghost')).toHaveLength(1);
    });

    it('step 5: three places in one line', () => {
        const [line] = lines(step(5));
        const groups = new Set(line.parts.filter(part => part.g !== undefined).map(part => part.g));

        expect(line.kind).toBe('chg');
        expect(line.parts.find(part => part.k === 'old' && part.g === undefined)?.t).toBe('export ');
        expect(groups.size).toBe(2);
    });

    it('step 6: too much for one line, so the old line stands above the new one', () => {
        const all = rows(step(6));

        expect(all.filter(row => row.type === 'old')).toHaveLength(1);
        expect(all.filter(row => row.type === 'line')).toHaveLength(1);
    });

    it('step 7: only the indentation changes', () => {
        const all = lines(step(7));

        expect(all.filter(line => line.kind === 'ws')).toHaveLength(2);
        expect(places(all.find(line => line.kind === 'chg')!.parts)).toBeGreaterThanOrEqual(2);
    });

    it('step 8: lines leave one function and appear in a new one, a call only gains text', () => {
        const items = step(8);
        const added = lines(items).filter(line => line.kind === 'add');
        const ghosts = rows(items).filter(row => row.type === 'ghost');
        const gained = lines(items).find(line => line.kind === 'chg' && !line.parts.some(part => part.k === 'old'));

        expect(added.length).toBeGreaterThanOrEqual(6);
        expect(ghosts.reduce((n, row) => n + (row.type === 'ghost' ? row.lines.length : 0), 0)).toBe(5);
        expect(gained?.parts.some(part => part.k === 'new')).toBe(true);
    });

    it('gives the classic view of step 1 one hunk that starts at the new lines', () => {
        const hunks = unifiedDiff(version(0), version(1));

        expect(hunks).toHaveLength(1);
        expect(hunks[0].lines.filter(line => line.prefix === '+').length).toBeGreaterThanOrEqual(8);
    });
});
