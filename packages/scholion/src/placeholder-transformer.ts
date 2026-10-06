import type { ShikiTransformer } from 'shiki'
import type { Element, ElementContent } from 'hast'

type PlaceholderInfo = {
    key: string
    value: string
    nextLineIndex: number
}

export function placeholderTransformer(): ShikiTransformer {
    let infos: PlaceholderInfo[] = []

    return {
        name: '@samisdat/placeholder',
        preprocess(code) {
            infos = []
            const lines = code.split('\n')
            const kept: string[] = []

            for (let i = 0; i < lines.length; i++) {
                const trimmed = lines[i].trim()
                const match = trimmed.match(/^\/\/\s*!placeholder\s+(\S+)\s+"([^"]+)"/)
                if (match) {
                    infos.push({ key: match[1], value: match[2], nextLineIndex: kept.length })
                    // Strip this line — don't push
                } else {
                    kept.push(lines[i])
                }
            }

            return kept.join('\n')
        },
        code(codeEl) {
            if (infos.length === 0) return

            const lines = codeEl.children.filter(
                (c): c is Element => c.type === 'element' && c.tagName === 'span'
            )

            for (const info of infos) {
                const lineEl = lines[info.nextLineIndex]
                if (!lineEl) continue
                markPlaceholder(lineEl, info.key, info.value)
            }
        },
    }
}

function getText(node: ElementContent): string {
    if (node.type === 'text') return node.value
    if (node.type === 'element') return node.children.map(getText).join('')
    return ''
}

function markPlaceholder(lineEl: Element, key: string, value: string): boolean {
    for (const child of lineEl.children) {
        if (child.type !== 'element') continue
        const text = getText(child)
        const trimmed = text.trimStart()
        const prefix = text.slice(0, text.length - trimmed.length)

        if (trimmed === value) {
            child.properties = { ...child.properties, 'data-placeholder': key }
            return true
        }
        if (trimmed === `"${value}"`) {
            // Keep quotes (and any leading whitespace) outside the marked span
            // so textContent updates don't clobber them.
            child.children = [
                { type: 'text', value: prefix + '"' },
                {
                    type: 'element',
                    tagName: 'span',
                    properties: { 'data-placeholder': key },
                    children: [{ type: 'text', value }],
                },
                { type: 'text', value: '"' },
            ]
            return true
        }
        if (markPlaceholder(child, key, value)) return true
    }
    return false
}
