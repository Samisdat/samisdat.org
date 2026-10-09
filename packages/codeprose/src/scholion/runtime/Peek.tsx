import { useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useScholion } from './context'
import { useDockNode } from './dockNode'
import type { PeekKind, PeekPos } from './layout'

type PeekProps = {
    kind: PeekKind
    id: string
    pos: PeekPos
    /** Visible; a hidden peek stays mounted so it can fade out */
    on: boolean
}

export function Peek({ kind, id, pos, on }: PeekProps) {
    const node = useDockNode(pos)
    return node ? createPortal(<PeekView kind={kind} id={id} pos={pos} on={on} />, node) : null
}

function PeekView({ kind, id, pos, on }: PeekProps) {
    const { registry, jump, peekEnter, peekLeave } = useScholion()
    const entry = registry.refs[id]
    const lineRef = useRef<HTMLSpanElement>(null)

    // Center the token in the (horizontally clipped) code line
    useLayoutEffect(() => {
        const line = lineRef.current
        const token = line?.querySelector<HTMLElement>('.scholion-peek__token')
        if (on && line && token) line.scrollLeft = token.offsetLeft - line.clientWidth / 2 + token.offsetWidth / 2
    }, [on, id, pos])

    if (!entry) return null

    const cls = [
        'scholion-peek',
        `scholion-peek--${kind}`,
        on && 'scholion-peek--on',
    ].filter(Boolean).join(' ')

    const handlers = {
        onPointerEnter: (e: React.PointerEvent) => {
            if (e.pointerType === 'mouse') peekEnter(id)
        },
        onPointerLeave: (e: React.PointerEvent) => {
            if (e.pointerType === 'mouse') peekLeave(id)
        },
        onClick: () => jump(kind, id),
    }

    if (kind === 'code') {
        return (
            <button type="button" className={cls} aria-label="Zur Codezeile springen" {...handlers}>
                <span className="scholion-peek__meta" aria-hidden="true">
                    <span className="scholion-peek__line">{entry.lineNum ? `Zeile ${entry.lineNum}` : 'im Code'}</span>
                    <span>Antippen springt hin</span>
                </span>
                <span
                    ref={lineRef}
                    className="scholion-peek__code-line"
                    aria-hidden="true"
                    dangerouslySetInnerHTML={{ __html: entry.codeHtml }}
                />
            </button>
        )
    }

    return (
        <button type="button" className={cls} aria-label="Zur Erklärung springen" {...handlers}>
            <span className="scholion-peek__meta" aria-hidden="true">
                <span>Erklärung im Text</span>
                <span>Antippen springt hin</span>
            </span>
            <span className="scholion-peek__body" aria-hidden="true" dangerouslySetInnerHTML={{ __html: entry.textHtml }} />
        </button>
    )
}
