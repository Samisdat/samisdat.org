import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { GhostDemo } from '../GhostDemo';

import type { Script } from '../../InteractionGhost/script';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const script: Script = [{ tap: [0.5, 0.5] }, { wait: 100 }];

type Callback = (entries: Partial<IntersectionObserverEntry>[]) => void;
let callback: Callback;
class MockObserver {
    constructor(cb: Callback) {
        callback = cb;
    }
    observe() {}
    disconnect() {}
}

let root: Root;
let host: HTMLDivElement;

const button = (name: RegExp) => [...host.querySelectorAll('button')].find((b) => name.test(b.textContent ?? ''))!;
const click = (name: RegExp) => act(() => button(name).click());
const advance = (ms: number) => act(() => vi.advanceTimersByTime(ms));

beforeEach(() => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance', 'setTimeout'] });
    vi.stubGlobal('IntersectionObserver', MockObserver);
    vi.stubGlobal('matchMedia', () => ({
        matches: false,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
    }));
    host = document.createElement('div');
    document.body.append(host);
    root = createRoot(host);
    act(() => root.render(<GhostDemo script={script}>{() => <i data-testid="demo" />}</GhostDemo>));
});

afterEach(() => {
    act(() => root.unmount());
    host.remove();
    vi.unstubAllGlobals();
    vi.useRealTimers();
});

describe('GhostDemo', () => {
    it('autoplays once when visible, pauses when the script is done, Play restarts', () => {
        expect(button(/Play/)).toBeTruthy();
        act(() => callback([{ isIntersecting: true }]));
        expect(button(/Pause/)).toBeTruthy();

        advance(2000);
        expect(button(/Play/)).toBeTruthy();

        // scrolling in again does not restart
        act(() => callback([{ isIntersecting: false }]));
        act(() => callback([{ isIntersecting: true }]));
        expect(button(/Play/)).toBeTruthy();

        click(/Play/);
        expect(button(/Pause/)).toBeTruthy();
        advance(2000);
        expect(button(/Play/)).toBeTruthy();
    });

    it('takeover pauses', () => {
        act(() => callback([{ isIntersecting: true }]));
        const target = host.querySelector('[data-testid="demo"]')!.parentElement!;
        act(() => {
            target.dispatchEvent(new Event('pointerdown', { bubbles: true }));
        });
        expect(button(/Play/)).toBeTruthy();
    });

    it('Reset restarts and plays', () => {
        act(() => callback([{ isIntersecting: true }]));
        advance(2000);
        expect(button(/Play/)).toBeTruthy();
        click(/Reset/);
        expect(button(/Pause/)).toBeTruthy();
    });

    it('speed buttons change the speed label', () => {
        click(/\+/);
        expect(host.textContent).toContain('Speed (1.25x)');
    });
});
