const SVG_NS = 'http://www.w3.org/2000/svg'

type RefEntry = {
    a: HTMLAnchorElement
    cs: Element[]
    b: HTMLElement
    d: HTMLElement
    pre: HTMLElement | null
}

type S = { hover: boolean; focus: boolean; pin: boolean; peek: boolean }

export function initScholion(): () => void {
    const aEls = [...document.querySelectorAll<HTMLAnchorElement>('a.ref[data-ref]')]
    if (!aEls.length) return () => {}

    const ids = [...new Set(aEls.map(a => a.dataset.ref!))]
    const refs: Record<string, RefEntry> = {}
    for (const id of ids) {
        const a = document.querySelector<HTMLAnchorElement>(`a.ref[data-ref="${id}"]`)
        const b = document.querySelector<HTMLElement>(`[data-explains="${id}"]`)
        const d = document.querySelector<HTMLElement>(`#desc-${id}`)
        if (!a || !b || !d) continue
        refs[id] = { a, cs: [...document.querySelectorAll(`.ref-target[data-ref="${id}"]`)], b, d, pre: a.closest('pre') }
    }
    const refIds = Object.keys(refs)
    if (!refIds.length) return () => {}

    // ── State ──────────────────────────────────────────────────────────────
    const state: Record<string, S> = Object.fromEntries(refIds.map(id => [id, { hover: false, focus: false, pin: false, peek: false }]))
    const isActive = (id: string) => { const s = state[id]; return s.hover || s.focus || s.pin || s.peek }

    let lastId: string | null = null
    let ret: { id: string; to: 'a' | 'c'; left: boolean } | null = null
    const shown: { code: string | null; text: string | null } = { code: null, text: null }
    const grace: Record<string, ReturnType<typeof setTimeout>> = {}
    let raf = 0
    let pointerOnA = 0

    const vh = () => window.visualViewport?.height ?? innerHeight
    const smoothBehavior = (): ScrollBehavior => matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'

    // ── DOM ────────────────────────────────────────────────────────────────
    const wires = document.createElementNS(SVG_NS, 'svg')
    wires.classList.add('scholion-wires')
    wires.setAttribute('aria-hidden', 'true')
    document.body.appendChild(wires)

    type GrpEls = { g: SVGGElement; path: SVGPathElement; d1: SVGCircleElement; d2: SVGCircleElement }
    const grps: Record<string, GrpEls> = {}
    for (const id of refIds) {
        const g = document.createElementNS(SVG_NS, 'g')
        g.classList.add('scholion-g')
        const path = document.createElementNS(SVG_NS, 'path')
        const d1 = document.createElementNS(SVG_NS, 'circle')
        d1.setAttribute('r', '3.2')
        const d2 = document.createElementNS(SVG_NS, 'circle')
        d2.setAttribute('r', '3.2')
        g.append(path, d1, d2)
        wires.appendChild(g)
        grps[id] = { g, path, d1, d2 }
    }
    // Capture token colors after layout.
    // Shiki places syntax colors on inner <span> elements, not on the <a> itself (color: inherit).
    // The span's inline color is a CSS variable (`var(--color-syntax-…)`); passing it on
    // unresolved keeps wires and inline lemmas in sync with theme switches and morphing.
    // The computed color is only the fallback for themes with literal colors.
    requestAnimationFrame(() => {
        for (const id of refIds) {
            const span = refs[id].a.querySelector<HTMLElement>('span')
            const color = span?.style.color || getComputedStyle(span ?? refs[id].a).color
            grps[id].g.style.color = color
            document.documentElement.style.setProperty(`--scholion-color-${id}`, color)
        }
    })

    const peekCode = mkBtn('scholion-peek scholion-peek--code', 'Zur Codezeile springen', `
        <span class="scholion-peek__meta" aria-hidden="true">
            <span class="scholion-peek__line"></span>
            <span>Antippen springt hin</span>
        </span>
        <span class="scholion-peek__code-line" aria-hidden="true"></span>`)
    const peekText = mkBtn('scholion-peek scholion-peek--text', 'Zur Erklärung springen', `
        <span class="scholion-peek__meta" aria-hidden="true">
            <span>Erklärung im Text</span>
            <span>Antippen springt hin</span>
        </span>
        <span class="scholion-peek__body" aria-hidden="true"></span>`)
    const chip = mkBtn('scholion-chip', 'Zurück', 'Zurück')
    document.body.append(peekCode, peekText, chip)

    // ── Peek ───────────────────────────────────────────────────────────────
    function fillCode(id: string) {
        if (shown.code === id) return
        const lineEl = refs[id].a.closest<HTMLElement>('[data-line]') ?? refs[id].a.closest<HTMLElement>('.line')
        if (!lineEl) return
        const clone = lineEl.cloneNode(true) as Element
        clone.querySelectorAll('a.ref').forEach(node => {
            const span = document.createElement('span')
            span.innerHTML = (node as Element).innerHTML
            if ((node as HTMLElement).dataset.ref === id) span.className = 'scholion-peek__token'
            node.replaceWith(span)
        })
        peekCode.querySelector('.scholion-peek__code-line')!.replaceChildren(clone)
        const lineNum = lineEl.dataset.line
        peekCode.querySelector('.scholion-peek__line')!.textContent = lineNum ? `Zeile ${lineNum}` : 'im Code'
        shown.code = id
    }

    function fillText(id: string) {
        if (shown.text === id) return
        const clone = refs[id].d.cloneNode(true) as Element
        clone.removeAttribute('id')
        clone.querySelectorAll('.ref-target').forEach(s => (s as HTMLElement).classList.add('scholion-peek__token'))
        peekText.querySelector('.scholion-peek__body')!.replaceChildren(clone)
        shown.text = id
    }

    function showPeek(kind: 'code' | 'text', id: string, pos: 'top' | 'bottom') {
        if (kind === 'code') fillCode(id); else fillText(id)
        const p = kind === 'code' ? peekCode : peekText
        p.classList.toggle('scholion-peek--bottom', pos === 'bottom')
        p.classList.add('scholion-peek--on')
        if (kind === 'code') {
            const token = p.querySelector<HTMLElement>('.scholion-peek__token')
            const line = p.querySelector<HTMLElement>('.scholion-peek__code-line')
            if (token && line) line.scrollLeft = token.offsetLeft - line.clientWidth / 2 + token.offsetWidth / 2
        }
    }

    function hidePeek(kind: 'code' | 'text') {
        const p = kind === 'code' ? peekCode : peekText
        p.classList.remove('scholion-peek--on')
        const id = shown[kind]
        if (id) state[id].peek = false
    }

    function hideChip() { ret = null; chip.classList.remove('scholion-chip--on') }

    function jump(kind: 'code' | 'text', id: string) {
        hidePeek(kind)
        const b = smoothBehavior()
        if (kind === 'code') {
            ret = { id, to: 'c', left: false }
            refs[id].a.focus({ preventScroll: true })
            refs[id].a.scrollIntoView({ block: 'center', inline: 'center', behavior: b })
            chip.textContent = 'Zurück zum Text'
        } else {
            ret = { id, to: 'a', left: false }
            refs[id].b.focus({ preventScroll: true })
            ;(refs[id].cs[0] ?? refs[id].b).scrollIntoView({ block: 'center', behavior: b })
            chip.textContent = 'Zurück zum Code'
        }
        chip.classList.add('scholion-chip--on')
        schedule()
    }

    // ── Draw ───────────────────────────────────────────────────────────────
    function draw() {
        const inView = (r: DOMRect | null) => !!r && r.bottom > 0 && r.top < vh()
        const geo: Record<string, { a: DOMRect; c: DOMRect | null }> = {}
        for (const id of refIds) {
            geo[id] = { a: refs[id].a.getBoundingClientRect(), c: refs[id].cs[0]?.getClientRects()[0] as DOMRect ?? null }
        }

        // Which peek to show
        const pr = lastId && isActive(lastId) ? lastId : null
        let want: { kind: 'code' | 'text'; pos: 'top' | 'bottom' } | null = null
        if (pr) {
            const { a, c } = geo[pr]
            const aOn = inView(a), cOn = c && inView(c)
            if (cOn && !aOn) want = { kind: 'code', pos: a.bottom <= 0 ? 'top' : 'bottom' }
            else if (aOn && c && !cOn) want = { kind: 'text', pos: c.bottom <= 0 ? 'top' : 'bottom' }
        }
        ;(['code', 'text'] as const).forEach(k => {
            if (want?.kind === k) showPeek(k, pr!, want.pos)
            else if (!(shown[k] && state[shown[k]!].peek && pr === shown[k])) hidePeek(k)
        })

        // Lift bottom peek above chip when both are visible
        const activeBottomPeek = [peekCode, peekText].find(p =>
            p.classList.contains('scholion-peek--on') && p.classList.contains('scholion-peek--bottom')
        )
        if (chip.classList.contains('scholion-chip--on') && activeBottomPeek) {
            const chipH = chip.getBoundingClientRect().height
            activeBottomPeek.style.bottom = `calc(env(safe-area-inset-bottom, 0px) + ${14 + chipH + 8}px)`
        } else {
            peekCode.style.bottom = ''
            peekText.style.bottom = ''
        }

        // Geometry helpers
        const ptA = (preRect: DOMRect | null, a: DOMRect, towardY: number) => {
            let x = a.left + a.width / 2
            const clipped = !!preRect && (x < preRect.left + 10 || x > preRect.right - 10)
            if (preRect) x = Math.min(Math.max(x, preRect.left + 10), preRect.right - 10)
            const down = towardY > a.top + a.height / 2
            const y = clipped ? (down ? preRect!.bottom - 6 : preRect!.top + 6) : (down ? a.bottom + 1 : a.top - 1)
            return { x, y, clipped }
        }
        const ptC = (c: DOMRect, towardY: number) => ({ x: c.left + c.width / 2, y: towardY > c.top + c.height / 2 ? c.bottom + 1 : c.top - 1 })
        const ptPeek = (kind: 'code' | 'text') => {
            const el = kind === 'code' ? peekCode : peekText
            const pr2 = el.getBoundingClientRect()
            const t = el.querySelector<HTMLElement>('.scholion-peek__token')?.getBoundingClientRect() ?? pr2
            return { x: Math.min(Math.max(t.left + t.width / 2, pr2.left + 16), pr2.right - 16), y: el.classList.contains('scholion-peek--bottom') ? pr2.top : pr2.bottom }
        }

        for (const id of refIds) {
            const { g, path, d1, d2 } = grps[id]
            const { a, c } = geo[id]
            if (!isActive(id)) { g.classList.remove('scholion-g--on'); continue }

            let P: { x: number; y: number }, Q: { x: number; y: number }, dashed: boolean
            const preRect = refs[id].pre?.getBoundingClientRect() ?? null

            if (want && pr === id && want.kind === 'code' && c) {
                Q = ptPeek('code'); P = ptC(c, Q.y); dashed = true
            } else if (want && pr === id && want.kind === 'text') {
                Q = ptPeek('text'); P = ptA(preRect, a, Q.y); dashed = true
            } else if (inView(a) && c && inView(c)) {
                const pa = ptA(preRect, a, c.top); P = ptC(c, pa.y); Q = pa; dashed = pa.clipped
            } else { g.classList.remove('scholion-g--on'); continue }

            const dy = Math.sign(Q.y - P.y || 1) * Math.max(Math.abs((Q.y - P.y) * 0.5), 18)
            path.setAttribute('d', `M${P.x},${P.y} C${P.x},${P.y + dy} ${Q.x},${Q.y - dy} ${Q.x},${Q.y}`)
            d1.setAttribute('cx', String(P.x)); d1.setAttribute('cy', String(P.y))
            d2.setAttribute('cx', String(Q.x)); d2.setAttribute('cy', String(Q.y))
            g.classList.toggle('scholion-g--dashed', dashed)
            g.classList.add('scholion-g--on')
        }

        // Auto-hide chip when return target scrolls back into view
        if (ret) {
            const vis = inView(ret.to === 'c' ? geo[ret.id].c : geo[ret.id].a)
            if (!vis) ret.left = true
            else if (ret.left) hideChip()
        }
    }

    function schedule() { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw) }

    // ── Hover ──────────────────────────────────────────────────────────────
    function hoverOn(id: string) { clearTimeout(grace[id]); state[id].hover = true; lastId = id; schedule() }
    function hoverOff(id: string) { clearTimeout(grace[id]); grace[id] = setTimeout(() => { state[id].hover = false; schedule() }, 250) }

    // ── Pin ────────────────────────────────────────────────────────────────
    function togglePin(id: string) {
        const next = !state[id].pin
        refIds.forEach(k => { state[k].pin = false })
        state[id].pin = next
        if (next) {
            document.documentElement.setAttribute('data-scholion-pin', id)
            const aRect = refs[id].a.getBoundingClientRect()
            if (aRect.bottom > 0 && aRect.top < vh()) scrollPreToA(id)
        } else {
            document.documentElement.removeAttribute('data-scholion-pin')
        }
        schedule()
    }

    function scrollPreToA(id: string) {
        const p = refs[id].pre; if (!p) return
        const a = refs[id].a.getBoundingClientRect(), v = p.getBoundingClientRect()
        if (a.left < v.left || a.right > v.right) p.scrollBy({ left: a.left - v.left - v.width / 2 + a.width / 2, behavior: smoothBehavior() })
    }

    // ── Events ─────────────────────────────────────────────────────────────
    const cleanups: (() => void)[] = []
    function reg(el: EventTarget, type: string, handler: EventListener, opts?: AddEventListenerOptions) {
        el.addEventListener(type, handler, opts)
        cleanups.push(() => el.removeEventListener(type, handler, opts))
    }

    for (const id of refIds) {
        const { a, cs } = refs[id]
        ;[a, ...cs].forEach(el => {
            reg(el, 'pointerenter', (e => { if ((e as PointerEvent).pointerType === 'mouse') hoverOn(id) }) as EventListener)
            reg(el, 'pointerleave', (e => { if ((e as PointerEvent).pointerType === 'mouse') hoverOff(id) }) as EventListener)
        })
        reg(a, 'pointerdown', (() => { pointerOnA = performance.now() }) as EventListener)
        reg(a, 'focus', (() => { if (a.matches(':focus-visible')) { state[id].focus = true; lastId = id; schedule() } }) as EventListener)
        reg(a, 'blur', (() => { state[id].focus = false; schedule() }) as EventListener)
        // Pointer tap → pin and prevent link navigation; keyboard → normal link
        reg(a, 'click', (e => {
            if ((e as MouseEvent).detail === 0 || performance.now() - pointerOnA > 1000) return
            e.preventDefault(); lastId = id; togglePin(id)
        }) as EventListener)
        cs.forEach(c => reg(c, 'click', (() => { lastId = id; togglePin(id) }) as EventListener))
    }

    ;(['code', 'text'] as const).forEach(kind => {
        const p = kind === 'code' ? peekCode : peekText
        reg(p, 'pointerenter', (e => {
            const id = shown[kind]; if ((e as PointerEvent).pointerType !== 'mouse' || !id) return
            clearTimeout(grace[id]); state[id].peek = true; schedule()
        }) as EventListener)
        reg(p, 'pointerleave', (e => {
            const id = shown[kind]; if ((e as PointerEvent).pointerType !== 'mouse' || !id) return
            state[id].peek = false; schedule()
        }) as EventListener)
        reg(p, 'click', (() => { const id = shown[kind]; if (id) jump(kind, id) }) as EventListener)
    })

    reg(chip, 'click', (() => {
        if (!ret) return
        const b = smoothBehavior()
        if (ret.to === 'c') {
            ;(refs[ret.id].cs[0] ?? refs[ret.id].b).scrollIntoView({ block: 'center', behavior: b })
            refs[ret.id].b.focus({ preventScroll: true })
        } else {
            refs[ret.id].a.scrollIntoView({ block: 'center', inline: 'center', behavior: b })
            refs[ret.id].a.focus({ preventScroll: true })
        }
        hideChip(); schedule()
    }) as EventListener)

    reg(document, 'click', (e => {
        if ((e as MouseEvent).defaultPrevented) return
        if ((e.target as Element).closest('a.ref, .ref-target, .scholion-peek, .scholion-chip')) return
        refIds.forEach(id => { state[id].pin = false })
        document.documentElement.removeAttribute('data-scholion-pin')
        schedule()
    }) as EventListener)

    reg(document, 'keydown', (e => {
        if ((e as KeyboardEvent).key !== 'Escape') return
        if (refIds.some(id => state[id].pin) || ret) {
            refIds.forEach(id => { state[id].pin = false })
            document.documentElement.removeAttribute('data-scholion-pin')
            hideChip(); schedule()
        }
    }) as EventListener)

    reg(window, 'scroll', schedule as EventListener, { passive: true })
    reg(window, 'resize', schedule as EventListener)
    new Set(refIds.map(id => refs[id].pre).filter(Boolean)).forEach(p => reg(p!, 'scroll', schedule as EventListener, { passive: true }))

    const ro = new ResizeObserver(schedule)
    ro.observe(document.body)
    cleanups.push(() => ro.disconnect())

    if (window.visualViewport) {
        reg(window.visualViewport, 'resize', schedule as EventListener)
        reg(window.visualViewport, 'scroll', schedule as EventListener)
    }

    document.fonts?.ready.then(schedule)
    schedule()

    return () => {
        cleanups.forEach(fn => fn())
        cancelAnimationFrame(raf)
        wires.remove(); peekCode.remove(); peekText.remove(); chip.remove()
    }
}

function mkBtn(cls: string, label: string, html: string): HTMLButtonElement {
    const btn = document.createElement('button')
    btn.type = 'button'
    btn.className = cls
    btn.setAttribute('aria-label', label)
    btn.innerHTML = html
    return btn
}
