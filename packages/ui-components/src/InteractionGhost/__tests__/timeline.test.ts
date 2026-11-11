import { describe, expect, it } from 'vitest';

import { evaluate, totalDuration } from '../timeline';
import { trackpadDemoScript } from '../trackpadDemoScript';

import type { Script } from '../script';

const tap: Script = [{ tap: [0.5, -0.5] }];
const pan: Script = [
    {
        pan: [
            [-0.5, 0],
            [0, 0.5],
            [0.5, 0],
        ],
        ms: 1000,
    },
];

describe('totalDuration', () => {
    it('sums the steps', () => {
        expect(totalDuration([{ wait: 500 }, ...tap, ...pan])).toBe(500 + 1400 + 1400);
        expect(totalDuration([])).toBe(0);
    });

    it('covers the demo script', () => {
        expect(totalDuration(trackpadDemoScript)).toBe(1400 + 2000 + 600);
    });
});

describe('evaluate tap', () => {
    it('fades in, goes down, fades out', () => {
        expect(evaluate(tap, 0).finger.presence).toBe(0);
        expect(evaluate(tap, 300).finger.presence).toBe(1);
        expect(evaluate(tap, 399).finger.down).toBe(false);
        expect(evaluate(tap, 450).finger.down).toBe(true);
        expect(evaluate(tap, 560).finger.down).toBe(false);
        expect(evaluate(tap, 1300).finger.presence).toBeLessThan(0.01);
    });

    it('provides age for the ripple, Infinity before the down', () => {
        expect(evaluate(tap, 100).finger.age).toBe(Infinity);
        expect(evaluate(tap, 700).finger.age).toBe(300);
    });

    it('sets norm to the tap position and holds it', () => {
        const f = evaluate(tap, 1000);
        expect(f.norm.x).toBeCloseTo(0.5);
        expect(f.norm.y).toBeCloseTo(-0.5);
        expect(evaluate(tap, 99999).norm).toEqual(f.norm);
    });
});

describe('evaluate pan', () => {
    it('is down only while moving, with eased progress', () => {
        expect(evaluate(pan, 100).finger.down).toBe(false);
        expect(evaluate(pan, 700).finger.down).toBe(true);
        expect(evaluate(pan, 1250).finger.down).toBe(false);
        const early = evaluate(pan, 200 + 100).norm;
        // ease-in-out: after 10% of the time far less than 10% of the way
        expect(early.x).toBeLessThan(-0.49);
    });

    it('starts and ends at the outer waypoints', () => {
        const start = evaluate(pan, 200).finger;
        expect(start.x).toBeCloseTo(-0.5);
        const end = evaluate(pan, 1200).finger;
        expect(end.x).toBeCloseTo(0.5);
        expect(end.y).toBeCloseTo(0);
    });

    it('fades presence in and out', () => {
        expect(evaluate(pan, 0).finger.presence).toBe(0);
        expect(evaluate(pan, 200).finger.presence).toBe(1);
        expect(evaluate(pan, 1400).finger.presence).toBe(0);
    });
});

describe('evaluate sequence', () => {
    it('is idle during wait and after the end, holding the last position', () => {
        const s: Script = [...tap, { wait: 500 }];
        const f = evaluate(s, 1400 + 250);
        expect(f.finger.presence).toBe(0);
        expect(f.finger.down).toBe(false);
        expect(f.norm.x).toBeCloseTo(0.5);
        expect(evaluate(s, 5000).finger.age).toBe(Infinity);
    });

    it('is pure', () => {
        expect(evaluate(trackpadDemoScript, 2345)).toEqual(evaluate(trackpadDemoScript, 2345));
    });
});
