import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useScholion } from './context'

export function Chip() {
    const { state, goBack, docks } = useScholion()
    // Keep the label while the chip fades out
    const [label, setLabel] = useState('Zurück')
    const next = state.ret ? (state.ret.to === 'c' ? 'Zurück zum Text' : 'Zurück zum Code') : null
    if (next && next !== label) setLabel(next)

    if (!docks.bottom) return null

    return createPortal(
        <button
            type="button"
            className={state.ret ? 'scholion-chip scholion-chip--on' : 'scholion-chip'}
            aria-label="Zurück"
            onClick={goBack}
        >
            {label}
        </button>,
        docks.bottom,
    )
}
