import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { parseAnsi } from '../ansi';

describe('parseAnsi', () => {
    it('splits lines and keeps the text of each span', () => {
        const lines = parseAnsi('plain \x1b[1mbold\x1b[0m end\nnext');

        expect(lines).toHaveLength(2);
        expect(lines[0].map(span => span.text).join('')).toBe('plain bold end');
        expect(lines[0][1]).toMatchObject({ text: 'bold', bold: true });
        expect(lines[0][2].bold).toBeUndefined();
    });

    it('combines attributes and maps bright colors to the basic ones', () => {
        const [[span]] = parseAnsi('\x1b[92;1;3mtext\x1b[0m');

        expect(span).toMatchObject({ text: 'text', fg: 2, bold: true, italic: true });
    });

    it('resets the foreground with 39', () => {
        const [[, after]] = parseAnsi('\x1b[91mred\x1b[39mplain');

        expect(after.fg).toBeUndefined();
    });

    it('reads the recorded difftastic output without losing text', () => {
        const raw = readFileSync(join(__dirname, '../../../../content/diff-demo/story/difft.ansi'), 'utf8');
        const text = parseAnsi(raw)
            .map(line => line.map(span => span.text).join(''))
            .join('\n');

        // eslint-disable-next-line no-control-regex
        expect(text).toBe(raw.replace(/\x1b\[[0-9;]*m/g, '').replace(/\n$/, ''));
        expect(text).toContain('--- 1/2 --- TypeScript');
    });
});
