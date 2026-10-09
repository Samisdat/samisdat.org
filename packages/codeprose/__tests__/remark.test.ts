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

    it('transforms fragment link to ref-target span', async () => {
        const html = await process(FIXTURE)
        expect(html).toContain('class="ref-target"')
        expect(html).toContain('data-ref="anim"')
    })

    it('appends backref link to explanation paragraph', async () => {
        const html = await process(FIXTURE)
        expect(html).toContain('class="backref"')
        expect(html).toContain('href="#ref-anim"')
        expect(html).toContain('Zum Code')
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
