import type { Element, ElementContent } from 'hast'
import type { ShikiTransformer } from 'shiki'
import { parseScholionMeta } from './parse-meta'
import type { ScholionRef } from './types'

function nodeText(node: ElementContent): string {
    if (node.type === 'text') return node.value
    if (node.type === 'element') return node.children.map(nodeText).join('')
    return ''
}

function wrapRef(codeEl: Element, ref: ScholionRef): void {
    const lines = codeEl.children.filter(
        (c): c is Element => c.type === 'element' && c.tagName === 'span'
    )

    type LineMatch = { lineEl: Element; lineNum: number; matchStart: number; matchEnd: number }
    const matches: LineMatch[] = []

    for (let li = 0; li < lines.length; li++) {
        const lineEl = lines[li]
        const lineNum = li + 1
        if (ref.line !== undefined && ref.line !== lineNum) continue

        const lineText = lineEl.children.map(nodeText).join('')
        let from = 0
        while (true) {
            const idx = lineText.indexOf(ref.pattern, from)
            if (idx === -1) break
            matches.push({ lineEl, lineNum, matchStart: idx, matchEnd: idx + ref.pattern.length })
            from = idx + 1
        }
    }

    if (matches.length === 0) {
        throw new Error(
            `scholion: ref "${ref.id}" – "${ref.pattern}" not found in code block`
        )
    }

    let target: LineMatch
    if (ref.line !== undefined) {
        if (matches.length > 1) {
            throw new Error(
                `scholion: ref "${ref.id}" – "${ref.pattern}" found ${matches.length} times in line ${ref.line}. Use #n to select.`
            )
        }
        target = matches[0]
    } else if (ref.occurrence !== undefined) {
        const occ = ref.occurrence
        if (occ < 1 || occ > matches.length) {
            throw new Error(
                `scholion: ref "${ref.id}" – occurrence #${occ} requested but only ${matches.length} found`
            )
        }
        target = matches[occ - 1]
    } else {
        if (matches.length > 1) {
            const lineNums = matches.map(m => m.lineNum).join(', ')
            throw new Error(
                `scholion: ref "${ref.id}" – "${ref.pattern}" found ${matches.length} times (lines ${lineNums}). Use @line or #n.`
            )
        }
        target = matches[0]
    }

    wrapSpansInLine(target.lineEl, target.matchStart, target.matchEnd, ref)
}

function wrapSpansInLine(
    lineEl: Element,
    matchStart: number,
    matchEnd: number,
    ref: ScholionRef
): void {
    type SpanInfo = { idx: number; charStart: number; charEnd: number }
    const infos: SpanInfo[] = []
    let offset = 0

    for (let i = 0; i < lineEl.children.length; i++) {
        const child = lineEl.children[i]
        const text = nodeText(child as ElementContent)
        infos.push({ idx: i, charStart: offset, charEnd: offset + text.length })
        offset += text.length
    }

    const covered = infos.filter(
        info => info.charEnd > matchStart && info.charStart < matchEnd
    )
    if (covered.length === 0) return

    const firstIdx = covered[0].idx
    const lastIdx = covered[covered.length - 1].idx
    const displayLabel = ref.pattern.replace(/^<\/?/, '')

    const anchor: Element = {
        type: 'element',
        tagName: 'a',
        properties: {
            id: `ref-${ref.id}`,
            className: ['ref'],
            'data-ref': ref.id,
            href: `#explain-${ref.id}`,
            'aria-describedby': `desc-${ref.id}`,
            'aria-label': `${displayLabel}, zur Erklärung`,
        },
        children: lineEl.children.slice(firstIdx, lastIdx + 1) as ElementContent[],
    }

    lineEl.children.splice(firstIdx, lastIdx - firstIdx + 1, anchor)
}

export function scholionTransformer(): ShikiTransformer {
    return {
        name: '@samisdat/scholion',
        code(codeEl) {
            const raw = (this.options as { meta?: { __raw?: string } }).meta?.__raw ?? ''
            const refs = parseScholionMeta(raw)
            if (refs.length === 0) return
            for (const ref of refs) {
                wrapRef(codeEl, ref)
            }
        },
    }
}
