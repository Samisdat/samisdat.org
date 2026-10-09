import { useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState, type ReactNode } from 'react'
import { ScholionContext, type ScholionContextValue } from './context'
import { Chip } from './Chip'
import { disposeDockNodes } from './dockNode'
import type { PeekKind, PeekPos, Want } from './layout'
import { Peek } from './Peek'
import { scanRefs, type Registry } from './scan'
import { createState, reduce, type ScholionState } from './state'
import { useScholionLayout } from './useScholionLayout'
import { Wires } from './Wires'

const GRACE_MS = 250

type ScholionProviderProps = {
    children: ReactNode
    /**
     * Changes whenever the scanned content changes (e.g. the post slug). The provider scans the whole
     * document once after mount and again whenever this key changes. A MutationObserver was left out
     * on purpose: the content is server-rendered and only swaps on navigation.
     */
    contentKey?: string
}

/**
 * Wires up the scholion runtime for the server-rendered markup in `children` (or anywhere in the document):
 * hover/focus/tap state, peeks, wires and the return chip.
 */
export function ScholionProvider({ children, contentKey }: ScholionProviderProps) {
    const [scan, setScan] = useState<{ n: number; registry: Registry } | null>(null)

    useEffect(() => {
        // The scan needs the committed DOM, so setting state in the effect is intended here
        const registry = scanRefs(document)
        // oxlint-disable-next-line react-compiler/react-compiler
        setScan(prev => (registry.ids.length ? { n: (prev?.n ?? 0) + 1, registry } : null))
    }, [contentKey])

    return (
        <>
            {children}
            {scan && (
                <ScholionRuntime
                    key={scan.n}
                    registry={scan.registry}
                />
            )}
        </>
    )
}

const smoothBehavior = (): ScrollBehavior => (matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth')
const viewportHeight = () => window.visualViewport?.height ?? innerHeight

type Shown = Record<PeekKind, { id: string; pos: PeekPos } | null> & { last: PeekKind | null }

const KINDS: PeekKind[] = ['code', 'text']

function isPeekOn(kind: PeekKind, shown: Shown, want: Want | null, pr: string | null, state: ScholionState): boolean {
    const s = shown[kind]
    if (want?.kind === kind) return true
    // A peek that is being hovered stays up even if the geometry no longer asks for it
    // (only the most recently wanted kind, so a stale peek of the other kind cannot linger)
    return shown.last === kind && !!s && !!state.flags[s.id]?.peek && pr === s.id
}

function ScholionRuntime({ registry }: { registry: Registry }) {
    const [state, dispatch] = useReducer(reduce, registry.ids, createState)
    const layout = useScholionLayout(registry, state, dispatch)
    const grace = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
    const live = useRef({ state, registry })

    useLayoutEffect(() => {
        live.current = { state, registry }
    })

    // ── Actions ────────────────────────────────────────────────────────────
    const jump = useCallback((kind: PeekKind, id: string) => {
        const { a, b, cs } = live.current.registry.refs[id]
        const behavior = smoothBehavior()
        dispatch({ type: 'jump', kind, id })
        if (kind === 'code') {
            a.focus({ preventScroll: true })
            a.scrollIntoView({ block: 'center', inline: 'center', behavior })
        } else {
            b.focus({ preventScroll: true })
            ;(cs[0] ?? b).scrollIntoView({ block: 'center', behavior })
        }
    }, [])

    const goBack = useCallback(() => {
        const { state, registry } = live.current
        const ret = state.ret
        if (!ret) return
        const { a, b, cs } = registry.refs[ret.id]
        const behavior = smoothBehavior()
        if (ret.to === 'c') {
            ;(cs[0] ?? b).scrollIntoView({ block: 'center', behavior })
            b.focus({ preventScroll: true })
        } else {
            a.scrollIntoView({ block: 'center', inline: 'center', behavior })
            a.focus({ preventScroll: true })
        }
        dispatch({ type: 'chipBack' })
    }, [])

    // Hover and peek are independent flags: entering the peek must not cancel a pending expiry,
    // otherwise the hover flag would stay set after the pointer left again.
    const peekEnter = useCallback((id: string) => dispatch({ type: 'peekEnter', id }), [])
    const peekLeave = useCallback((id: string) => dispatch({ type: 'peekLeave', id }), [])

    // ── Delegated document listeners ───────────────────────────────────────
    useEffect(() => {
        const refs = registry.refs
        let pointerOnA = 0

        const refId = (el: Element | null, selector: string): string | null => {
            const hit = el?.closest<HTMLElement>(selector)
            const id = hit?.dataset.ref
            return hit && id && refs[id] ? id : null
        }
        const hoverSelector = 'a.ref[data-ref], .ref-target[data-ref]'

        const hoverOn = (id: string) => {
            clearTimeout(grace.current[id])
            dispatch({ type: 'hoverOn', id })
        }
        const hoverOff = (id: string) => {
            clearTimeout(grace.current[id])
            grace.current[id] = setTimeout(() => dispatch({ type: 'hoverExpire', id }), GRACE_MS)
        }

        const togglePin = (id: string) => {
            const pinning = live.current.state.pinId !== id
            dispatch({ type: 'togglePin', id })
            if (!pinning) return
            const p = refs[id].pre
            if (!p) return
            const a = refs[id].a.getBoundingClientRect()
            if (a.bottom > 0 && a.top < viewportHeight()) {
                const v = p.getBoundingClientRect()
                if (a.left < v.left || a.right > v.right) {
                    p.scrollBy({ left: a.left - v.left - v.width / 2 + a.width / 2, behavior: smoothBehavior() })
                }
            }
        }

        const onPointerOver = (e: PointerEvent) => {
            if (e.pointerType !== 'mouse') return
            const el = (e.target as Element).closest(hoverSelector)
            const id = refId(el, hoverSelector)
            if (id && !el!.contains(e.relatedTarget as Node | null)) hoverOn(id)
        }
        const onPointerOut = (e: PointerEvent) => {
            if (e.pointerType !== 'mouse') return
            const el = (e.target as Element).closest(hoverSelector)
            const id = refId(el, hoverSelector)
            if (id && !el!.contains(e.relatedTarget as Node | null)) hoverOff(id)
        }
        const onPointerDown = (e: PointerEvent) => {
            if (refId(e.target as Element, 'a.ref[data-ref]')) pointerOnA = performance.now()
        }
        const onFocusIn = (e: FocusEvent) => {
            const el = e.target as Element
            const id = refId(el, 'a.ref[data-ref]')
            if (id && el.matches(':focus-visible')) dispatch({ type: 'focus', id })
        }
        const onFocusOut = (e: FocusEvent) => {
            const id = refId(e.target as Element, 'a.ref[data-ref]')
            if (id) dispatch({ type: 'blur', id })
        }
        const onClick = (e: MouseEvent) => {
            const target = e.target as Element
            const aId = refId(target, 'a.ref[data-ref]')
            if (aId) {
                // Pointer tap: pin and prevent link navigation. Keyboard: normal link.
                if (e.detail === 0 || performance.now() - pointerOnA > 1000) return
                e.preventDefault()
                togglePin(aId)
                return
            }
            const cId = refId(target, '.ref-target[data-ref]')
            if (cId) {
                togglePin(cId)
                return
            }
            if (e.defaultPrevented || target.closest('.scholion-peek, .scholion-chip')) return
            dispatch({ type: 'outsideClick' })
        }
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key !== 'Escape') return
            const { state } = live.current
            if (state.pinId !== null || state.ret) dispatch({ type: 'escape' })
        }

        document.addEventListener('pointerover', onPointerOver)
        document.addEventListener('pointerout', onPointerOut)
        document.addEventListener('pointerdown', onPointerDown)
        document.addEventListener('focusin', onFocusIn)
        document.addEventListener('focusout', onFocusOut)
        document.addEventListener('click', onClick)
        document.addEventListener('keydown', onKeyDown)
        const timers = grace.current
        return () => {
            document.removeEventListener('pointerover', onPointerOver)
            document.removeEventListener('pointerout', onPointerOut)
            document.removeEventListener('pointerdown', onPointerDown)
            document.removeEventListener('focusin', onFocusIn)
            document.removeEventListener('focusout', onFocusOut)
            document.removeEventListener('click', onClick)
            document.removeEventListener('keydown', onKeyDown)
            Object.values(timers).forEach(clearTimeout)
        }
    }, [registry])

    // ── Mirrors into the document (the injected per-ref CSS reads these) ───
    useEffect(() => {
        const root = document.documentElement
        if (state.pinId) root.setAttribute('data-scholion-pin', state.pinId)
        else root.removeAttribute('data-scholion-pin')
    }, [state.pinId])

    useEffect(() => () => document.documentElement.removeAttribute('data-scholion-pin'), [])

    useEffect(() => {
        const root = document.documentElement
        for (const id of registry.ids) root.style.setProperty(`--scholion-color-${id}`, registry.refs[id].color)
        return () => {
            for (const id of registry.ids) root.style.removeProperty(`--scholion-color-${id}`)
        }
    }, [registry])

    useEffect(() => disposeDockNodes, [])

    // ── Peeks: keep the last shown one mounted so it can fade out ──────────
    const [shown, setShown] = useState<Shown>({ code: null, text: null, last: null })
    const { want, pr } = layout
    if (want && pr) {
        const cur = shown[want.kind]
        if (!cur || cur.id !== pr || cur.pos !== want.pos || shown.last !== want.kind) {
            setShown({ ...shown, [want.kind]: { id: pr, pos: want.pos }, last: want.kind })
        }
    }

    const on = (kind: PeekKind) => isPeekOn(kind, shown, want, pr, state)

    // Hiding a peek ends the peek flag
    useEffect(() => {
        // The flag is per ref, so it only ends when no visible peek belongs to that ref
        const visibleIds = KINDS.filter(kind => isPeekOn(kind, shown, want, pr, state)).map(kind => shown[kind]?.id)
        for (const kind of KINDS) {
            const s = shown[kind]
            if (s && !visibleIds.includes(s.id) && state.flags[s.id]?.peek) dispatch({ type: 'peekLeave', id: s.id })
        }
    }, [shown, want, pr, state])

    const value = useMemo<ScholionContextValue>(
        () => ({ registry, state, layout, jump, goBack, peekEnter, peekLeave }),
        [registry, state, layout, jump, goBack, peekEnter, peekLeave],
    )

    return (
        <ScholionContext.Provider value={value}>
            <Wires />
            {KINDS.map(kind => {
                const s = shown[kind]
                return s ? (
                    <Peek
                        key={kind}
                        kind={kind}
                        id={s.id}
                        pos={s.pos}
                        on={on(kind)}
                    />
                ) : null
            })}
            <Chip />
        </ScholionContext.Provider>
    )
}
