import { useState } from 'react';
import { createPortal } from 'react-dom';

import { useScholion } from './context';
import { wirePath, type Wire } from './layout';

function WireShape({ wire }: { wire: Wire }) {
    return (
        <>
            <path d={wirePath(wire.P, wire.Q)} />
            <circle
                r="3.2"
                cx={wire.P.x}
                cy={wire.P.y}
            />
            <circle
                r="3.2"
                cx={wire.Q.x}
                cy={wire.Q.y}
            />
        </>
    );
}

export function Wires() {
    const { registry, colors, layout } = useScholion();
    // Keep the last drawn geometry so a wire can fade out in place
    const [last, setLast] = useState<Record<string, Wire>>({});
    if (Object.keys(layout.wires).some(id => layout.wires[id] !== last[id])) setLast({ ...last, ...layout.wires });
    const [lastExtras, setLastExtras] = useState<Record<string, Wire[]>>({});
    if (Object.keys(layout.extras).some(id => layout.extras[id] !== lastExtras[id]))
        setLastExtras({ ...lastExtras, ...layout.extras });

    return createPortal(
        <svg
            className="scholion-wires"
            aria-hidden="true"
        >
            {registry.ids.map(id => {
                const current = layout.wires[id];
                const wire = current ?? last[id];
                const extras = layout.extras[id] ?? lastExtras[id] ?? [];
                const on = current ?? layout.extras[id];
                const cls = ['scholion-g', on && 'scholion-g--on', wire?.dashed && 'scholion-g--dashed']
                    .filter(Boolean)
                    .join(' ');
                return (
                    <g
                        key={id}
                        className={cls}
                        style={{ color: colors[id] }}
                    >
                        {[...(wire ? [wire] : []), ...extras].map(w => (
                            <WireShape
                                key={`${w.P.x},${w.P.y}-${w.Q.x},${w.Q.y}`}
                                wire={w}
                            />
                        ))}
                    </g>
                );
            })}
        </svg>,
        document.body
    );
}
