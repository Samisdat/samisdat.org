import rehypePrettyCode from 'rehype-pretty-code'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import { describe, expect, it } from 'vitest'
import { collapseTransformer } from '../src/collapse-transformer.ts'

async function process(md: string): Promise<string> {
    const result = await unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypePrettyCode, {
            transformers: [collapseTransformer()],
        })
        .use(rehypeStringify)
        .process(md)
    return String(result)
}

describe('collapseTransformer', () => {
    it('wraps annotated lines in <details><summary>', async () => {
        const md = [
            '```js',
            '// !collapse(1:2) imports',
            "import { foo } from 'foo'",
            "import { bar } from 'bar'",
            'const x = 1',
            '```',
        ].join('\n')
        const html = await process(md)
        expect(html).toContain('<details')
        expect(html).toContain('<summary>imports</summary>')
    })

    it('strips the annotation comment line from output', async () => {
        const md = [
            '```js',
            '// !collapse(1:2) imports',
            "import { foo } from 'foo'",
            "import { bar } from 'bar'",
            '```',
        ].join('\n')
        const html = await process(md)
        expect(html).not.toContain('!collapse')
    })

    it('uses default label when none provided', async () => {
        const md = ['```js', '// !collapse(1:1)', 'const x = 1', '```'].join('\n')
        const html = await process(md)
        expect(html).toContain('<summary>···</summary>')
    })

    it('leaves lines outside the range uncollapsed', async () => {
        const md = [
            '```js',
            '// !collapse(1:1) imports',
            "import { foo } from 'foo'",
            'const x = 1',
            '```',
        ].join('\n')
        const html = await process(md)
        const outside = html.replace(/<details[^>]*>.*?<\/details>/s, '')
        expect(outside).toContain('x')
    })

    it('handles multiple collapses in one block', async () => {
        const md = [
            '```js',
            '// !collapse(1:1) first',
            "import { foo } from 'foo'",
            'const x = 1',
            '// !collapse(1:1) second',
            "import { bar } from 'bar'",
            '```',
        ].join('\n')
        const html = await process(md)
        expect((html.match(/<details/g) ?? []).length).toBe(2)
        expect(html).toContain('<summary>first</summary>')
        expect(html).toContain('<summary>second</summary>')
    })

    it('applies padding-left matching the indentation of the first collapsed line', async () => {
        const md = [
            '```js',
            'function foo() {',
            '  // !collapse(1:1) body',
            '  const x = 1',
            '}',
            '```',
        ].join('\n')
        const html = await process(md)
        expect(html).toContain('padding-left: 2ch')
    })

    it('omits padding-left when collapsed lines have no indentation', async () => {
        const md = ['```js', '// !collapse(1:1)', 'const x = 1', '```'].join('\n')
        const html = await process(md)
        expect(html).not.toContain('padding-left')
    })

    it('does nothing for blocks without annotation', async () => {
        const html = await process('```js\nconst x = 1\n```')
        expect(html).not.toContain('<details')
    })
})
