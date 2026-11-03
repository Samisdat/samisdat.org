import { useEffect, type Dispatch, type MutableRefObject } from 'react';

import { inView } from './layout';
import { headerOffset, viewportHeight } from './useScholionLayout';

import type { Docks } from './dockNode';
import type { Registry } from './scan';
import type { ScholionEvent, ScholionState } from './state';

const GRACE_MS = 250;

type Live = MutableRefObject<{ state: ScholionState; registry: Registry }>;
type Grace = MutableRefObject<Record<string, ReturnType<typeof setTimeout>>>;

/** Delegated document listeners: hover/focus/tap/escape handling for all refs of the registry. */
export function useDelegatedListeners(
    registry: Registry,
    docks: Docks,
    dispatch: Dispatch<ScholionEvent>,
    live: Live,
    grace: Grace
) {
    useEffect(() => {
        const refs = registry.refs;

        const refId = (el: Element | null, selector: string): string | null => {
            const hit = el?.closest<HTMLElement>(selector);
            const id = hit?.dataset.ref;
            return hit && id && refs[id] ? id : null;
        };
        const hoverSelector = 'a.ref[data-ref], .ref-target[data-ref]';

        const hoverOn = (id: string) => {
            clearTimeout(grace.current[id]);
            dispatch({ type: 'hoverOn', id });
        };
        const hoverOff = (id: string) => {
            clearTimeout(grace.current[id]);
            grace.current[id] = setTimeout(() => dispatch({ type: 'hoverExpire', id }), GRACE_MS);
        };

        const onPointerOver = (e: PointerEvent) => {
            if (e.pointerType !== 'mouse') return;
            const el = (e.target as Element).closest(hoverSelector);
            const id = refId(el, hoverSelector);
            if (id && !el!.contains(e.relatedTarget as Node | null)) hoverOn(id);
        };
        const onPointerOut = (e: PointerEvent) => {
            if (e.pointerType !== 'mouse') return;
            const el = (e.target as Element).closest(hoverSelector);
            const id = refId(el, hoverSelector);
            if (id && !el!.contains(e.relatedTarget as Node | null)) hoverOff(id);
        };
        const onFocusIn = (e: FocusEvent) => {
            const el = e.target as Element;
            const id = refId(el, 'a.ref[data-ref]');
            if (id && el.matches(':focus-visible')) dispatch({ type: 'focus', id });
        };
        const onFocusOut = (e: FocusEvent) => {
            const id = refId(e.target as Element, 'a.ref[data-ref]');
            if (id) dispatch({ type: 'blur', id });
        };
        // Pointer type of the most recent pointerdown; 'touch' and 'pen' count as touch
        let lastPointerTouch = false;
        const onPointerDown = (e: PointerEvent) => {
            lastPointerTouch = e.pointerType === 'touch' || e.pointerType === 'pen';
        };
        const bothEndsInView = (id: string) => {
            const { a, cs } = refs[id];
            const vh = viewportHeight();
            const topEdge = headerOffset(docks);
            return (
                inView(a.getBoundingClientRect(), vh, topEdge) &&
                inView(cs[0]?.getClientRects()[0] ?? null, vh, topEdge)
            );
        };
        const onClick = (e: MouseEvent) => {
            const target = e.target as Element;
            const id = refId(target, 'a.ref[data-ref]') ?? refId(target, '.ref-target[data-ref]');
            const { state } = live.current;
            if (!id) {
                if (state.touchId !== null && !target.closest('.scholion-peek, .scholion-chip'))
                    dispatch({ type: 'touchClear' });
                return;
            }
            // Keyboard activation (detail 0) always follows the link so focus moves with it
            if (e.detail === 0) return;
            // First tap on touch only activates the ref (peek/wire); no scrolling, no navigation
            const firstTap = lastPointerTouch && state.touchId !== id;
            // Both ends in view: the wire is the connection, the link does nothing for pointer input.
            // One end out of view (peek shown): mouse clicks follow the link, the first tap still only activates.
            if (bothEndsInView(id) || firstTap) {
                e.preventDefault();
                if (firstTap) dispatch({ type: 'tap', id });
            }
        };
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key !== 'Escape') return;
            const { state } = live.current;
            if (state.ret || state.touchId !== null) dispatch({ type: 'escape' });
        };

        document.addEventListener('pointerdown', onPointerDown, { capture: true, passive: true });
        document.addEventListener('pointerover', onPointerOver);
        document.addEventListener('pointerout', onPointerOut);
        document.addEventListener('focusin', onFocusIn);
        document.addEventListener('focusout', onFocusOut);
        document.addEventListener('click', onClick);
        document.addEventListener('keydown', onKeyDown);
        const timers = grace.current;
        return () => {
            document.removeEventListener('pointerdown', onPointerDown, { capture: true });
            document.removeEventListener('pointerover', onPointerOver);
            document.removeEventListener('pointerout', onPointerOut);
            document.removeEventListener('focusin', onFocusIn);
            document.removeEventListener('focusout', onFocusOut);
            document.removeEventListener('click', onClick);
            document.removeEventListener('keydown', onKeyDown);
            Object.values(timers).forEach(clearTimeout);
        };
    }, [registry, docks, grace, live, dispatch]);
}
