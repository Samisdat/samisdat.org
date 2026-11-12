import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { blendNorm, createComposedSource, RESUME_BLEND_MS, TAKEOVER_BLEND_MS } from '../composedSource';

beforeEach(() => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance', 'setTimeout'] });
});
afterEach(() => vi.useRealTimers());

const setup = () => {
    const composed = createComposedSource();
    const seen = vi.fn();
    composed.source.subscribe(seen);
    return { composed, seen };
};

describe('blendNorm', () => {
    it('hits both ends and is monotonic', () => {
        const a = { x: -1, y: 0 };
        const b = { x: 1, y: 1 };
        expect(blendNorm(a, b, 0)).toEqual(a);
        expect(blendNorm(a, b, 1)).toEqual(b);
        expect(blendNorm(a, b, 0.25).x).toBeLessThan(blendNorm(a, b, 0.75).x);
    });
});

describe('createComposedSource', () => {
    it('passes the pointer through while no ghost is engaged', () => {
        const { composed, seen } = setup();
        composed.pushPointer({ x: 0.2, y: 0.2 });
        expect(seen).toHaveBeenCalledWith({ x: 0.2, y: 0.2 });
    });

    it('forwards the ghost and swallows the pointer while engaged', () => {
        const { composed, seen } = setup();
        composed.engage();
        composed.pushPointer({ x: 1, y: 1 });
        composed.pushGhost({ x: -0.5, y: 0 });
        expect(seen).toHaveBeenCalledTimes(1);
        expect(seen).toHaveBeenCalledWith({ x: -0.5, y: 0 });
    });

    it('blends from the last ghost norm to the pointer, then follows the pointer', () => {
        const { composed, seen } = setup();
        composed.engage();
        composed.pushGhost({ x: -1, y: 0 });
        composed.pushPointer({ x: 1, y: 0 });
        expect(composed.takeover()).toBe(true);
        expect(composed.mode()).toBe('blend');

        vi.advanceTimersByTime(TAKEOVER_BLEND_MS / 2);
        const mid = seen.mock.calls.at(-1)![0];
        expect(mid.x).toBeGreaterThan(-1);
        expect(mid.x).toBeLessThan(1);

        vi.advanceTimersByTime(TAKEOVER_BLEND_MS);
        expect(composed.mode()).toBe('pointer');
        expect(seen.mock.calls.at(-1)![0]).toEqual({ x: 1, y: 0 });

        composed.pushGhost({ x: 0, y: 0 });
        composed.pushPointer({ x: 0.3, y: 0.3 });
        expect(seen.mock.calls.at(-1)![0]).toEqual({ x: 0.3, y: 0.3 });
    });

    it('jumps directly with blendMs 0', () => {
        const { composed, seen } = setup();
        composed.engage();
        composed.pushPointer({ x: 0.4, y: 0.4 });
        composed.takeover(0);
        expect(composed.mode()).toBe('pointer');
        expect(seen).toHaveBeenLastCalledWith({ x: 0.4, y: 0.4 });
    });

    it('takeover is a no-op unless the ghost drives', () => {
        const { composed } = setup();
        expect(composed.takeover()).toBe(false);
        composed.engage();
        composed.takeover(0);
        expect(composed.takeover()).toBe(false);
    });

    it('release does not interrupt a running blend', () => {
        const { composed } = setup();
        composed.engage();
        composed.takeover();
        composed.release();
        expect(composed.mode()).toBe('blend');
    });

    it('stops emitting after unsubscribe', () => {
        const composed = createComposedSource();
        const seen = vi.fn();
        const off = composed.source.subscribe(seen);
        off();
        composed.pushPointer({ x: 1, y: 1 });
        expect(seen).not.toHaveBeenCalled();
    });
});

describe('resume', () => {
    const takenOver = () => {
        const { composed, seen } = setup();
        composed.engage();
        composed.pushPointer({ x: 1, y: 0 });
        composed.pushGhost({ x: -1, y: 0 });
        composed.takeover(0);
        seen.mockClear();
        return { composed, seen };
    };

    it('blends from the real pointer back to the ghost, then hands over', () => {
        const { composed, seen } = takenOver();
        composed.resume(RESUME_BLEND_MS);
        expect(composed.mode()).toBe('handback');

        composed.pushPointer({ x: 0.9, y: 0 });
        vi.advanceTimersByTime(RESUME_BLEND_MS / 2);
        const mid = seen.mock.calls.at(-1)![0];
        expect(mid.x).toBeLessThan(1);
        expect(mid.x).toBeGreaterThan(-1);

        vi.advanceTimersByTime(RESUME_BLEND_MS);
        expect(composed.mode()).toBe('ghost');
        expect(seen).toHaveBeenLastCalledWith({ x: -1, y: 0 });
    });

    it('follows the moving ghost while blending and ignores engage()', () => {
        const { composed, seen } = takenOver();
        composed.resume(RESUME_BLEND_MS);
        composed.engage();
        expect(composed.mode()).toBe('handback');
        composed.pushGhost({ x: 0, y: 0.5 });
        vi.advanceTimersByTime(RESUME_BLEND_MS + 50);
        expect(seen).toHaveBeenLastCalledWith({ x: 0, y: 0.5 });
    });

    it('a new takeover during the blend goes back to the pointer', () => {
        const { composed } = takenOver();
        composed.resume(RESUME_BLEND_MS);
        vi.advanceTimersByTime(100);
        expect(composed.takeover(0)).toBe(true);
        expect(composed.mode()).toBe('pointer');
    });

    it('release() during the blend stops it', () => {
        const { composed, seen } = takenOver();
        composed.resume(RESUME_BLEND_MS);
        composed.release();
        seen.mockClear();
        vi.advanceTimersByTime(RESUME_BLEND_MS);
        expect(seen).not.toHaveBeenCalled();
        expect(composed.mode()).toBe('pointer');
    });
});

