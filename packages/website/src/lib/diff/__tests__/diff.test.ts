import { describe, expect, it } from 'vitest';

import { buildItems, lineOps, pairLines, similarity, unifiedDiff } from '../build';
import { changedTokens, changeRuns, tokenDiff, tokenize } from '../tokens';

describe('tokenize', () => {
    it('splits into words, whitespace and single characters', () => {
        expect(tokenize('a(b, c)')).toEqual(['a', '(', 'b', ',', ' ', 'c', ')']);
    });
});

describe('tokenDiff', () => {
    it('marks the added token and keeps the rest', () => {
        const segs = tokenDiff('const { a } = x;', 'const { a, b } = x;');

        expect(
            segs
                .filter(seg => seg.kind === 'new')
                .map(seg => seg.text)
                .join('')
        ).toBe(', b');
        expect(segs.some(seg => seg.kind === 'old')).toBe(false);
    });
});

describe('changeRuns', () => {
    it('counts separate places of change in a line', () => {
        expect(changeRuns(tokenDiff('size: string;', 'size: Fluid;'))).toBe(1);
        expect(changeRuns(tokenDiff('export const A: T = 1;', 'const B: U = 1;'))).toBeGreaterThan(1);
    });
});

describe('changedTokens', () => {
    it('counts removed and added tokens, not whitespace', () => {
        expect(changedTokens(tokenDiff('h2?: string;', 'h2: Fluid;'))).toBe(3);
        expect(changedTokens(tokenDiff('size: string;', 'size: Fluid;'))).toBe(2);
    });
});

describe('similarity', () => {
    it('is 1 when only whitespace differs', () => {
        expect(similarity('    const files = 1;', 'const files = 1;')).toBe(1);
    });

    it('is 0 for unrelated lines', () => {
        expect(similarity('foo bar', 'baz qux')).toBe(0);
    });
});

describe('pairLines', () => {
    it('pairs similar lines and leaves the rest removed or added', () => {
        const result = pairLines(
            ['const a = load(x);', 'unrelated old'],
            ['const a = await load(x);', 'something else entirely new']
        );

        expect(result.filter(p => p.type === 'pair')).toEqual([{ type: 'pair', a: 0, b: 0 }]);
        expect(result.some(p => p.type === 'del')).toBe(true);
        expect(result.some(p => p.type === 'add')).toBe(true);
    });
});

describe('lineOps', () => {
    it('keeps common lines and reports the rest', () => {
        expect(lineOps(['a', 'b', 'c'], ['a', 'x', 'c']).map(op => op.type)).toEqual(['same', 'del', 'add', 'same']);
    });
});

describe('unifiedDiff', () => {
    it('numbers the hunks and puts removed lines before added ones', () => {
        const [hunk] = unifiedDiff('1\n2\n3\n4\n5\n6\n7\n', '1\n2\n3\nx\n5\n6\n7\n');

        expect(hunk.header).toBe('@@ -1,7 +1,7 @@');
        expect(hunk.lines.map(line => line.prefix + line.text)).toEqual([
            ' 1',
            ' 2',
            ' 3',
            '-4',
            '+x',
            ' 5',
            ' 6',
            ' 7',
        ]);
    });

    it('names the enclosing declaration after the range, like git', () => {
        const old = ['function first() {', ...Array.from({ length: 20 }, (_, i) => `    line${i};`), '}'].join('\n');
        const changed = old.replace('line18;', 'changed;');

        expect(unifiedDiff(old, changed)[0].context).toBe('function first() {');
    });

    it('splits far-apart changes into several hunks', () => {
        const old = Array.from({ length: 30 }, (_, i) => `l${i}`).join('\n');
        const changed = old.replace('l2\n', 'X\n').replace('l27\n', 'Y\n');

        expect(unifiedDiff(old, changed)).toHaveLength(2);
    });
});

describe('a line with more than three places', () => {
    const items = buildItems('a b c d e f g h\n', 'A b C d E f G h\n');
    const rows = items.flatMap(item => (item.type === 'change' ? item.rows : []));

    it('stands as the old line above the new one, each marking only its own side', () => {
        expect(rows.map(row => row.type)).toEqual(['old', 'line']);
        const [oldRow, newRow] = rows;

        expect(oldRow.type === 'old' && oldRow.line.parts.some(part => part.k === 'old')).toBe(true);
        expect(oldRow.type === 'old' && oldRow.line.parts.some(part => part.k === 'new')).toBe(false);
        expect(newRow.type === 'line' && newRow.line.parts.some(part => part.k === 'new')).toBe(true);
        expect(newRow.type === 'line' && newRow.line.parts.some(part => part.k === 'old')).toBe(false);
    });
});

describe('a line that only gains text', () => {
    it('stays inline however much it gains, there is no old text to show above it', () => {
        const items = buildItems(
            'const res = await api.get(url);\n',
            'const res = await api.get(url, { signal: controller.signal, retries: 3, timeout: 500 });\n'
        );
        const rows = items.flatMap(item => (item.type === 'change' ? item.rows : []));

        expect(rows.map(row => row.type)).toEqual(['line']);
        expect(rows[0]).toMatchObject({ line: { kind: 'chg' } });
    });
});
