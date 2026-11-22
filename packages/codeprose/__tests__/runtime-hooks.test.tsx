// @vitest-environment happy-dom
import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { ScholionContext, useScholion, type ScholionContextValue } from '../src/scholion/runtime/context';
import { useDockNode } from '../src/scholion/runtime/dockNode';
import { emptyLayout } from '../src/scholion/runtime/useScholionLayout';
import { scanRefs } from '../src/scholion/runtime/scan';
import { createState } from '../src/scholion/runtime/state';
import { useTokenColors } from '../src/scholion/runtime/useTokenColors';
import { mount } from './helpers/scholionDom';

import type { ReactNode } from 'react';

afterEach(() => {
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('style');
    document.documentElement.removeAttribute('data-theme');
});

const noop = () => {};

function contextValue(overrides: Partial<ScholionContextValue> = {}): ScholionContextValue {
    const registry = { ids: [], refs: {} };
    return {
        registry,
        colors: {},
        state: createState([]),
        layout: emptyLayout,
        docks: { top: null, bottom: null },
        jump: noop,
        goBack: noop,
        peekEnter: noop,
        peekLeave: noop,
        ...overrides,
    };
}

describe('useScholion / useDockNode', () => {
    it('throws outside of the provider', () => {
        expect(() => renderHook(() => useScholion())).toThrow(/inside <ScholionProvider>/);
    });

    it('returns the context value', () => {
        const value = contextValue();
        const wrapper = ({ children }: { children: ReactNode }) => (
            <ScholionContext.Provider value={value}>{children}</ScholionContext.Provider>
        );
        const { result } = renderHook(() => useScholion(), { wrapper });
        expect(result.current).toBe(value);
    });

    it('resolves the dock node by position and is null for an unmounted dock', () => {
        const top = document.createElement('div');
        const value = contextValue({ docks: { top, bottom: null } });
        const wrapper = ({ children }: { children: ReactNode }) => (
            <ScholionContext.Provider value={value}>{children}</ScholionContext.Provider>
        );
        expect(renderHook(() => useDockNode('top'), { wrapper }).result.current).toBe(top);
        expect(renderHook(() => useDockNode('bottom'), { wrapper }).result.current).toBeNull();
    });
});

describe('useTokenColors', () => {
    it('starts with the scanned colors', () => {
        const registry = scanRefs(mount());
        const { result } = renderHook(() => useTokenColors(registry));
        expect(result.current).toEqual({ alpha: 'rgb(1, 2, 3)', beta: expect.any(String) });
    });

    it('re-reads the colors when <html> changes', async () => {
        const root = mount();
        const registry = scanRefs(root);
        const { result } = renderHook(() => useTokenColors(registry));
        root.querySelector<HTMLElement>('a[data-ref="alpha"] span')!.style.color = 'rgb(10, 20, 30)';
        act(() => document.documentElement.setAttribute('data-theme', 'dark'));
        await waitFor(() => expect(result.current.alpha).toBe('rgb(10, 20, 30)'));
    });

    it('keeps the same state object when no color changed', async () => {
        const registry = scanRefs(mount());
        const { result } = renderHook(() => useTokenColors(registry));
        const before = result.current;
        act(() => document.documentElement.setAttribute('data-theme', 'dark'));
        await new Promise(resolve => setTimeout(resolve, 50));
        expect(result.current).toBe(before);
    });

    it('stops observing after unmount', async () => {
        const root = mount();
        const registry = scanRefs(root);
        const { result, unmount } = renderHook(() => useTokenColors(registry));
        unmount();
        root.querySelector<HTMLElement>('a[data-ref="alpha"] span')!.style.color = 'rgb(10, 20, 30)';
        document.documentElement.setAttribute('data-theme', 'dark');
        await new Promise(resolve => setTimeout(resolve, 50));
        expect(result.current.alpha).toBe('rgb(1, 2, 3)');
    });
});
