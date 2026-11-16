import rehypePrettyCode from 'rehype-pretty-code';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import type { Element } from 'hast';
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
        expect(html).toMatch(/>"<\/span><span[^>]*data-placeholder="normX"[^>]*>0\.00<\/span><span[^>]*>"</);
    });

    it('marks a single-quoted value and keeps the quotes outside the span', async () => {
        const html = await process(block('js', 'const c = {', '// !placeholder pixelX "0.00"', "x: '0.00',", '};'));
        expect(marked(html, 'pixelX')).toEqual(['0.00']);
        expect(html).toMatch(/>'<\/span><span[^>]*data-placeholder="pixelX"[^>]*>0\.00<\/span><span[^>]*>'</);
    });

    it('marks a backtick-quoted value', async () => {
        const html = await process(block('js', 'const c = {', '// !placeholder pixelX "0.00"', 'x: `0.00`,', '};'));
        expect(marked(html, 'pixelX')).toEqual(['0.00']);
        expect(html).toMatch(/>`<\/span><span[^>]*data-placeholder="pixelX"[^>]*>0\.00<\/span><span[^>]*>`</);
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
        expect(before.match(/0\.00/g)).toHaveLength(1);
        expect(after.match(/0\.00/g)).toHaveLength(2);
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

describe('placeholderTransformer marker parsing', () => {
    it('stays fast on pathological marker lines', async () => {
        const evil = '// !placeholder ! a' + ' '.repeat(50000) + '\u0000';
        const start = performance.now();
        await process(block('js', evil, 'const x = 1;'));
        expect(performance.now() - start).toBeLessThan(2000);
    });

    it('treats a marker without a value as plain code', async () => {
        const html = await process(block('js', '// !placeholder onlykey', 'const x = 1;'));
        expect(html).not.toContain('data-placeholder');
    });
});

// A theme may split one literal into several tokens (the site's shikiTheme turns `0.0` into ` 0`, `.`, `0`),
// which the default theme in the tests above does not do. These tests feed such tokens in directly.
describe('placeholderTransformer with split tokens', () => {
    const token = (value: string, color = '#fff'): Element => ({
        type: 'element',
        tagName: 'span',
        properties: { style: `color:${color}` },
        children: [{ type: 'text', value }],
    });

    const run = (code: string, tokens: Element[]): Element => {
        const transformer = placeholderTransformer();
        const kept = (transformer.preprocess as (c: string) => string).call({}, code);
        expect(kept.split('\n')).toHaveLength(1);
        const line: Element = { type: 'element', tagName: 'span', properties: {}, children: tokens };
        const codeEl: Element = { type: 'element', tagName: 'code', properties: {}, children: [line] };
        (transformer.code as (el: Element) => void).call({}, codeEl);
        return line;
    };

    const texts = (line: Element) =>
        line.children.map(c => ({
            text: c.type === 'element' ? (c.children[0] as { value: string }).value : '',
            key: c.type === 'element' ? c.properties['data-placeholder'] : undefined,
        }));

    const SPLIT = () => [token('    x'), token(':'), token(' 0', '#a'), token('.', '#b'), token('0', '#a'), token(',')];

    it('marks a number the theme split into several tokens as one span', () => {
        const line = run('// !placeholder pixelX 0.0\n    x: 0.0,', SPLIT());
        expect(texts(line).map(t => t.text)).toEqual(['    x', ':', ' ', '0.0', ',']);
        expect(texts(line).find(t => t.key)).toEqual({ text: '0.0', key: 'pixelX' });
    });

    it('keeps the style of the first token on the marked span', () => {
        const line = run('// !placeholder pixelX 0.0\n    x: 0.0,', SPLIT());
        const marked = line.children.find(c => c.type === 'element' && c.properties['data-placeholder']) as Element;
        expect(marked.properties.style).toBe('color:#a');
    });

    it('does not match inside a longer number', () => {
        const longer = [token('    x'), token(':'), token(' 10', '#a'), token('.', '#b'), token('05', '#a'), token(',')];
        const line = run('// !placeholder pixelX 0.0\n    x: 10.05,', longer);
        expect(texts(line).some(t => t.key)).toBe(false);
    });
});
