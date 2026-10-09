export type RefEntry = {
    a: HTMLAnchorElement
    /** Text-side targets (`.ref-target`) of this ref */
    cs: Element[]
    /** Explanation block (`[data-explains]`) */
    b: HTMLElement
    /** Description (`#desc-<id>`) */
    d: HTMLElement
    pre: HTMLElement | null
    /** Token color at scan time; `useTokenColors` keeps it current across theme changes */
    color: string
    /** Code line for the code peek, refs replaced by plain spans, own token marked */
    codeHtml: string
    lineNum: string | null
    /** Description for the text peek, targets marked */
    textHtml: string
}

export type Registry = {
    ids: string[]
    refs: Record<string, RefEntry>
}

/**
 * Reads the token color of a ref: the inline `var(--color-syntax-…)` string if Shiki set one,
 * the computed color otherwise.
 * Shiki places syntax colors on inner <span> elements, not on the <a> itself.
 */
export function readTokenColor(a: HTMLAnchorElement): string {
    const span = a.querySelector<HTMLElement>('span')
    return span?.style.color || getComputedStyle(span ?? a).color
}

export const emptyRegistry: Registry = { ids: [], refs: {} }

function codeSnapshot(a: HTMLAnchorElement, id: string): { html: string; lineNum: string | null } {
    const lineEl = a.closest<HTMLElement>('[data-line]') ?? a.closest<HTMLElement>('.line')
    if (!lineEl) return { html: '', lineNum: null }
    const clone = lineEl.cloneNode(true) as Element
    clone.querySelectorAll('a.ref').forEach(node => {
        const span = document.createElement('span')
        span.innerHTML = node.innerHTML
        if ((node as HTMLElement).dataset.ref === id) span.className = 'scholion-peek__token'
        node.replaceWith(span)
    })
    return { html: clone.outerHTML, lineNum: lineEl.dataset.line ?? null }
}

function textSnapshot(d: HTMLElement): string {
    const clone = d.cloneNode(true) as Element
    clone.removeAttribute('id')
    clone.querySelectorAll('.ref-target').forEach(s => s.classList.add('scholion-peek__token'))
    return clone.outerHTML
}

/**
 * Builds the ref registry from the server-rendered markup.
 * Refs without anchor, explanation or description are skipped.
 */
export function scanRefs(root: ParentNode): Registry {
    const aEls = [...root.querySelectorAll<HTMLAnchorElement>('a.ref[data-ref]')]
    const ids = [...new Set(aEls.map(a => a.dataset.ref!))]
    const refs: Record<string, RefEntry> = {}

    for (const id of ids) {
        const a = root.querySelector<HTMLAnchorElement>(`a.ref[data-ref="${id}"]`)
        const b = root.querySelector<HTMLElement>(`[data-explains="${id}"]`)
        const d = root.querySelector<HTMLElement>(`#desc-${id}`)
        if (!a || !b || !d) continue

        const color = readTokenColor(a)
        const code = codeSnapshot(a, id)

        refs[id] = {
            a,
            cs: [...root.querySelectorAll(`.ref-target[data-ref="${id}"]`)],
            b,
            d,
            pre: a.closest('pre'),
            color,
            codeHtml: code.html,
            lineNum: code.lineNum,
            textHtml: textSnapshot(d),
        }
    }

    return { ids: Object.keys(refs), refs }
}
