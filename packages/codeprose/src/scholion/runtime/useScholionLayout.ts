import { useCallback, useEffect, useLayoutEffect, useRef, useState, type Dispatch } from 'react';

import { computeRefWires, inView, wantPeek, type Want, type Wire, type WireItem } from './layout';
import { isActive, type ScholionEvent, type ScholionState } from './state';

import type { Docks } from './dockNode';
import type { Registry } from './scan';

export type Layout = {
    /** Ref the peek / wires currently belong to */
    pr: string | null;
    want: Want | null;
    /** Drawable wires of active refs, by id */
    wires: Record<string, Wire>;
    /** Wires to the further code targets of a ref (`#all`); never peeked, drawn while both ends are in view */
    extras: Record<string, Wire[]>;
};

export const emptyLayout: Layout = { pr: null, want: null, wires: {}, extras: {} };

const samePoint = (a: { x: number; y: number }, b: { x: number; y: number }) => a.x === b.x && a.y === b.y;

export function sameLayout(a: Layout, b: Layout): boolean {
    if (a === b) return true;
    if (a.pr !== b.pr || a.want?.kind !== b.want?.kind || a.want?.pos !== b.want?.pos) return false;
    return sameWires(a.wires, b.wires) && sameWires(a.extras, b.extras);
}

const sameWire = (a: Wire, b: Wire) => a.dashed === b.dashed && samePoint(a.P, b.P) && samePoint(a.Q, b.Q);

function sameWires<T extends Wire | Wire[]>(a: Record<string, T>, b: Record<string, T>): boolean {
    const ka = Object.keys(a);
    if (ka.length !== Object.keys(b).length) return false;
    return ka.every(id => {
        const wa = a[id];
        const wb = b[id];
        if (!wb) return false;
        if (Array.isArray(wa)) return wa.length === (wb as Wire[]).length && wa.every((w, i) => sameWire(w, (wb as Wire[])[i]));
        return sameWire(wa, wb as Wire);
    });
}

export const viewportHeight = () => window.visualViewport?.height ?? innerHeight;

/** Height of the sticky header: the top dock sits right below it (`top: var(--navi-height)`). */
export function headerOffset(docks: Docks): number {
    return docks.top ? parseFloat(getComputedStyle(docks.top).top) || 0 : 0;
}

/** Measures geometry (rAF-scheduled) and derives which peek and wires to show. */
export function useScholionLayout(
    registry: Registry,
    state: ScholionState,
    dispatch: Dispatch<ScholionEvent>,
    docks: Docks
): Layout {
    const [layout, setLayout] = useState<Layout>(emptyLayout);
    const live = useRef({ registry, state, dispatch, docks });
    const raf = useRef(0);

    useLayoutEffect(() => {
        live.current = { registry, state, dispatch, docks };
    });

    const measure = useCallback(() => {
        const { registry, state, dispatch, docks } = live.current;
        const { ids, refs } = registry;
        const vh = viewportHeight();
        const topEdge = headerOffset(docks);

        const geo: Record<string, { a: DOMRect; c: DOMRect | null }> = {};
        for (const id of ids) {
            geo[id] = {
                a: refs[id].a.getBoundingClientRect(),
                c: (refs[id].cs[0]?.getClientRects()[0] as DOMRect | undefined) ?? null,
            };
        }

        const pr = state.lastId && isActive(state, state.lastId) && geo[state.lastId] ? state.lastId : null;
        const want = pr ? wantPeek({ a: geo[pr].a, c: geo[pr].c, vh, topEdge }) : null;

        // The peek is rendered by now (see the layout effect below), measure it for the wire end
        let peekGeo: { rect: DOMRect; token: DOMRect | null } | null = null;
        if (want) {
            const el = document.querySelector<HTMLElement>(`.scholion-peek--${want.kind}`);
            if (el) {
                peekGeo = {
                    rect: el.getBoundingClientRect(),
                    token: el.querySelector<HTMLElement>('.scholion-peek__token')?.getBoundingClientRect() ?? null,
                };
            }
        }

        const items: Record<string, WireItem> = {};
        for (const id of ids) {
            if (!isActive(state, id)) continue;
            items[id] = {
                ...geo[id],
                preRect: refs[id].pre?.getBoundingClientRect() ?? null,
                targets: refs[id].as.slice(1),
            };
        }
        const { wires, extras } = computeRefWires({ items, pr, want, peek: peekGeo, vh, topEdge });

        const next: Layout = { pr, want, wires, extras };
        setLayout(prev => (sameLayout(prev, next) ? prev : next));

        // Auto-hide the chip when the return target scrolls back into view
        const ret = state.ret;
        if (ret && geo[ret.id]) {
            const vis = inView(ret.to === 'c' ? geo[ret.id].c : geo[ret.id].a, vh, topEdge);
            if (!vis) {
                if (!ret.left) dispatch({ type: 'retLeft' });
            } else if (ret.left) {
                dispatch({ type: 'retArrived' });
            }
        }
    }, []);

    const schedule = useCallback(() => {
        cancelAnimationFrame(raf.current);
        raf.current = requestAnimationFrame(measure);
    }, [measure]);

    useEffect(() => {
        const cleanups: (() => void)[] = [];
        const on = (el: EventTarget, type: string, opts?: AddEventListenerOptions) => {
            el.addEventListener(type, schedule, opts);
            cleanups.push(() => el.removeEventListener(type, schedule, opts));
        };

        on(window, 'scroll', { passive: true });
        on(window, 'resize');
        if (window.visualViewport) {
            on(window.visualViewport, 'resize');
            on(window.visualViewport, 'scroll');
        }
        new Set(registry.ids.map(id => registry.refs[id].pre).filter(Boolean)).forEach(pre =>
            on(pre!, 'scroll', { passive: true })
        );

        const ro = new ResizeObserver(schedule);
        ro.observe(document.body);
        cleanups.push(() => ro.disconnect());

        void document.fonts?.ready.then(schedule);
        schedule();

        return () => {
            cleanups.forEach(fn => fn());
            cancelAnimationFrame(raf.current);
        };
    }, [registry, schedule]);

    useEffect(schedule, [state, schedule]);

    // The wire end sits on the peek, so measure again right after the peek (or the chip entering the same dock) is committed
    const wantKey = layout.want ? `${layout.want.kind}:${layout.want.pos}:${layout.pr}` : '';
    const chipOn = state.ret !== null;
    useLayoutEffect(() => {
        if (wantKey) measure();
    }, [wantKey, chipOn, measure]);

    return layout;
}
