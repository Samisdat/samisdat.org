import { describe, expect, it } from 'vitest';

import { DriftState, positions, startDrift, step } from '../cloudDrift';

import type { Spawn } from '../cloudLife';

const WIDTH = 1000;

const lonely = { lane: 0, x: 500, speed: 1, life: Infinity, members: [{ id: 0, dx: 0, from: 0, to: 100, pivot: 50 }] };

const spawn = (): Spawn => ({
    member: { from: 0, to: 80, pivot: 40, y: 20, base: 30 },
    lane: 0,
    x: 200,
    speed: 2,
    body: 'M0 30Z',
    shade: 'M0 30Z',
});

/** Runs the drift for `seconds` in steps of a tenth and keeps every scale cloud 0 had on the way. */
const run = (state: DriftState, seconds: number) => {
    let current = state;
    const scales: number[] = [];
    const reshaped: number[] = [];

    for (let count = 0; count < Math.round(seconds * 10); count += 1) {
        current = step(current, 0.1);
        scales.push(positions(current).get(0)?.scale ?? -1);
        reshaped.push(...current.reshaped.map(({ id }) => id));
    }

    return { state: current, scales, reshaped };
};

describe('cloud life', () => {
    it('keeps a new sky at full size for a while', () => {
        const { scales } = run(startDrift(WIDTH, [lonely], 1), 60);

        expect(scales.every(scale => 1 === scale)).toBe(true);
    });

    it('lets a cloud dissolve by shrinking, and grows a new one elsewhere with the same id', () => {
        const { state, scales, reshaped } = run(startDrift(WIDTH, [lonely], 1, spawn), 300);
        const shrinking = scales.filter(scale => scale > 0 && scale < 1);

        expect(shrinking.length).toBeGreaterThan(0);
        expect(reshaped).toContain(0);
        expect(state.groups).toHaveLength(1);
        expect(state.groups[0].members[0].id).toBe(0);
    });

    it('grows a new cloud from nothing to full size', () => {
        const { scales } = run(startDrift(WIDTH, [lonely], 1, spawn), 300);
        const reborn = scales.indexOf(Math.min(...scales));

        expect(Math.min(...scales)).toBeLessThan(0.1);
        expect(scales.slice(reborn).some(scale => 1 === scale)).toBe(true);
    });

    it('drops a dissolved cloud for good when nothing makes new ones', () => {
        expect(run(startDrift(WIDTH, [lonely], 1), 300).state.groups).toHaveLength(0);
    });

    it('lives the same way for the same seed', () => {
        const a = run(startDrift(WIDTH, [lonely], 5, spawn), 300);
        const b = run(startDrift(WIDTH, [lonely], 5, spawn), 300);

        expect(a.scales).toEqual(b.scales);
    });
});
