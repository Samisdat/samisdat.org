import { useScholion } from './context'
import type { PeekPos } from './layout'

/** Mount nodes of the host's layout docks (null until they are mounted). */
export type Docks = { top: HTMLElement | null; bottom: HTMLElement | null }

/** Mount node for a peek at the given position: the top or bottom dock of the host. */
export function useDockNode(pos: PeekPos): HTMLElement | null {
    return useScholion().docks[pos]
}
