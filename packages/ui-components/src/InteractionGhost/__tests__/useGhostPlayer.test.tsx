import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useGhostPlayer, type GhostPlayer } from '../useGhostPlayer';

import type { Script } from '../script';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const script: Script = [{ tap: [0.5, 0.5] }];
const TOTAL = 1400;

let root: Root;
let latest: GhostPlayer;

type Props = { playing: boolean; speed?: number; onDone?: () => void };

const Probe = ({ playing, speed, onDone }: Props) => {
    latest = useGhostPlayer(script, { playing, speed, onDone });
    return null;
};

const render = (props: Props) => act(() => root.render(<Probe {...props} />));
const advance = (ms: number) => act(() => vi.advanceTimersByTime(ms));

beforeEach(() => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance', 'setTimeout'] });
    root = createRoot(document.createElement('div'));
});

afterEach(() => {
    act(() => root.unmount());
    vi.useRealTimers();
});

describe('useGhostPlayer', () => {
    it('advances the frame while playing', async () => {
        await render({ playing: true });
        await advance(500);
        expect(latest.finger.presence).toBe(1);
    });

    it('calls onDone once after the script ended', async () => {
        const onDone = vi.fn();
        await render({ playing: true, onDone });
        await advance(TOTAL - 100);
        expect(onDone).not.toHaveBeenCalled();
        await advance(300);
        await advance(1000);
        expect(onDone).toHaveBeenCalledTimes(1);
    });

    it('scales time with speed', async () => {
        const onDone = vi.fn();
        await render({ playing: true, speed: 2, onDone });
        await advance(TOTAL / 2 - 100);
        expect(onDone).not.toHaveBeenCalled();
        await advance(300);
        expect(onDone).toHaveBeenCalledTimes(1);
    });

    it('stops when playing becomes false and resumes without a jump', async () => {
        await render({ playing: true });
        await advance(450);
        const paused = latest.finger.age;
        await render({ playing: false });
        await advance(5000);
        expect(latest.finger.age).toBe(paused);
        expect(vi.getTimerCount()).toBe(0);
        await render({ playing: true });
        await advance(100);
        expect(latest.finger.age).toBeLessThan(paused + 200);
    });

    it('cancels the loop on unmount', async () => {
        await render({ playing: true });
        act(() => root.unmount());
        expect(vi.getTimerCount()).toBe(0);
        root = createRoot(document.createElement('div'));
    });

    it('restart() plays again from the start', async () => {
        const onDone = vi.fn();
        await render({ playing: true, onDone });
        await advance(TOTAL + 500);
        expect(onDone).toHaveBeenCalledTimes(1);
        await act(async () => latest.restart());
        expect(latest.finger.presence).toBe(0);
        await advance(TOTAL + 500);
        expect(onDone).toHaveBeenCalledTimes(2);
    });
});
