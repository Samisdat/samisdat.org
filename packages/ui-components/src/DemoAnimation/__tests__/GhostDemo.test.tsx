import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { GhostDemo, type GhostDemoProps } from '../GhostDemo';

import type { Norm, NormSource } from '@samisdat/tools';

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
let norms: Norm[];
let latestSource: NormSource | undefined;
let host: HTMLDivElement;

const button = (name: RegExp) => [...host.querySelectorAll('button')].find((b) => name.test(b.textContent ?? ''))!;
const click = (name: RegExp) => act(() => button(name).click());
const advance = (ms: number) => act(() => vi.advanceTimersByTime(ms));

const demo = (source: NormSource) => {
    latestSource = source;
    return <i data-testid="demo" />;
};

const mount = (props: Partial<GhostDemoProps> = {}) =>
    act(() =>
        root.render(
            <GhostDemo
                script={script}
                {...props}
            >
                {demo}
            </GhostDemo>
        )
    );

beforeEach(() => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance', 'setTimeout', 'clearTimeout'] });
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
    norms = [];
    mount();
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
        mount({ speedControl: true });
        click(/\+/);
        expect(host.textContent).toContain('Speed (1.25x)');
    });

    describe('control bar wiring', () => {
        const stage = () => host.querySelector('[data-testid="demo"]')!.parentElement!;
        const slider = () => host.querySelector<HTMLInputElement>('input[type="range"]')!;
        const text = () => host.textContent ?? '';
        const seek = (to: number) =>
            act(() => {
                const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!;
                setter.call(slider(), String(to));
                slider().dispatchEvent(new Event('input', { bubbles: true }));
            });
        const fire = (target: Element, type: string, clientX = 0, clientY = 0) =>
            act(() => {
                target.dispatchEvent(Object.assign(new Event(type, { bubbles: true }), { clientX, clientY }));
            });

        it('renders device sketch and timeline, speed slider off by default', () => {
            expect(host.querySelector('svg')).toBeTruthy();
            expect(slider().getAttribute('aria-label')).toBe('Position in der Aufzeichnung');
            expect(Number(slider().max)).toBeCloseTo(1.5);
            expect(text()).not.toContain('Speed (');
            mount({ speedControl: true });
            expect(text()).toContain('Speed (');
        });

        it('seek sets position and scene without taking over', () => {
            latestSource!.subscribe((n) => norms.push(n));
            seek(1.2);
            expect(text()).toContain('00:01.20');
            expect(norms.at(-1)).toEqual({ x: 0.5, y: 0.5 });
            expect(text()).not.toContain('Du steuerst');
            expect(button(/Play/)).toBeTruthy();
        });

        it('shows the takeover notice, with the resume hint only when resumeAfterMs is set', () => {
            act(() => callback([{ isIntersecting: true }]));
            fire(stage(), 'pointerdown');
            expect(text()).toContain('Du steuerst.');
            expect(text()).not.toContain('Ruhe');
            click(/Reset/);
            expect(text()).not.toContain('Du steuerst');

            mount({ resumeAfterMs: 3500 });
            click(/Reset/);
            fire(stage(), 'pointerdown');
            expect(text()).toContain('Du steuerst. Die Aufnahme läuft nach 3,5 s Ruhe weiter.');
        });

        it('does not take over when the control bar is used', () => {
            act(() => callback([{ isIntersecting: true }]));
            fire(button(/Pause/), 'pointerdown');
            fire(slider(), 'pointerdown');
            fire(slider(), 'pointermove', 40, 40);
            fire(slider(), 'pointermove', 90, 90);
            expect(text()).not.toContain('Du steuerst');
        });

        it('resumes from the paused position after idle time', () => {
            mount({ script: [{ tap: [0.5, 0.5] }, { wait: 8000 }], resumeAfterMs: 3500 });
            act(() => callback([{ isIntersecting: true }]));
            advance(600);
            fire(stage(), 'pointerdown');
            const paused = slider().value;
            expect(button(/Play/)).toBeTruthy();

            fire(stage(), 'pointerup');
            advance(3000);
            fire(stage(), 'pointermove', 1, 1);
            advance(3000);
            expect(button(/Play/)).toBeTruthy();
            advance(600);
            expect(button(/Pause/)).toBeTruthy();
            expect(text()).not.toContain('Du steuerst');
            expect(Number(slider().value)).toBeGreaterThanOrEqual(Number(paused));

            advance(500);
            expect(Number(slider().value)).toBeGreaterThan(Number(paused) + 0.3);
        });

        it('Play during a takeover continues the recording at once', () => {
            mount({ resumeAfterMs: 3500 });
            act(() => callback([{ isIntersecting: true }]));
            advance(300);
            fire(stage(), 'pointerdown');
            fire(stage(), 'pointerup');
            click(/Play/);
            expect(button(/Pause/)).toBeTruthy();
            expect(text()).not.toContain('Du steuerst');
        });

        it('does not resume while a pointer is held down', () => {
            mount({ script: [{ tap: [0.5, 0.5] }, { wait: 8000 }], resumeAfterMs: 1000 });
            act(() => callback([{ isIntersecting: true }]));
            fire(stage(), 'pointerdown');
            advance(5000);
            expect(button(/Play/)).toBeTruthy();
            fire(stage(), 'pointerup');
            advance(1100);
            expect(button(/Pause/)).toBeTruthy();
        });

        it('loops instead of finishing', () => {
            mount({ loop: true });
            act(() => callback([{ isIntersecting: true }]));
            advance(6000);
            expect(button(/Pause/)).toBeTruthy();
            expect(Number(slider().value)).toBeLessThanOrEqual(1.5);
        });

        it('without loop the round ends', () => {
            act(() => callback([{ isIntersecting: true }]));
            advance(6000);
            expect(button(/Play/)).toBeTruthy();
        });
    });
});
