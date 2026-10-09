import { describe, expect, it } from 'vitest'
import { computeWire, inView, ptA, ptC, ptPeek, wantPeek, wirePath, type Rect } from '../src/scholion/runtime/layout'

const rect = (left: number, top: number, width: number, height: number): Rect => ({
    left, top, width, height, right: left + width, bottom: top + height,
})

const VH = 800

describe('inView', () => {
    it('handles null and edges', () => {
        expect(inView(null, VH)).toBe(false)
        expect(inView(rect(0, 100, 10, 10), VH)).toBe(true)
        expect(inView(rect(0, -10, 10, 10), VH)).toBe(false) // bottom === 0
        expect(inView(rect(0, VH, 10, 10), VH)).toBe(false) // top === vh
        expect(inView(rect(0, -5, 10, 10), VH)).toBe(true)
    })
})

describe('wantPeek', () => {
    const visible = rect(0, 100, 20, 20)
    const above = rect(0, -200, 20, 20)
    const below = rect(0, 1000, 20, 20)

    it('both in view -> null', () => {
        expect(wantPeek({ a: visible, c: rect(0, 300, 20, 20), vh: VH })).toBeNull()
    })

    it('neither in view -> null', () => {
        expect(wantPeek({ a: above, c: below, vh: VH })).toBeNull()
    })

    it('no text target -> null', () => {
        expect(wantPeek({ a: visible, c: null, vh: VH })).toBeNull()
        expect(wantPeek({ a: above, c: null, vh: VH })).toBeNull()
    })

    it('code peek when only the text is visible, positioned by where the code went', () => {
        expect(wantPeek({ a: above, c: visible, vh: VH })).toEqual({ kind: 'code', pos: 'top' })
        expect(wantPeek({ a: below, c: visible, vh: VH })).toEqual({ kind: 'code', pos: 'bottom' })
    })

    it('text peek when only the code is visible, positioned by where the text went', () => {
        expect(wantPeek({ a: visible, c: above, vh: VH })).toEqual({ kind: 'text', pos: 'top' })
        expect(wantPeek({ a: visible, c: below, vh: VH })).toEqual({ kind: 'text', pos: 'bottom' })
    })

    it('bottom <= 0 edge counts as top, bottom === 1 as bottom (still hidden check by inView)', () => {
        expect(wantPeek({ a: rect(0, -20, 20, 20), c: visible, vh: VH })).toEqual({ kind: 'code', pos: 'top' })
        expect(wantPeek({ a: visible, c: rect(0, -20, 20, 20), vh: VH })).toEqual({ kind: 'text', pos: 'top' })
        expect(wantPeek({ a: visible, c: rect(0, VH, 20, 20), vh: VH })).toEqual({ kind: 'text', pos: 'bottom' })
    })
})

describe('ptC', () => {
    const c = rect(100, 200, 40, 20)
    it('anchors at the horizontal center, edge facing the target', () => {
        expect(ptC(c, 500)).toEqual({ x: 120, y: 221 })
        expect(ptC(c, 0)).toEqual({ x: 120, y: 199 })
    })
})

describe('ptA', () => {
    const a = rect(100, 200, 40, 20)

    it('without pre: edge facing the target', () => {
        expect(ptA(null, a, 500)).toEqual({ x: 120, y: 221, clipped: false })
        expect(ptA(null, a, 0)).toEqual({ x: 120, y: 199, clipped: false })
    })

    it('inside pre: not clipped', () => {
        expect(ptA(rect(0, 150, 400, 200), a, 500)).toEqual({ x: 120, y: 221, clipped: false })
    })

    it('scrolled out of pre on the left: clamped and attached to the pre edge', () => {
        const pre = rect(130, 150, 400, 200)
        expect(ptA(pre, a, 500)).toEqual({ x: 140, y: 344, clipped: true })
        expect(ptA(pre, a, 0)).toEqual({ x: 140, y: 156, clipped: true })
    })

    it('scrolled out of pre on the right', () => {
        const pre = rect(0, 150, 100, 200)
        expect(ptA(pre, a, 500)).toEqual({ x: 90, y: 344, clipped: true })
    })
})

describe('ptPeek', () => {
    const peek = rect(100, 600, 300, 80)

    it('top/bottom pick the edge facing the content', () => {
        const token = rect(200, 620, 20, 20)
        expect(ptPeek({ peek, token, pos: 'bottom' })).toEqual({ x: 210, y: 600 })
        expect(ptPeek({ peek, token, pos: 'top' })).toEqual({ x: 210, y: 680 })
    })

    it('clamps x to the peek bounds (16px inset)', () => {
        expect(ptPeek({ peek, token: rect(0, 620, 10, 20), pos: 'top' }).x).toBe(116)
        expect(ptPeek({ peek, token: rect(900, 620, 10, 20), pos: 'top' }).x).toBe(384)
    })

    it('falls back to the peek rect without a token', () => {
        expect(ptPeek({ peek, token: null, pos: 'top' })).toEqual({ x: 250, y: 680 })
    })
})

describe('computeWire', () => {
    const a = rect(100, 100, 40, 20)
    const c = rect(100, 400, 40, 20)
    const pre = rect(0, 80, 400, 100)

    it('both in view: solid wire from text to code', () => {
        const w = computeWire({ a, c, preRect: pre, want: null, peek: null, vh: VH })
        expect(w).toEqual({
            P: { x: 120, y: 399 },
            Q: { x: 120, y: 121, clipped: false },
            dashed: false,
        })
    })

    it('code clipped by pre: dashed, anchored at the pre edge', () => {
        const clippedPre = rect(130, 80, 400, 100)
        const w = computeWire({ a, c, preRect: clippedPre, want: null, peek: null, vh: VH })
        expect(w?.dashed).toBe(true)
        expect(w?.Q).toEqual({ x: 140, y: 174, clipped: true })
        expect(w?.P.y).toBe(399)
    })

    it('not drawable when one end is out of view and no peek is wanted', () => {
        expect(computeWire({ a, c: rect(100, 2000, 40, 20), preRect: pre, want: null, peek: null, vh: VH })).toBeNull()
        expect(computeWire({ a, c: null, preRect: pre, want: null, peek: null, vh: VH })).toBeNull()
    })

    it('code peek: text point to the peek, dashed', () => {
        const peek = { rect: rect(100, 20, 300, 80), token: rect(200, 40, 20, 20) }
        const w = computeWire({ a: rect(100, -300, 40, 20), c, preRect: pre, want: { kind: 'code', pos: 'top' }, peek, vh: VH })
        expect(w).toEqual({ P: { x: 120, y: 399 }, Q: { x: 210, y: 100 }, dashed: true })
    })

    it('text peek at the bottom: code point to the peek top edge, dashed', () => {
        const peek = { rect: rect(100, 700, 300, 80), token: rect(200, 720, 20, 20) }
        const w = computeWire({ a, c: rect(100, 2000, 40, 20), preRect: null, want: { kind: 'text', pos: 'bottom' }, peek, vh: VH })
        expect(w).toEqual({ P: { x: 120, y: 121, clipped: false }, Q: { x: 210, y: 700 }, dashed: true })
    })
})

describe('wirePath', () => {
    it('uses half the vertical distance as control offset, at least 18', () => {
        expect(wirePath({ x: 0, y: 0 }, { x: 10, y: 100 })).toBe('M0,0 C0,50 10,50 10,100')
        expect(wirePath({ x: 0, y: 0 }, { x: 10, y: 10 })).toBe('M0,0 C0,18 10,-8 10,10')
    })

    it('flips direction upwards and for a zero distance', () => {
        expect(wirePath({ x: 0, y: 100 }, { x: 10, y: 0 })).toBe('M0,100 C0,50 10,50 10,0')
        expect(wirePath({ x: 0, y: 5 }, { x: 10, y: 5 })).toBe('M0,5 C0,23 10,-13 10,5')
    })
})
