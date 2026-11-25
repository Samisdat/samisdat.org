import { describe, expect, it } from 'vitest';

import { DriftSeed, DriftState, positions, startDrift, step } from '../cloudDrift';

const WIDTH = 1000;

const cloud = (id: number, width = 100) => ({ id, dx: 0, from: 0, to: width });

const group = (overrides: Partial<DriftSeed> & Pick<DriftSeed, 'members'>): DriftSeed => ({
    lane: 0,
    x: 0,
    speed: 10,
    life: Infinity,
    ...overrides,
});

/** Runs the drift for `seconds` in steps of a tenth. */
const run = (state: DriftState, seconds: number) => {
    let current = state;

    for (let count = 0; count < Math.round(seconds * 10); count += 1) {
        current = step(current, 0.1);
    }

    return current;
};

describe('cloud drift', () => {
    it('moves the clouds to the left and wraps them around the sky', () => {
        const state = run(startDrift(WIDTH, [group({ x: 50, members: [cloud(0)] })], 1), 10);

        expect(positions(state).get(0)?.x).toBeCloseTo(950, 0);
    });

    it('merges a group that catches up with another on its lane', () => {
        const fast = group({ x: 300, speed: 30, members: [cloud(0)] });
        const slow = group({ x: 100, speed: 5, members: [cloud(1)] });
        const state = run(startDrift(WIDTH, [fast, slow], 1), 9);

        expect(state.groups).toHaveLength(1);
        expect(state.groups[0].members.map(({ id }) => id).sort()).toEqual([0, 1]);
        expect(state.groups[0].speed).toBeGreaterThan(5);
        expect(state.groups[0].speed).toBeLessThan(30);
    });

    it('keeps the clouds where they were when they merge', () => {
        const fast = group({ x: 300, speed: 30, members: [cloud(0)] });
        const slow = group({ x: 100, speed: 5, members: [cloud(1)] });
        const before = run(startDrift(WIDTH, [fast, slow], 1), 7.9);
        const after = step(before, 0.1);
        const moved = (id: number) => (positions(before).get(id)?.x ?? 0) - (positions(after).get(id)?.x ?? 0);

        // Within one step each cloud moves at most the faster speed.
        expect(moved(0)).toBeLessThanOrEqual(3.01);
        expect(moved(1)).toBeLessThanOrEqual(3.01);
    });

    it('lets the light bodies push into each other and merges only once the dark undersides touch', () => {
        // Bodies 200 wide, undersides from 60 to 140: the bodies meet at once, the undersides after 4.8 s.
        const shaded = (id: number) => ({ id, dx: 0, from: 0, to: 200, shadeFrom: 60, shadeTo: 140 });
        const seeds = [
            group({ x: 300, speed: 30, members: [shaded(0)] }),
            group({ x: 100, speed: 5, members: [shaded(1)] }),
        ];

        expect(run(startDrift(WIDTH, seeds, 1), 3).groups).toHaveLength(2);
        expect(run(startDrift(WIDTH, seeds, 1), 6).groups).toHaveLength(1);
    });

    it('lets clouds on different lanes pass each other', () => {
        const fast = group({ x: 300, speed: 30, members: [cloud(0)] });
        const slow = group({ lane: 1, x: 100, speed: 5, members: [cloud(1)] });

        expect(run(startDrift(WIDTH, [fast, slow], 1), 9).groups).toHaveLength(2);
    });

    it('parts a pair once its life is over, the front faster than the back', () => {
        const pair = group({ x: 500, life: 2, members: [cloud(0), { id: 1, dx: 0, from: 100, to: 200 }] });
        const state = run(startDrift(WIDTH, [pair], 1), 2.5);
        const [front, back] = [...state.groups].sort((a, b) => a.members[0].from - b.members[0].from);

        expect(state.groups).toHaveLength(2);
        expect(front.speed).toBeGreaterThan(10);
        expect(back.speed).toBeLessThan(10);
    });

    it('does not merge two halves again right after they parted', () => {
        const pair = group({ x: 500, life: 2, members: [cloud(0), { id: 1, dx: 0, from: 100, to: 200 }] });

        expect(run(startDrift(WIDTH, [pair], 1), 4).groups).toHaveLength(2);
    });

    it('drifts the same way for the same seed', () => {
        const seeds = [
            group({ x: 300, speed: 30, members: [cloud(0)] }),
            group({ x: 100, speed: 5, members: [cloud(1)] }),
        ];
        const a = run(startDrift(WIDTH, seeds, 3), 30);
        const b = run(startDrift(WIDTH, seeds, 3), 30);

        expect([...positions(a)]).toEqual([...positions(b)]);
    });
});
