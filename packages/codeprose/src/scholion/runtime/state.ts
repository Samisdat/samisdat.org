export type RefFlags = { hover: boolean; focus: boolean; peek: boolean }

export type ScholionState = {
    flags: Record<string, RefFlags>
    pinId: string | null
    lastId: string | null
    ret: { id: string; to: 'a' | 'c'; left: boolean } | null
}

export type ScholionEvent =
    | { type: 'hoverOn'; id: string }
    | { type: 'hoverExpire'; id: string }
    | { type: 'focus'; id: string }
    | { type: 'blur'; id: string }
    | { type: 'peekEnter'; id: string }
    | { type: 'peekLeave'; id: string }
    | { type: 'togglePin'; id: string }
    | { type: 'clearPin' }
    | { type: 'jump'; kind: 'code' | 'text'; id: string }
    | { type: 'chipBack' }
    | { type: 'retLeft' }
    | { type: 'retArrived' }
    | { type: 'escape' }
    | { type: 'outsideClick' }

const emptyFlags = (): RefFlags => ({ hover: false, focus: false, peek: false })

export function createState(ids: string[]): ScholionState {
    return {
        flags: Object.fromEntries(ids.map(id => [id, emptyFlags()])),
        pinId: null,
        lastId: null,
        ret: null,
    }
}

export function isActive(state: ScholionState, id: string): boolean {
    const f = state.flags[id]
    return !!f && (f.hover || f.focus || f.peek || state.pinId === id)
}

function withFlags(state: ScholionState, id: string, patch: Partial<RefFlags>): ScholionState {
    return { ...state, flags: { ...state.flags, [id]: { ...(state.flags[id] ?? emptyFlags()), ...patch } } }
}

export function reduce(state: ScholionState, event: ScholionEvent): ScholionState {
    switch (event.type) {
        case 'hoverOn':
            return { ...withFlags(state, event.id, { hover: true }), lastId: event.id }
        case 'hoverExpire':
            return withFlags(state, event.id, { hover: false })
        case 'focus':
            return { ...withFlags(state, event.id, { focus: true }), lastId: event.id }
        case 'blur':
            return withFlags(state, event.id, { focus: false })
        case 'peekEnter':
            return withFlags(state, event.id, { peek: true })
        case 'peekLeave':
            return withFlags(state, event.id, { peek: false })
        case 'togglePin':
            // A click always makes the ref the "last" one, then pin is exclusive.
            return { ...state, lastId: event.id, pinId: state.pinId === event.id ? null : event.id }
        case 'clearPin':
        case 'outsideClick':
            return { ...state, pinId: null }
        case 'jump':
            return {
                ...withFlags(state, event.id, { peek: false }),
                ret: { id: event.id, to: event.kind === 'code' ? 'c' : 'a', left: false },
            }
        case 'chipBack':
        case 'retArrived':
            return { ...state, ret: null }
        case 'retLeft':
            return state.ret && !state.ret.left ? { ...state, ret: { ...state.ret, left: true } } : state
        case 'escape':
            return { ...state, pinId: null, ret: null }
    }
}
