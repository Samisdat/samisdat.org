import { computeWire, inView, wantPeek, wirePath } from './runtime/layout'
import { createState, isActive, reduce, type ScholionEvent } from './runtime/state'

const SVG_NS = 'http://www.w3.org/2000/svg'

type RefEntry = {
    a: HTMLAnchorElement
    cs: Element[]
    b: HTMLElement
    d: HTMLElement
    pre: HTMLElement | null
}

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
    let state = createState(refIds)
    const dispatch = (event: ScholionEvent) => { state = reduce(state, event) }
    const active = (id: string) => isActive(state, id)

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
        if (id) dispatch({ type: 'peekLeave', id })
    }

    function hideChip() { dispatch({ type: 'chipBack' }); chip.classList.remove('scholion-chip--on') }

    function jump(kind: 'code' | 'text', id: string) {
        hidePeek(kind)
        const b = smoothBehavior()
        if (kind === 'code') {
            dispatch({ type: 'jump', kind, id })
            refs[id].a.focus({ preventScroll: true })
            refs[id].a.scrollIntoView({ block: 'center', inline: 'center', behavior: b })
            chip.textContent = 'Zurück zum Text'
        } else {
            dispatch({ type: 'jump', kind, id })
            refs[id].b.focus({ preventScroll: true })
            ;(refs[id].cs[0] ?? refs[id].b).scrollIntoView({ block: 'center', behavior: b })
            chip.textContent = 'Zurück zum Code'
        }
        chip.classList.add('scholion-chip--on')
        schedule()
    }

    // ── Draw ───────────────────────────────────────────────────────────────
    function draw() {
        const geo: Record<string, { a: DOMRect; c: DOMRect | null }> = {}
        for (const id of refIds) {
            geo[id] = { a: refs[id].a.getBoundingClientRect(), c: refs[id].cs[0]?.getClientRects()[0] as DOMRect ?? null }
        }

        // Which peek to show
        const pr = state.lastId && active(state.lastId) ? state.lastId : null
        const want = pr ? wantPeek({ a: geo[pr].a, c: geo[pr].c, vh: vh() }) : null
        ;(['code', 'text'] as const).forEach(k => {
            if (want?.kind === k) showPeek(k, pr!, want.pos)
            else if (!(shown[k] && state.flags[shown[k]!].peek && pr === shown[k])) hidePeek(k)
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

        // Peek geometry (measured after the peek is shown and the chip lift is applied)
        let peekGeo: { rect: DOMRect; token: DOMRect | null } | null = null
        if (want) {
            const el = want.kind === 'code' ? peekCode : peekText
            peekGeo = { rect: el.getBoundingClientRect(), token: el.querySelector<HTMLElement>('.scholion-peek__token')?.getBoundingClientRect() ?? null }
        }

        for (const id of refIds) {
            const { g, path, d1, d2 } = grps[id]
            const { a, c } = geo[id]
            if (!active(id)) { g.classList.remove('scholion-g--on'); continue }

            const preRect = refs[id].pre?.getBoundingClientRect() ?? null
            const wire = computeWire({ a, c, preRect, want: pr === id ? want : null, peek: peekGeo, vh: vh() })
            if (!wire) { g.classList.remove('scholion-g--on'); continue }
            const { P, Q, dashed } = wire

            path.setAttribute('d', wirePath(P, Q))
            d1.setAttribute('cx', String(P.x)); d1.setAttribute('cy', String(P.y))
            d2.setAttribute('cx', String(Q.x)); d2.setAttribute('cy', String(Q.y))
            g.classList.toggle('scholion-g--dashed', dashed)
            g.classList.add('scholion-g--on')
        }

        // Auto-hide chip when return target scrolls back into view
        const ret = state.ret
        if (ret) {
            const vis = inView(ret.to === 'c' ? geo[ret.id].c : geo[ret.id].a, vh())
            if (!vis) dispatch({ type: 'retLeft' })
            else if (ret.left) {
                dispatch({ type: 'retArrived' })
                chip.classList.remove('scholion-chip--on')
            }
        }
    }

    function schedule() { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw) }

    // ── Hover ──────────────────────────────────────────────────────────────
    function hoverOn(id: string) { clearTimeout(grace[id]); dispatch({ type: 'hoverOn', id }); schedule() }
    function hoverOff(id: string) { clearTimeout(grace[id]); grace[id] = setTimeout(() => { dispatch({ type: 'hoverExpire', id }); schedule() }, 250) }

    // ── Pin ────────────────────────────────────────────────────────────────
    function togglePin(id: string) {
        dispatch({ type: 'togglePin', id })
        if (state.pinId === id) {
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
        reg(a, 'focus', (() => { if (a.matches(':focus-visible')) { dispatch({ type: 'focus', id }); schedule() } }) as EventListener)
        reg(a, 'blur', (() => { dispatch({ type: 'blur', id }); schedule() }) as EventListener)
        // Pointer tap → pin and prevent link navigation; keyboard → normal link
        reg(a, 'click', (e => {
            if ((e as MouseEvent).detail === 0 || performance.now() - pointerOnA > 1000) return
            e.preventDefault(); togglePin(id)
        }) as EventListener)
        cs.forEach(c => reg(c, 'click', (() => togglePin(id)) as EventListener))
    }

    ;(['code', 'text'] as const).forEach(kind => {
        const p = kind === 'code' ? peekCode : peekText
        reg(p, 'pointerenter', (e => {
            const id = shown[kind]; if ((e as PointerEvent).pointerType !== 'mouse' || !id) return
            clearTimeout(grace[id]); dispatch({ type: 'peekEnter', id }); schedule()
        }) as EventListener)
        reg(p, 'pointerleave', (e => {
            const id = shown[kind]; if ((e as PointerEvent).pointerType !== 'mouse' || !id) return
            dispatch({ type: 'peekLeave', id }); schedule()
        }) as EventListener)
        reg(p, 'click', (() => { const id = shown[kind]; if (id) jump(kind, id) }) as EventListener)
    })

    reg(chip, 'click', (() => {
        const ret = state.ret
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
        dispatch({ type: 'outsideClick' })
        document.documentElement.removeAttribute('data-scholion-pin')
        schedule()
    }) as EventListener)

    reg(document, 'keydown', (e => {
        if ((e as KeyboardEvent).key !== 'Escape') return
        if (state.pinId !== null || state.ret) {
            dispatch({ type: 'escape' })
            document.documentElement.removeAttribute('data-scholion-pin')
            chip.classList.remove('scholion-chip--on'); schedule()
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
