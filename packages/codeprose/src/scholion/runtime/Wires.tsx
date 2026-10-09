import { useState } from 'react'
import { createPortal } from 'react-dom'
import { wirePath, type Wire } from './layout'
import { useScholion } from './context'

export function Wires() {
    const { registry, layout } = useScholion()
    // Keep the last drawn geometry so a wire can fade out in place
    const [last, setLast] = useState<Record<string, Wire>>({})
    if (Object.keys(layout.wires).some(id => layout.wires[id] !== last[id])) setLast({ ...last, ...layout.wires })

    return createPortal(
        <svg className="scholion-wires" aria-hidden="true">
            {registry.ids.map(id => {
                const current = layout.wires[id]
                const wire = current ?? last[id]
                const cls = ['scholion-g', current && 'scholion-g--on', wire?.dashed && 'scholion-g--dashed'].filter(Boolean).join(' ')
                return (
                    <g key={id} className={cls} style={{ color: registry.refs[id].color }}>
                        {wire && (
                            <>
                                <path d={wirePath(wire.P, wire.Q)} />
                                <circle r="3.2" cx={wire.P.x} cy={wire.P.y} />
                                <circle r="3.2" cx={wire.Q.x} cy={wire.Q.y} />
                            </>
                        )}
                    </g>
                )
            })}
        </svg>,
        document.body,
    )
}
