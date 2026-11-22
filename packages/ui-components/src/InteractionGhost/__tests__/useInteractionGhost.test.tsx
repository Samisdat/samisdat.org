import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useInteractionGhost, type InteractionGhost } from '../useInteractionGhost';

import type { Script } from '../script';
import type { Norm } from '@samisdat/tools';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const script: Script = [{ tap: [0.5, 0.5] }, { wait: 5000 }];
const rect = { left: 0, top: 0, width: 200, height: 100 };

let root: Root;
let host: HTMLDivElement;
let latest: InteractionGhost;
let norms: Norm[];

type Props = { playing: boolean; onTakeover?: () => void; onDone?: () => void };

const Probe = (props: Props) => {
    latest = useInteractionGhost({ script, ...props });
    return (
        <div
            ref={(el) => {
                if (el) el.getBoundingClientRect = () => rect as DOMRect;
                latest.containerRef.current = el;
            }}
            data-testid="stage"
        />
    );
};

const render = (props: Props) => act(() => root.render(<Probe {...props} />));
const advance = (ms: number) => act(() => vi.advanceTimersByTime(ms));
const fire = (type: string, clientX = 0, clientY = 0) =>
    act(() => {
        host.firstElementChild!.dispatchEvent(Object.assign(new Event(type, { bubbles: true }), { clientX, clientY }));
    });

beforeEach(() => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance', 'setTimeout', 'clearTimeout'] });
    host = document.createElement('div');
    root = createRoot(host);
    norms = [];
});

afterEach(() => {
    act(() => root.unmount());
    vi.useRealTimers();
});

const subscribe = () => latest.source.subscribe((n) => norms.push(n));

describe('useInteractionGhost', () => {
    it('drives the source from the ghost while playing, ignoring the pointer', async () => {
        await render({ playing: true });
        subscribe();
        await advance(700);
        const ghostCount = norms.length;
        expect(ghostCount).toBeGreaterThan(0);

        await fire('pointermove', 10, 10);
        expect(norms.length).toBe(ghostCount);
    });

    it('takes over after enough pointer travel, stops the ghost and calls onTakeover once', async () => {
        const onTakeover = vi.fn();
        await render({ playing: true, onTakeover });
        subscribe();
        await advance(100);

        await fire('pointermove', 100, 50);
        await fire('pointermove', 102, 50);
        expect(onTakeover).not.toHaveBeenCalled();
        await fire('pointermove', 110, 50);
        expect(onTakeover).toHaveBeenCalledTimes(1);
        expect(latest.takenOver).toBe(true);

        await advance(400);
        expect(norms.at(-1)?.x).toBeCloseTo(0.1);
        await advance(5000);
        const frozen = norms.length;
        await advance(2000);
        expect(norms.length).toBe(frozen);
        expect(latest.frame.finger.presence).toBeLessThan(1);
    });

    it('does not take over on events without travel', async () => {
        const onTakeover = vi.fn();
        await render({ playing: true, onTakeover });
        await fire('pointermove', 50, 50);
        for (let i = 0; i < 10; i++) await fire('pointermove', 50, 50);
        expect(onTakeover).not.toHaveBeenCalled();
    });

    it('takes over immediately on pointerdown and blends to that position', async () => {
        const onTakeover = vi.fn();
        await render({ playing: true, onTakeover });
        subscribe();
        await advance(100);

        await fire('pointerdown', 200, 100);
        expect(onTakeover).toHaveBeenCalledTimes(1);
        await advance(400);
        expect(norms.at(-1)).toEqual({ x: 1, y: 1 });
    });

    it('takes over on touchstart', async () => {
        const onTakeover = vi.fn();
        await render({ playing: true, onTakeover });
        await fire('touchstart');
        expect(onTakeover).toHaveBeenCalledTimes(1);
    });

    it('does not restart by itself after takeover, only via restart()', async () => {
        await render({ playing: true });
        await fire('pointerdown', 100, 50);
        await advance(1000);
        expect(latest.takenOver).toBe(true);

        await render({ playing: true });
        await advance(1000);
        expect(latest.frame.finger.presence).toBeLessThan(1);

        await act(() => latest.restart());
        expect(latest.takenOver).toBe(false);
        await advance(400);
        expect(latest.frame.finger.presence).toBeGreaterThan(0);
    });

    it('passes the pointer through when not playing', async () => {
        await render({ playing: false });
        subscribe();
        await fire('pointermove', 100, 50);
        expect(norms.at(-1)).toEqual({ x: 0, y: 0 });
        await fire('pointermove', 200, 100);
        expect(norms.at(-1)).toEqual({ x: 1, y: 1 });
    });
});
