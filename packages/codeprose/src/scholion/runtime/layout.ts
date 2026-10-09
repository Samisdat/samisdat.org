export type Rect = { top: number; bottom: number; left: number; right: number; width: number; height: number }
export type Point = { x: number; y: number }
export type PeekKind = 'code' | 'text'
export type PeekPos = 'top' | 'bottom'
export type Want = { kind: PeekKind; pos: PeekPos }

export function inView(rect: Rect | null, vh: number): boolean {
    return !!rect && rect.bottom > 0 && rect.top < vh
}

/** Decides which peek (if any) is needed: the one pointing at the endpoint that is out of view. */
export function wantPeek({ a, c, vh }: { a: Rect; c: Rect | null; vh: number }): Want | null {
    const aOn = inView(a, vh)
    const cOn = !!c && inView(c, vh)
    if (cOn && !aOn) return { kind: 'code', pos: a.bottom <= 0 ? 'top' : 'bottom' }
    if (aOn && c && !cOn) return { kind: 'text', pos: c.bottom <= 0 ? 'top' : 'bottom' }
    return null
}

/** Anchor point on the code token, clamped to the enclosing `pre`; `clipped` when it had to be moved. */
export function ptA(preRect: Rect | null, a: Rect, towardY: number): Point & { clipped: boolean } {
    let x = a.left + a.width / 2
    const clipped = !!preRect && (x < preRect.left + 10 || x > preRect.right - 10)
    if (preRect) x = Math.min(Math.max(x, preRect.left + 10), preRect.right - 10)
    const down = towardY > a.top + a.height / 2
    const y = clipped ? (down ? preRect!.bottom - 6 : preRect!.top + 6) : (down ? a.bottom + 1 : a.top - 1)
    return { x, y, clipped }
}

/** Anchor point on the text target. */
export function ptC(c: Rect, towardY: number): Point {
    return { x: c.left + c.width / 2, y: towardY > c.top + c.height / 2 ? c.bottom + 1 : c.top - 1 }
}

/** Anchor point on the peek: under the token (clamped to the peek) on the edge facing the content. */
export function ptPeek({ peek, token, pos }: { peek: Rect; token: Rect | null; pos: PeekPos }): Point {
    const t = token ?? peek
    return {
        x: Math.min(Math.max(t.left + t.width / 2, peek.left + 16), peek.right - 16),
        y: pos === 'bottom' ? peek.top : peek.bottom,
    }
}

export type Wire = { P: Point; Q: Point; dashed: boolean }

/**
 * Wire endpoints for one active ref, or null when it cannot be drawn.
 * `want`/`peek` are only passed for the ref that owns the currently shown peek.
 */
export function computeWire({ a, c, preRect, want, peek, vh }: {
    a: Rect
    c: Rect | null
    preRect: Rect | null
    want: Want | null
    peek: { rect: Rect; token: Rect | null } | null
    vh: number
}): Wire | null {
    if (want && peek && want.kind === 'code' && c) {
        const Q = ptPeek({ peek: peek.rect, token: peek.token, pos: want.pos })
        return { P: ptC(c, Q.y), Q, dashed: true }
    }
    if (want && peek && want.kind === 'text') {
        const Q = ptPeek({ peek: peek.rect, token: peek.token, pos: want.pos })
        return { P: ptA(preRect, a, Q.y), Q, dashed: true }
    }
    if (inView(a, vh) && c && inView(c, vh)) {
        const pa = ptA(preRect, a, c.top)
        return { P: ptC(c, pa.y), Q: pa, dashed: pa.clipped }
    }
    return null
}

export function wirePath(P: Point, Q: Point): string {
    const dy = Math.sign(Q.y - P.y || 1) * Math.max(Math.abs((Q.y - P.y) * 0.5), 18)
    return `M${P.x},${P.y} C${P.x},${P.y + dy} ${Q.x},${Q.y - dy} ${Q.x},${Q.y}`
}
