import { createContext, useContext } from 'react'
import type { Layout } from './useScholionLayout'
import type { Registry } from './scan'
import type { ScholionState } from './state'

export type ScholionContextValue = {
    registry: Registry
    state: ScholionState
    layout: Layout
    jump: (kind: 'code' | 'text', id: string) => void
    goBack: () => void
    peekEnter: (id: string) => void
    peekLeave: (id: string) => void
}

export const ScholionContext = createContext<ScholionContextValue | null>(null)

export function useScholion(): ScholionContextValue {
    const value = useContext(ScholionContext)
    if (!value) throw new Error('useScholion must be used inside <ScholionProvider>')
    return value
}
