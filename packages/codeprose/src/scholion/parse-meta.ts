import type { ScholionRef } from './types.js'

const SCHOLION_RE = /scholion:(\w+)=(\S+)/g

export function parseScholionMeta(meta: string): ScholionRef[] {
    const refs: ScholionRef[] = []
    SCHOLION_RE.lastIndex = 0
    let m: RegExpExecArray | null
    while ((m = SCHOLION_RE.exec(meta)) !== null) {
        const id = m[1]
        const raw = m[2]
        const lineM = raw.match(/@(\d+)$/)
        const occM = raw.match(/#(\d+)$/)
        refs.push({
            id,
            pattern: raw.replace(/[@#]\d+$/, ''),
            line: lineM ? parseInt(lineM[1], 10) : undefined,
            occurrence: occM ? parseInt(occM[1], 10) : undefined,
        })
    }
    return refs
}
