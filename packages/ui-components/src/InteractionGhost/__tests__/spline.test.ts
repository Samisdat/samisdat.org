import { describe, expect, it } from 'vitest';

import { createSpline } from '../spline';

import type { Point } from '../script';

const waypoints: Point[] = [
    [-0.6, 0.45],
    [-0.1, -0.2],
    [0.6, 0.3],
];

const dist = (a: Point, b: Point) => Math.hypot(a[0] - b[0], a[1] - b[1]);

describe('createSpline', () => {
    it('starts and ends at the outer waypoints', () => {
        const s = createSpline(waypoints);
        expect(s.at(0)).toEqual(waypoints[0]);
        const end = s.at(1);
        expect(end[0]).toBeCloseTo(0.6, 10);
        expect(end[1]).toBeCloseTo(0.3, 10);
    });

    it('passes through the inner waypoint', () => {
        const s = createSpline(waypoints);
        let min = Infinity;
        for (let i = 0; i <= 2000; i++) {
            min = Math.min(min, dist(s.at(i / 2000), waypoints[1]));
        }
        expect(min).toBeLessThan(0.002);
    });

    it('moves with constant speed (arc length)', () => {
        const s = createSpline(waypoints);
        const n = 100;
        const steps: number[] = [];
        for (let i = 0; i < n; i++) {
            steps.push(dist(s.at(i / n), s.at((i + 1) / n)));
        }
        const mean = steps.reduce((a, b) => a + b, 0) / n;
        for (const d of steps) {
            expect(Math.abs(d - mean) / mean).toBeLessThan(0.05);
        }
    });

    it('is smooth: no sharp direction changes', () => {
        const s = createSpline(waypoints);
        const n = 200;
        for (let i = 1; i < n; i++) {
            const a = s.at((i - 1) / n);
            const b = s.at(i / n);
            const c = s.at((i + 1) / n);
            const v1: Point = [b[0] - a[0], b[1] - a[1]];
            const v2: Point = [c[0] - b[0], c[1] - b[1]];
            const cos = (v1[0] * v2[0] + v1[1] * v2[1]) / (Math.hypot(...v1) * Math.hypot(...v2));
            expect(cos).toBeGreaterThan(0.95);
        }
    });

    it('handles one and two points', () => {
        expect(createSpline([[0.2, 0.3]]).at(0.5)).toEqual([0.2, 0.3]);
        const mid = createSpline([
            [0, 0],
            [1, 1],
        ]).at(0.5);
        expect(mid[0]).toBeCloseTo(0.5, 6);
        expect(mid[1]).toBeCloseTo(0.5, 6);
    });
});
