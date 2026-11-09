import rehypePrettyCode from 'rehype-pretty-code';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { describe, expect, it } from 'vitest';

import { collapseTransformer } from '../src/annotations/collapse-transformer.ts';
import { placeholderTransformer } from '../src/annotations/placeholder-transformer.ts';

async function process(md: string): Promise<string> {
    const result = await unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypePrettyCode, { transformers: [placeholderTransformer(), collapseTransformer()] })
        .use(rehypeStringify)
        .process(md);
    return String(result);
}

const block = (lang: string, ...lines: string[]) => ['```' + lang, ...lines, '```'].join('\n');

const marked = (html: string, key: string) =>
    [...html.matchAll(new RegExp(`<span[^>]*data-placeholder="${key}"[^>]*>([^<]*)</span>`, 'g'))].map(m => m[1]);

describe('placeholderTransformer', () => {
    it('marks a double-quoted value and keeps the quotes outside the span', async () => {
        const html = await process(block('json', '{', '// !placeholder normX "0.00"', '"x": "0.00"', '}'));
        expect(marked(html, 'normX')).toEqual(['0.00']);
        expect(html).toContain('"<span data-placeholder="normX">0.00</span>"');
    });

    it('marks a single-quoted value and keeps the quotes outside the span', async () => {
        const html = await process(block('js', 'const c = {', '// !placeholder pixelX "0.00"', "x: '0.00',", '};'));
        expect(marked(html, 'pixelX')).toEqual(['0.00']);
        expect(html).toContain("'<span data-placeholder=\"pixelX\">0.00</span>'");
    });

    it('marks a backtick-quoted value', async () => {
        const html = await process(block('js', 'const c = {', '// !placeholder pixelX "0.00"', 'x: `0.00`,', '};'));
        expect(marked(html, 'pixelX')).toEqual(['0.00']);
        expect(html).toContain('`<span data-placeholder="pixelX">0.00</span>`');
    });

    it('marks a bare number', async () => {
        const html = await process(block('js', 'const c = {', '// !placeholder pixelX "0.00"', 'x: 0.00,', '};'));
        expect(marked(html, 'pixelX')).toEqual(['0.00']);
    });

    it('accepts the value in the marker comment without quotes', async () => {
        const html = await process(block('js', 'const c = {', '// !placeholder pixelX 0.00', "x: '0.00',", '};'));
        expect(marked(html, 'pixelX')).toEqual(['0.00']);
    });

    it('selects the nth occurrence with #n', async () => {
        const md = block('js', '// !placeholder second 0.00#2', 'const p = [0.00, 0.00, 0.00];');
        const html = await process(md);
        expect(marked(html, 'second')).toEqual(['0.00']);
        expect(html.match(/data-placeholder/g)).toHaveLength(1);
        const [before, after] = html.split('data-placeholder="second"');
        expect(before.match(/>0\.00</g)).toHaveLength(1);
        expect(after.match(/>0\.00</g)).toHaveLength(2);
    });

    it('marks nothing when the occurrence does not exist', async () => {
        const html = await process(block('js', '// !placeholder k 0.00#3', 'const p = [0.00, 0.00];'));
        expect(html).not.toContain('data-placeholder');
    });

    it('strips the marker line from the output', async () => {
        const html = await process(block('js', '// !placeholder pixelX "0.00"', "const x = '0.00';"));
        expect(html).not.toContain('!placeholder');
    });

    it('keeps the line offset when a collapse annotation precedes the marker', async () => {
        const md = block('js', '// !collapse(1:1) setup', 'const a = 1;', '// !placeholder k "0.00"', "const x = '0.00';");
        const html = await process(md);
        expect(marked(html, 'k')).toEqual(['0.00']);
    });
});
