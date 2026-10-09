import { useSyncExternalStore } from 'react'
import type { PeekPos } from './layout'

const hosts: Partial<Record<PeekPos, HTMLElement>> = {}

function getHost(pos: PeekPos): HTMLElement {
    let host = hosts[pos]
    if (!host || !host.isConnected) {
        host = document.createElement('div')
        host.setAttribute('data-scholion-dock', pos)
        // The peek itself is `position: fixed` (incl. --scholion-nav-offset and the --bottom
        // modifier), so the host only needs to stay out of the layout.
        host.style.display = 'contents'
        document.body.appendChild(host)
        hosts[pos] = host
    }
    return host
}

/** Removes the host elements again (provider unmount). */
export function disposeDockNodes() {
    for (const pos of ['top', 'bottom'] as const) {
        hosts[pos]?.remove()
        delete hosts[pos]
    }
}

const noopSubscribe = () => () => {}

/**
 * Mount node for a peek at the given position. Currently a self-created host in `document.body`;
 * this hook is the seam to swap for a real dock later.
 */
export function useDockNode(pos: PeekPos): HTMLElement | null {
    return useSyncExternalStore(noopSubscribe, () => getHost(pos), () => null)
}
