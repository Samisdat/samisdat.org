import { describe, expect, it } from 'vitest';

import { parseMarkdown } from '../compile';

describe('parseMarkdown', () => {
    it.each(['', undefined, null, 42])('rejects invalid input %j', async input => {
        await expect(parseMarkdown(input as unknown as string)).rejects.toThrow(
            'Invalid markdown input: expected non-empty string'
        );
    });

    it('returns frontmatter from the mdx header', async () => {
        const { frontmatter } = await parseMarkdown('---\ntitle: Hello\npublished: true\n---\n\n# Hi\n');

        expect(frontmatter).toMatchObject({ title: 'Hello', published: true });
    });

    it('returns an empty frontmatter object when the document has none', async () => {
        const { frontmatter } = await parseMarkdown('# Hi\n');

        expect(frontmatter).toEqual({});
    });

    it('collects the names of static <Sandbox /> elements', async () => {
        const { sandboxNames } = await parseMarkdown('# Hi\n\n<Sandbox name="first" />\n\n<Sandbox name={"second"} />\n');

        expect(sandboxNames).toEqual(['first', 'second']);
    });

    it('wraps compile errors', async () => {
        await expect(parseMarkdown('<Unclosed')).rejects.toThrow(/^Failed to parse markdown: /);
    });

    it('wraps errors thrown while running the compiled module', async () => {
        await expect(parseMarkdown('export const x = missing;\n')).rejects.toThrow(/^Failed to parse markdown: /);
    });

    it('highlights fenced code through the shiki pipeline', async () => {
        const { MDXContent } = await parseMarkdown('```ts\nconst a = 1;\n```\n');
        const { renderToStaticMarkup } = await import('react-dom/server');
        const { createElement } = await import('react');

        const html = renderToStaticMarkup(createElement(MDXContent));

        expect(html).toContain('<pre');
        expect(html).toContain('const');
    });

    it('adds slug ids and anchor links to headings', async () => {
        const { MDXContent } = await parseMarkdown('## Deep Link Target\n');
        const { renderToStaticMarkup } = await import('react-dom/server');
        const { createElement } = await import('react');

        const html = renderToStaticMarkup(createElement(MDXContent));

        expect(html).toContain('id="deep-link-target"');
        expect(html).toContain('href="#deep-link-target"');
    });
});
