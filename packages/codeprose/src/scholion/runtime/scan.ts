export type RefEntry = {
    /** First code target: the prose side links here, peeks and the return chip point at it */
    a: HTMLAnchorElement;
    /** Every code target of the ref (`#all`), `a` first */
    as: HTMLAnchorElement[];
    /** Text-side targets (`.ref-target`) of this ref */
    cs: Element[];
    /** Explanation block (`[data-explains]`) */
    b: HTMLElement;
    /** Description (`#desc-<id>`) */
    d: HTMLElement;
    pre: HTMLElement | null;
    /** Token color at scan time; `useTokenColors` keeps it current across theme changes */
    color: string;
    /** Code line for the code peek, refs replaced by plain spans, own token marked */
    codeHtml: string;
    lineNum: string | null;
    /** Description for the text peek, targets marked */
    textHtml: string;
};

export type Registry = {
    ids: string[];
    refs: Record<string, RefEntry>;
};

/**
 * Reads the token color of a ref: the inline `var(--color-syntax-…)` string if Shiki set one,
 * the computed color otherwise.
 * Shiki places syntax colors on inner <span> elements, not on the <a> itself.
 */
export function readTokenColor(a: HTMLAnchorElement): string {
    const span = a.querySelector<HTMLElement>('span');
    return span?.style.color || getComputedStyle(span ?? a).color;
}

export const emptyRegistry: Registry = { ids: [], refs: {} };

function codeSnapshot(a: HTMLAnchorElement, id: string): { html: string; lineNum: string | null } {
    const lineEl = a.closest<HTMLElement>('[data-line]') ?? a.closest<HTMLElement>('.line');
    if (!lineEl) return { html: '', lineNum: null };
    const clone = lineEl.cloneNode(true) as Element;
    clone.querySelectorAll('a.ref').forEach(node => {
        const span = document.createElement('span');
        span.innerHTML = node.innerHTML;
        if ((node as HTMLElement).dataset.ref === id) span.className = 'scholion-peek__token';
        node.replaceWith(span);
    });
    return { html: clone.outerHTML, lineNum: lineEl.dataset.line ?? null };
}

function textSnapshot(d: HTMLElement, id: string): string {
    const clone = d.cloneNode(true) as Element;
    clone.removeAttribute('id');
    // Paragraphs with several refs nest the other refs' anchors: no duplicate ids in the peek
    clone.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
    clone.querySelectorAll('[data-explains]').forEach(node => node.removeAttribute('data-explains'));
    // The peek is aria-hidden and sits inside a button: no nested links. Only the own target is marked.
    clone.querySelectorAll<HTMLElement>('a.ref-target').forEach(node => {
        const span = document.createElement('span');
        span.innerHTML = node.innerHTML;
        if (node.dataset.ref === id) span.className = 'ref-target scholion-peek__token';
        node.replaceWith(span);
    });
    return clone.outerHTML;
}

/**
 * Builds the ref registry from the server-rendered markup.
 * Refs without anchor, explanation or description are skipped.
 */
export function scanRefs(root: ParentNode): Registry {
    const aEls = [...root.querySelectorAll<HTMLAnchorElement>('a.ref[data-ref]')];
    const ids = [...new Set(aEls.map(a => a.dataset.ref!))];
    const refs: Record<string, RefEntry> = {};

    for (const id of ids) {
        const as = [...root.querySelectorAll<HTMLAnchorElement>(`a.ref[data-ref="${id}"]`)];
        const a = as[0];
        const b = root.querySelector<HTMLElement>(`[data-explains="${id}"]`);
        const d = root.querySelector<HTMLElement>(`#desc-${id}`);
        if (!a || !b || !d) continue;

        const color = readTokenColor(a);
        const code = codeSnapshot(a, id);

        refs[id] = {
            a,
            as,
            cs: [...root.querySelectorAll(`.ref-target[data-ref="${id}"]`)],
            b,
            d,
            pre: a.closest('pre'),
            color,
            codeHtml: code.html,
            lineNum: code.lineNum,
            textHtml: textSnapshot(d, id),
        };
    }

    return { ids: Object.keys(refs), refs };
}
