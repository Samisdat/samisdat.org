import { useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState, type ReactNode } from 'react';

import { Chip } from './Chip';
import { ScholionContext, type ScholionContextValue } from './context';
import { type PeekKind, type PeekPos, type Want } from './layout';
import { Peek } from './Peek';
import { scanRefs, type Registry } from './scan';
import { createState, reduce, type ScholionState } from './state';
import { useDelegatedListeners } from './useDelegatedListeners';
import { useScholionLayout } from './useScholionLayout';
import { useTokenColors } from './useTokenColors';
import { Wires } from './Wires';

import type { Docks } from './dockNode';

type ScholionProviderProps = {
    children: ReactNode;
    /**
     * Changes whenever the scanned content changes (e.g. the post slug). The provider scans the whole
     * document once after mount and again whenever this key changes. A MutationObserver was left out
     * on purpose: the content is server-rendered and only swaps on navigation.
     */
    contentKey?: string;
    /**
     * Mount nodes for the peeks (`top`) and for the return chip and bottom peeks (`bottom`). The nodes
     * are flex containers owned by the host; peeks and the chip are portaled into them as flex children.
     * A peek whose node is `null` renders nothing.
     */
    docks: Docks;
};

/**
 * Wires up the scholion runtime for the server-rendered markup in `children` (or anywhere in the document):
 * hover/focus/tap state, peeks, wires and the return chip.
 */
export function ScholionProvider({ children, contentKey, docks }: ScholionProviderProps) {
    const [scan, setScan] = useState<{ n: number; registry: Registry } | null>(null);

    useEffect(() => {
        // The scan needs the committed DOM, so setting state in the effect is intended here
        const registry = scanRefs(document);
        // oxlint-disable-next-line react/set-state-in-effect
        setScan(prev => (registry.ids.length ? { n: (prev?.n ?? 0) + 1, registry } : null));
    }, [contentKey]);

    return (
        <>
            {children}
            {scan && (
                <ScholionRuntime
                    key={scan.n}
                    registry={scan.registry}
                    docks={docks}
                />
            )}
        </>
    );
}

const smoothBehavior = (): ScrollBehavior =>
    matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

type Shown = Record<PeekKind, { id: string; pos: PeekPos } | null> & { last: PeekKind | null };

const KINDS: PeekKind[] = ['code', 'text'];

function isPeekOn(kind: PeekKind, shown: Shown, want: Want | null, pr: string | null, state: ScholionState): boolean {
    const s = shown[kind];
    if (want?.kind === kind) return true;
    // A peek that is being hovered stays up even if the geometry no longer asks for it
    // (only the most recently wanted kind, so a stale peek of the other kind cannot linger)
    return shown.last === kind && !!s && !!state.flags[s.id]?.peek && pr === s.id;
}

function ScholionRuntime({ registry, docks }: { registry: Registry; docks: Docks }) {
    const [state, dispatch] = useReducer(reduce, registry.ids, createState);
    const layout = useScholionLayout(registry, state, dispatch, docks);
    const colors = useTokenColors(registry);
    const grace = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
    const live = useRef({ state, registry });

    useLayoutEffect(() => {
        live.current = { state, registry };
    });

    // ── Actions ────────────────────────────────────────────────────────────
    const jump = useCallback((kind: PeekKind, id: string) => {
        const { a, b, cs } = live.current.registry.refs[id];
        const behavior = smoothBehavior();
        dispatch({ type: 'jump', kind, id });
        if (kind === 'code') {
            a.focus({ preventScroll: true });
            a.scrollIntoView({ block: 'center', inline: 'center', behavior });
        } else {
            b.focus({ preventScroll: true });
            (cs[0] ?? b).scrollIntoView({ block: 'center', behavior });
        }
    }, []);

    const goBack = useCallback(() => {
        const { state, registry } = live.current;
        const ret = state.ret;
        if (!ret) return;
        const { a, b, cs } = registry.refs[ret.id];
        const behavior = smoothBehavior();
        if (ret.to === 'c') {
            (cs[0] ?? b).scrollIntoView({ block: 'center', behavior });
            b.focus({ preventScroll: true });
        } else {
            a.scrollIntoView({ block: 'center', inline: 'center', behavior });
            a.focus({ preventScroll: true });
        }
        dispatch({ type: 'chipBack' });
    }, []);

    // Hover and peek are independent flags: entering the peek must not cancel a pending expiry,
    // otherwise the hover flag would stay set after the pointer left again.
    const peekEnter = useCallback((id: string) => dispatch({ type: 'peekEnter', id }), []);
    const peekLeave = useCallback((id: string) => dispatch({ type: 'peekLeave', id }), []);

    useDelegatedListeners(registry, docks, dispatch, live, grace);

    // ── Mirrors into the document (the injected per-ref CSS reads these) ───
    useEffect(() => {
        const root = document.documentElement;
        for (const id of registry.ids) root.style.setProperty(`--scholion-color-${id}`, colors[id]);
    }, [registry, colors]);

    useEffect(() => {
        const root = document.documentElement;
        return () => {
            for (const id of registry.ids) root.style.removeProperty(`--scholion-color-${id}`);
        };
    }, [registry]);

    // ── Peeks: keep the last shown one mounted so it can fade out ──────────
    const [shown, setShown] = useState<Shown>({ code: null, text: null, last: null });
    const { want, pr } = layout;
    if (want && pr) {
        const cur = shown[want.kind];
        if (!cur || cur.id !== pr || cur.pos !== want.pos || shown.last !== want.kind) {
            setShown({ ...shown, [want.kind]: { id: pr, pos: want.pos }, last: want.kind });
        }
    }

    const on = (kind: PeekKind) => isPeekOn(kind, shown, want, pr, state);

    // Hiding a peek ends the peek flag
    useEffect(() => {
        // The flag is per ref, so it only ends when no visible peek belongs to that ref
        const visibleIds = KINDS.filter(kind => isPeekOn(kind, shown, want, pr, state)).map(kind => shown[kind]?.id);
        for (const kind of KINDS) {
            const s = shown[kind];
            if (s && !visibleIds.includes(s.id) && state.flags[s.id]?.peek) dispatch({ type: 'peekLeave', id: s.id });
        }
    }, [shown, want, pr, state]);

    const value = useMemo<ScholionContextValue>(
        () => ({ registry, colors, state, layout, docks, jump, goBack, peekEnter, peekLeave }),
        [registry, colors, state, layout, docks, jump, goBack, peekEnter, peekLeave]
    );

    return (
        <ScholionContext.Provider value={value}>
            <Wires />
            {KINDS.map(kind => {
                const s = shown[kind];
                return s ? (
                    <Peek
                        key={kind}
                        kind={kind}
                        id={s.id}
                        pos={s.pos}
                        on={on(kind)}
                    />
                ) : null;
            })}
            <Chip />
        </ScholionContext.Provider>
    );
}
