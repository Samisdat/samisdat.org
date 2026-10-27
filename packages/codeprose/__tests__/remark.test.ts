import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import { describe, expect, it } from 'vitest'
import { remarkScholion } from '../src/scholion/remark.ts'

async function process(md: string): Promise<string> {
    const result = await unified()
        .use(remarkParse)
        .use(remarkScholion)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeStringify, { allowDangerousHtml: true })
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

Das [\`<animateTransform>\`](#anim) steckt in der Gruppe.
`.trim()

describe('remarkScholion', () => {
    it('annotates explanation paragraph with correct IDs and attributes', async () => {
        const html = await process(FIXTURE)
        expect(html).toContain('id="explain-anim"')
        expect(html).toContain('data-explains="anim"')
        expect(html).toContain('tabindex="-1"')
        expect(html).toContain('id="desc-anim"')
    })

    it('keeps the fragment link as a ref-target link to the code token', async () => {
        const html = await process(FIXTURE)
        expect(html).toMatch(/<a [^>]*class="ref-target"[^>]*>/)
        expect(html).toContain('data-ref="anim"')
        expect(html).toContain('href="#ref-anim"')
        expect(html).toContain('zum Code"')
    })

    it('adds no extra backlink to the explanation paragraph', async () => {
        const html = await process(FIXTURE)
        expect(html).not.toContain('backref')
        expect(html).not.toContain('Zum Code')
    })

    it('injects :has() CSS for the ref', async () => {
        const html = await process(FIXTURE)
        expect(html).toContain('<style>')
        expect(html).toContain('[data-ref="anim"]')
        expect(html).toContain('var(--scholion-hover-bg)')
    })

    it('emits a warning when a ref has no explanation', async () => {
        const md = `\`\`\`svg scholion:anim=<animateTransform\n<animateTransform />\n\`\`\``
        const file = await unified()
            .use(remarkParse)
            .use(remarkScholion)
            .use(remarkRehype)
            .use(rehypeStringify)
            .process(md)
        expect(file.messages.some(m => m.message.includes('"anim"'))).toBe(true)
    })
})
