import { useCallback, useEffect, useLayoutEffect, useRef, useState, type Dispatch } from 'react'
import { computeWire, inView, wantPeek, type Want, type Wire } from './layout'
import type { Registry } from './scan'
import { isActive, type ScholionEvent, type ScholionState } from './state'

export type Layout = {
    /** Ref the peek / wires currently belong to */
    pr: string | null
    want: Want | null
    /** Drawable wires of active refs, by id */
    wires: Record<string, Wire>
}

export const emptyLayout: Layout = { pr: null, want: null, wires: {} }

const samePoint = (a: { x: number; y: number }, b: { x: number; y: number }) => a.x === b.x && a.y === b.y

export function sameLayout(a: Layout, b: Layout): boolean {
    if (a === b) return true
    if (a.pr !== b.pr || a.want?.kind !== b.want?.kind || a.want?.pos !== b.want?.pos) return false
    const ka = Object.keys(a.wires)
    if (ka.length !== Object.keys(b.wires).length) return false
    return ka.every(id => {
        const wa = a.wires[id]
        const wb = b.wires[id]
        return !!wb && wa.dashed === wb.dashed && samePoint(wa.P, wb.P) && samePoint(wa.Q, wb.Q)
    })
}

const viewportHeight = () => window.visualViewport?.height ?? innerHeight

/** Measures geometry (rAF-scheduled) and derives which peek and wires to show. */
export function useScholionLayout(registry: Registry, state: ScholionState, dispatch: Dispatch<ScholionEvent>): Layout {
    const [layout, setLayout] = useState<Layout>(emptyLayout)
    const live = useRef({ registry, state, dispatch })
    const raf = useRef(0)

    useLayoutEffect(() => {
        live.current = { registry, state, dispatch }
    })

    const measure = useCallback(() => {
        const { registry, state, dispatch } = live.current
        const { ids, refs } = registry
        const vh = viewportHeight()

        const geo: Record<string, { a: DOMRect; c: DOMRect | null }> = {}
        for (const id of ids) {
            geo[id] = { a: refs[id].a.getBoundingClientRect(), c: (refs[id].cs[0]?.getClientRects()[0] as DOMRect | undefined) ?? null }
        }

        const pr = state.lastId && isActive(state, state.lastId) && geo[state.lastId] ? state.lastId : null
        const want = pr ? wantPeek({ a: geo[pr].a, c: geo[pr].c, vh }) : null

        // The peek is rendered by now (see the layout effect below), measure it for the wire end
        let peekGeo: { rect: DOMRect; token: DOMRect | null } | null = null
        if (want) {
            const el = document.querySelector<HTMLElement>(`.scholion-peek--${want.kind}`)
            if (el) {
                peekGeo = {
                    rect: el.getBoundingClientRect(),
                    token: el.querySelector<HTMLElement>('.scholion-peek__token')?.getBoundingClientRect() ?? null,
                }
            }
        }

        const wires: Record<string, Wire> = {}
        for (const id of ids) {
            if (!isActive(state, id)) continue
            const { a, c } = geo[id]
            const wire = computeWire({
                a,
                c,
                preRect: refs[id].pre?.getBoundingClientRect() ?? null,
                want: pr === id ? want : null,
                peek: peekGeo,
                vh,
            })
            if (wire) wires[id] = wire
        }

        const next: Layout = { pr, want, wires }
        setLayout(prev => (sameLayout(prev, next) ? prev : next))

        // Auto-hide the chip when the return target scrolls back into view
        const ret = state.ret
        if (ret && geo[ret.id]) {
            const vis = inView(ret.to === 'c' ? geo[ret.id].c : geo[ret.id].a, vh)
            if (!vis) {
                if (!ret.left) dispatch({ type: 'retLeft' })
            } else if (ret.left) {
                dispatch({ type: 'retArrived' })
            }
        }
    }, [])

    const schedule = useCallback(() => {
        cancelAnimationFrame(raf.current)
        raf.current = requestAnimationFrame(measure)
    }, [measure])

    useEffect(() => {
        const cleanups: (() => void)[] = []
        const on = (el: EventTarget, type: string, opts?: AddEventListenerOptions) => {
            el.addEventListener(type, schedule, opts)
            cleanups.push(() => el.removeEventListener(type, schedule, opts))
        }

        on(window, 'scroll', { passive: true })
        on(window, 'resize')
        if (window.visualViewport) {
            on(window.visualViewport, 'resize')
            on(window.visualViewport, 'scroll')
        }
        new Set(registry.ids.map(id => registry.refs[id].pre).filter(Boolean)).forEach(pre => on(pre!, 'scroll', { passive: true }))

        const ro = new ResizeObserver(schedule)
        ro.observe(document.body)
        cleanups.push(() => ro.disconnect())

        document.fonts?.ready.then(schedule)
        schedule()

        return () => {
            cleanups.forEach(fn => fn())
            cancelAnimationFrame(raf.current)
        }
    }, [registry, schedule])

    useEffect(schedule, [state, schedule])

    // The wire end sits on the peek, so measure again right after the peek (or the chip entering the same dock) is committed
    const wantKey = layout.want ? `${layout.want.kind}:${layout.want.pos}:${layout.pr}` : ''
    const chipOn = state.ret !== null
    useLayoutEffect(() => {
        if (wantKey) measure()
    }, [wantKey, chipOn, measure])

    return layout
}
