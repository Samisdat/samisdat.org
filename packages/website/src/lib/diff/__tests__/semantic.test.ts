import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { analyze, parseDecls } from '../semantic';

const version = (n: number) =>
    readFileSync(join(__dirname, '../../../../content/diff-demo/story', `v${n}.txt`), 'utf8');

describe('parseDecls', () => {
    it('finds the top-level declarations with their kind, name and lines', () => {
        const decls = parseDecls("import a from 'a';\n\nexport interface Foo {\n  x: string;\n}\n\nconst bar = 1;\n");

        expect(decls.map(({ kind, name, from, to }) => [kind, name, from, to])).toEqual([
            ['import', "'a'", 1, 1],
            ['interface', 'Foo', 3, 5],
            ['const', 'bar', 7, 7],
        ]);
    });
});

describe('analyze', () => {
    it('recognizes a rename by its body and names a replacement that repeats', () => {
        const report = analyze(
            'interface A {\n  size: string;\n  weight: number;\n}\nconst OLD = [1, 2, 3, 4, 5, 6];\n',
            'interface A {\n  size: Fluid;\n  weight: number;\n}\nconst NEW = [1, 2, 3, 4, 5, 6];\n'
        );

        expect(report.entries.find(entry => entry.status === 'renamed')).toMatchObject({ name: 'NEW', oldName: 'OLD' });
        expect(report.entries.find(entry => entry.name === 'A')?.notes).toContain('`string` → `Fluid`');
    });

    it('follows lines that moved to another declaration', () => {
        const body = (name: string, result: string) =>
            `function ${name}() {\n  const x = compute${name}(1, 2, 3, 4);\n  const y = compute${name}(5, 6, 7, 8);\n  return ${result};\n}\n`;
        const moved = '{ first: one.value, second: two.value }';
        const report = analyze(body('a', moved) + body('b', '1'), body('a', '1') + body('b', moved));

        const notes = report.entries.flatMap(entry => entry.notes);
        expect(notes.some(note => note.includes('nach `b` verschoben'))).toBe(true);
        expect(notes.some(note => note.includes('aus `a` übernommen'))).toBe(true);
    });

    it('reads the whole story as declarations: a rename, a repeated pattern and lines that moved', () => {
        const report = analyze(version(0), version(8));
        const find = (status: string, name: string) =>
            report.entries.find(entry => entry.status === status && entry.name === name);

        expect(find('added', 'Cillum')).toBeDefined();
        expect(find('renamed', 'cupidatat')).toMatchObject({ oldName: 'adipiscing' });
        expect(find('changed', 'Sit')?.notes.join(' ')).toContain('`string` → `Amet` (4×)');
        expect(find('changed', 'consequat')?.notes.join(' ')).toContain('nach `exercitation` verschoben');
        expect(find('added', 'exercitation')?.notes.join(' ')).toContain('aus `consequat` übernommen');
        // a lone bracket turning into a call is layout, not a replacement worth naming
        expect(find('changed', 'consequat')?.notes.join(' ')).not.toContain('`{` →');
        // a renamed declaration is still one declaration: nothing moved out of or into itself
        expect(find('renamed', 'cupidatat')?.notes.join(' ')).not.toMatch(/verschoben|übernommen/);
        expect(report.unchanged).toBeGreaterThanOrEqual(3);
    });
});
