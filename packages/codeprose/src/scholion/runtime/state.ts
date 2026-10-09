export type RefFlags = { hover: boolean; focus: boolean; peek: boolean }

export type ScholionState = {
    flags: Record<string, RefFlags>
    lastId: string | null
    /** The ref activated by a tap on a touch device; stays active until cleared */
    touchId: string | null
    ret: { id: string; to: 'a' | 'c'; left: boolean } | null
}

export type ScholionEvent =
    | { type: 'hoverOn'; id: string }
    | { type: 'hoverExpire'; id: string }
    | { type: 'focus'; id: string }
    | { type: 'blur'; id: string }
    | { type: 'peekEnter'; id: string }
    | { type: 'peekLeave'; id: string }
    | { type: 'jump'; kind: 'code' | 'text'; id: string }
    | { type: 'tap'; id: string }
    | { type: 'touchClear' }
    | { type: 'chipBack' }
    | { type: 'retLeft' }
    | { type: 'retArrived' }
    | { type: 'escape' }

const emptyFlags = (): RefFlags => ({ hover: false, focus: false, peek: false })

export function createState(ids: string[]): ScholionState {
    return {
        flags: Object.fromEntries(ids.map(id => [id, emptyFlags()])),
        lastId: null,
        touchId: null,
        ret: null,
    }
}

export function isActive(state: ScholionState, id: string): boolean {
    const f = state.flags[id]
    return state.touchId === id || (!!f && (f.hover || f.focus || f.peek))
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
        case 'jump':
            return {
                ...withFlags(state, event.id, { peek: false }),
                touchId: null,
                ret: { id: event.id, to: event.kind === 'code' ? 'c' : 'a', left: false },
            }
        case 'tap':
            return { ...state, touchId: event.id, lastId: event.id }
        case 'touchClear':
            return state.touchId === null ? state : { ...state, touchId: null }
        case 'chipBack':
        case 'retArrived':
            return { ...state, ret: null }
        case 'retLeft':
            return state.ret && !state.ret.left ? { ...state, ret: { ...state.ret, left: true } } : state
        case 'escape':
            return state.ret || state.touchId !== null ? { ...state, ret: null, touchId: null } : state
    }
}
