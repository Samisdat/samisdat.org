import type { ShikiTransformer } from 'shiki'
import type { Element } from 'hast'

const DEFAULT_LABEL = '···'
const ANNOTATION_RE = /^\/\/\s*!collapse\((\d+):(\d+)\)(?:\s+(.+))?$/

type CollapseInfo = {
    label: string
    startLineIndex: number
    count: number
    indent: number
}

export function collapseTransformer(): ShikiTransformer {
    let infos: CollapseInfo[] = []

    return {
        name: '@samisdat/collapse',
        preprocess(code) {
            infos = []
            const lines = code.split('\n')
            const kept: string[] = []

            for (let i = 0; i < lines.length; i++) {
                const match = lines[i].trim().match(ANNOTATION_RE)
                if (match) {
                    const from = parseInt(match[1], 10)
                    const to = parseInt(match[2], 10)
                    const label = match[3]?.trim() || DEFAULT_LABEL
                    const indent = (lines[i + 1] ?? '').match(/^(\s*)/)?.[1]?.length ?? 0
                    infos.push({
                        label,
                        startLineIndex: kept.length + from - 1,
                        count: to - from + 1,
                        indent,
                    })
                } else {
                    kept.push(lines[i])
                }
            }

            return kept.join('\n')
        },
        code(codeEl) {
            if (infos.length === 0) return

            // Process in reverse so earlier splice indices stay valid after mutations
            const sorted = [...infos].sort((a, b) => b.startLineIndex - a.startLineIndex)
            for (const info of sorted) {
                wrapCollapse(codeEl, info)
            }
        },
    }
}

function wrapCollapse(codeEl: Element, info: CollapseInfo): void {
    const lineIndices: number[] = []
    for (let i = 0; i < codeEl.children.length; i++) {
        const child = codeEl.children[i]
        if (child.type === 'element' && child.tagName === 'span') {
            lineIndices.push(i)
        }
    }

    const lastLine = info.startLineIndex + info.count - 1
    if (lastLine >= lineIndices.length) return

    const firstChildIdx = lineIndices[info.startLineIndex]
    const lastChildIdx = lineIndices[lastLine]

    const extracted = codeEl.children.splice(firstChildIdx, lastChildIdx - firstChildIdx + 1)

    const details: Element = {
        type: 'element',
        tagName: 'details',
        properties: { className: ['code-collapse'] },
        children: [
            {
                type: 'element',
                tagName: 'summary',
                properties: info.indent > 0 ? { style: `padding-left: ${info.indent}ch` } : {},
                children: [{ type: 'text', value: info.label }],
            },
            ...extracted,
        ],
    }

    codeEl.children.splice(firstChildIdx, 0, details)
}
