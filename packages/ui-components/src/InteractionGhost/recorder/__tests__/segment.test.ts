import { describe, expect, it } from 'vitest';

import { segment } from '../segment';

import type { RecordedEvent } from '../types';

const ev = (type: RecordedEvent['type'], t: number, x: number, y: number): RecordedEvent => ({ type, t, x, y });

const drag = (t0: number, n = 20): RecordedEvent[] => [
    ev('down', t0, -0.5, 0),
    ...Array.from({ length: n }, (_, i) => ev('move', t0 + 10 + i * 20, -0.5 + (i + 1) / n, 0)),
    ev('up', t0 + 20 + n * 20, 0.5, 0),
];

describe('segment', () => {
    it('turns a short stationary press into a tap', () => {
        const steps = segment([ev('down', 0, 0.3, 0.3), ev('move', 50, 0.31, 0.3), ev('up', 120, 0.31, 0.3)], 'touch');
        expect(steps).toEqual([{ tap: [0.3, 0.3] }]);
    });

    it('turns a long stationary press into a pan, not a tap', () => {
        const steps = segment([ev('down', 0, 0, 0), ev('up', 800, 0, 0)], 'pad');
        expect(steps).toHaveLength(1);
        expect(steps[0]).toMatchObject({ ms: 800 });
    });

    it('turns down-move-up into a pan with real duration', () => {
        const steps = segment(drag(0), 'pad');
        expect(steps).toHaveLength(1);
        const step = steps[0] as { pan: number[][]; ms: number };
        expect(step.ms).toBe(420);
        expect(step.pan).toEqual([
            [-0.5, 0],
            [0.5, 0],
        ]);
    });

    it('records mouse moves and clicks, ignoring buttons events', () => {
        const steps = segment(
            [
                ev('move', 0, -0.5, 0),
                ev('move', 100, 0, 0),
                ev('move', 200, 0.5, 0),
                ev('down', 250, 0.5, 0),
                ev('click', 260, 0.5, 0),
                ev('up', 270, 0.5, 0),
            ],
            'mouse'
        );
        expect(steps).toEqual([
            {
                move: [
                    [-0.5, 0],
                    [0.5, 0],
                ],
                ms: 200,
            },
            { click: [0.5, 0] },
        ]);
    });

    it('inserts a wait only above the pause threshold', () => {
        const a = ev('click', 0, 0, 0);
        expect(segment([a, ev('click', 400, 0, 0)], 'mouse')).toHaveLength(2);
        expect(segment([a, ev('click', 401, 0, 0)], 'mouse')).toEqual([
            { click: [0, 0] },
            { wait: 401 },
            { click: [0, 0] },
        ]);
    });

    it('splits several gestures and measures the pause from the gesture end', () => {
        const steps = segment([...drag(0), ...drag(1500)], 'pad');
        expect(steps.map(s => Object.keys(s)[0])).toEqual(['pan', 'wait', 'pan']);
        expect(steps[1]).toEqual({ wait: 1080 });
    });

    it('splits a mouse move run at a pause', () => {
        const steps = segment(
            [ev('move', 0, 0, 0), ev('move', 100, 0.2, 0), ev('move', 1000, 0.4, 0), ev('move', 1100, 0.6, 0)],
            'mouse'
        );
        expect(steps.map(s => Object.keys(s)[0])).toEqual(['move', 'wait', 'move']);
    });

    it('returns no steps for no events', () => {
        expect(segment([], 'mouse')).toEqual([]);
    });
});
