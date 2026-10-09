import { createContext, useContext } from 'react'
import type { Docks } from './dockNode'
import type { Layout } from './useScholionLayout'
import type { Registry } from './scan'
import type { ScholionState } from './state'

export type ScholionContextValue = {
    registry: Registry
    /** Current token color per ref id, follows theme changes */
    colors: Record<string, string>
    state: ScholionState
    layout: Layout
    docks: Docks
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
