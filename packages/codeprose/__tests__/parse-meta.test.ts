import { describe, expect, it } from 'vitest'
import { parseScholionMeta } from '../src/scholion/parse-meta.ts'

describe('parseScholionMeta', () => {
    it('parses a single ref', () => {
        expect(parseScholionMeta('svg scholion:anim=<animateTransform')).toEqual([
            { id: 'anim', pattern: '<animateTransform', line: undefined, occurrence: undefined },
        ])
    })

    it('parses multiple refs', () => {
        const refs = parseScholionMeta(
            'svg scholion:anim=<animateTransform scholion:repeat=repeatCount@10'
        )
        expect(refs).toHaveLength(2)
        expect(refs[0]).toMatchObject({ id: 'anim', pattern: '<animateTransform' })
        expect(refs[1]).toMatchObject({ id: 'repeat', pattern: 'repeatCount', line: 10 })
    })

    it('parses @line hint', () => {
        const [ref] = parseScholionMeta('scholion:repeat=repeatCount@10')
        expect(ref.pattern).toBe('repeatCount')
        expect(ref.line).toBe(10)
        expect(ref.occurrence).toBeUndefined()
    })

    it('parses #occurrence hint', () => {
        const [ref] = parseScholionMeta('scholion:foo=bar#2')
        expect(ref.pattern).toBe('bar')
        expect(ref.occurrence).toBe(2)
        expect(ref.line).toBeUndefined()
    })

    it('returns empty array for no refs', () => {
        expect(parseScholionMeta('svg language-svg')).toEqual([])
    })
})
