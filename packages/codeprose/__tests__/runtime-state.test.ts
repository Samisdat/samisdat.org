import { describe, expect, it } from 'vitest'
import { createState, isActive, reduce } from '../src/scholion/runtime/state'

const fresh = () => createState(['x', 'y'])

describe('createState / isActive', () => {
    it('starts inactive', () => {
        const s = fresh()
        expect(s.pinId).toBeNull()
        expect(s.lastId).toBeNull()
        expect(s.ret).toBeNull()
        expect(isActive(s, 'x')).toBe(false)
        expect(isActive(s, 'unknown')).toBe(false)
    })

    it.each(['hoverOn', 'focus', 'peekEnter', 'togglePin'] as const)('is active after %s', type => {
        expect(isActive(reduce(fresh(), { type, id: 'x' }), 'x')).toBe(true)
        expect(isActive(reduce(fresh(), { type, id: 'x' }), 'y')).toBe(false)
    })
})

describe('reduce', () => {
    it('does not mutate the previous state', () => {
        const s = fresh()
        const next = reduce(s, { type: 'hoverOn', id: 'x' })
        expect(next).not.toBe(s)
        expect(s.flags.x.hover).toBe(false)
        expect(s.lastId).toBeNull()
    })

    it('hoverOn sets hover and lastId, hoverExpire clears hover but keeps lastId', () => {
        let s = reduce(fresh(), { type: 'hoverOn', id: 'x' })
        expect(s.flags.x.hover).toBe(true)
        expect(s.lastId).toBe('x')
        s = reduce(s, { type: 'hoverExpire', id: 'x' })
        expect(s.flags.x.hover).toBe(false)
        expect(s.lastId).toBe('x')
        expect(isActive(s, 'x')).toBe(false)
    })

    it('focus sets lastId, blur clears focus', () => {
        let s = reduce(fresh(), { type: 'focus', id: 'y' })
        expect(s.flags.y.focus).toBe(true)
        expect(s.lastId).toBe('y')
        s = reduce(s, { type: 'blur', id: 'y' })
        expect(s.flags.y.focus).toBe(false)
    })

    it('peekEnter / peekLeave toggle the peek flag without touching lastId', () => {
        let s = reduce(fresh(), { type: 'peekEnter', id: 'x' })
        expect(s.flags.x.peek).toBe(true)
        expect(s.lastId).toBeNull()
        s = reduce(s, { type: 'peekLeave', id: 'x' })
        expect(s.flags.x.peek).toBe(false)
    })

    it('keeps a ref active while any flag remains', () => {
        let s = reduce(fresh(), { type: 'hoverOn', id: 'x' })
        s = reduce(s, { type: 'focus', id: 'x' })
        s = reduce(s, { type: 'hoverExpire', id: 'x' })
        expect(isActive(s, 'x')).toBe(true)
    })

    describe('pin', () => {
        it('is exclusive', () => {
            let s = reduce(fresh(), { type: 'togglePin', id: 'x' })
            expect(s.pinId).toBe('x')
            s = reduce(s, { type: 'togglePin', id: 'y' })
            expect(s.pinId).toBe('y')
            expect(isActive(s, 'x')).toBe(false)
            expect(isActive(s, 'y')).toBe(true)
        })

        it('toggles off on the same id and still sets lastId', () => {
            let s = reduce(fresh(), { type: 'togglePin', id: 'x' })
            s = reduce(s, { type: 'togglePin', id: 'x' })
            expect(s.pinId).toBeNull()
            expect(s.lastId).toBe('x')
        })

        it('clearPin and outsideClick clear the pin but keep ret', () => {
            let s = reduce(fresh(), { type: 'jump', kind: 'code', id: 'x' })
            s = reduce(s, { type: 'togglePin', id: 'x' })
            expect(reduce(s, { type: 'clearPin' }).pinId).toBeNull()
            const after = reduce(s, { type: 'outsideClick' })
            expect(after.pinId).toBeNull()
            expect(after.ret).toEqual(s.ret)
        })

        it('escape clears pin and ret', () => {
            let s = reduce(fresh(), { type: 'jump', kind: 'text', id: 'x' })
            s = reduce(s, { type: 'togglePin', id: 'y' })
            s = reduce(s, { type: 'escape' })
            expect(s.pinId).toBeNull()
            expect(s.ret).toBeNull()
        })
    })

    describe('jump / ret', () => {
        it('code jump returns to c, text jump returns to a, and clears peek', () => {
            let s = reduce(fresh(), { type: 'peekEnter', id: 'x' })
            s = reduce(s, { type: 'jump', kind: 'code', id: 'x' })
            expect(s.ret).toEqual({ id: 'x', to: 'c', left: false })
            expect(s.flags.x.peek).toBe(false)

            s = reduce(s, { type: 'jump', kind: 'text', id: 'y' })
            expect(s.ret).toEqual({ id: 'y', to: 'a', left: false })
        })

        it('retLeft marks the return target as left; no-op without ret', () => {
            const empty = fresh()
            expect(reduce(empty, { type: 'retLeft' })).toBe(empty)
            const s = reduce(reduce(empty, { type: 'jump', kind: 'code', id: 'x' }), { type: 'retLeft' })
            expect(s.ret).toEqual({ id: 'x', to: 'c', left: true })
        })

        it('retArrived and chipBack clear ret', () => {
            const s = reduce(fresh(), { type: 'jump', kind: 'code', id: 'x' })
            expect(reduce(s, { type: 'retArrived' }).ret).toBeNull()
            expect(reduce(s, { type: 'chipBack' }).ret).toBeNull()
        })
    })
})

describe('hover and peek are independent flags', () => {
    it('a replayed hoverExpire while the peek is entered keeps the peek alive, leaving it ends activity', () => {
        let s = reduce(fresh(), { type: 'hoverOn', id: 'x' })
        s = reduce(s, { type: 'peekEnter', id: 'x' })
        s = reduce(s, { type: 'hoverExpire', id: 'x' })
        expect(s.flags.x).toEqual({ hover: false, focus: false, peek: true })
        expect(isActive(s, 'x')).toBe(true)
        s = reduce(s, { type: 'peekLeave', id: 'x' })
        expect(isActive(s, 'x')).toBe(false)
    })

    it('does not stay active after a jump once the hover has expired', () => {
        let s = reduce(fresh(), { type: 'hoverOn', id: 'x' })
        s = reduce(s, { type: 'peekEnter', id: 'x' })
        s = reduce(s, { type: 'hoverExpire', id: 'x' })
        s = reduce(s, { type: 'jump', kind: 'code', id: 'x' })
        expect(s.flags.x.peek).toBe(false)
        expect(isActive(s, 'x')).toBe(false)
    })

    it('retLeft is idempotent (same state instance)', () => {
        let s = reduce(fresh(), { type: 'jump', kind: 'text', id: 'x' })
        s = reduce(s, { type: 'retLeft' })
        expect(reduce(s, { type: 'retLeft' })).toBe(s)
    })
})
