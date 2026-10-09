import rehypePrettyCode from 'rehype-pretty-code'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import { describe, expect, it } from 'vitest'
import { scholionTransformer } from '../src/scholion/transformer.ts'

async function process(md: string): Promise<string> {
    const result = await unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypePrettyCode, {
            transformers: [scholionTransformer()],
        })
        .use(rehypeStringify)
        .process(md)
    return String(result)
}

const FIXTURE = `
\`\`\`svg scholion:anim=<animateTransform
<svg>
  <g>
    <animateTransform attributeName="transform" />
  </g>
</svg>
\`\`\`
`.trim()

const FIXTURE_LINE_HINT = `
\`\`\`svg scholion:repeat=repeatCount@4
<animate repeatCount="indefinite" />
<animate repeatCount="indefinite" />
<animate repeatCount="indefinite" />
<animate repeatCount="indefinite" />
\`\`\`
`.trim()

describe('scholionTransformer', () => {
    it('wraps matching token in <a> with correct attributes', async () => {
        const html = await process(FIXTURE)
        expect(html).toContain('id="ref-anim"')
        expect(html).toContain('class="ref"')
        expect(html).toContain('data-ref="anim"')
        expect(html).toContain('href="#explain-anim"')
        expect(html).toContain('aria-describedby="desc-anim"')
    })

    it('respects @line hint to disambiguate repeated patterns', async () => {
        const html = await process(FIXTURE_LINE_HINT)
        // Only one <a id="ref-repeat"> should appear
        const count = (html.match(/id="ref-repeat"/g) || []).length
        expect(count).toBe(1)
    })

    it('excludes leading indentation whitespace from the anchor', async () => {
        // <animateTransform> is indented inside <g>; Shiki merges that indentation
        // into the first token span. The anchor must wrap only the matched token,
        // otherwise the box-shadow underline starts at the left code margin.
        const html = await process(FIXTURE)
        const anchor = html.match(/<a id="ref-anim"[^>]*>(.*?)<\/a>/s)?.[1] ?? ''
        const text = anchor.replace(/<[^>]+>/g, '').replace(/&#x3C;|&lt;/g, '<')
        expect(text).toBe('<animateTransform')
        expect(text).not.toMatch(/^\s/)
    })

    it('does nothing for code blocks without scholion meta', async () => {
        const html = await process('```js\nconst x = 1\n```')
        expect(html).not.toContain('data-ref=')
    })
})
