import type { Point } from '../script';
import type { SimplifyOptions } from './types';

const round2 = (n: number) => {
    const r = Math.round(n * 100) / 100;
    return r === 0 ? 0 : r;
};

const distanceToSegment = (p: Point, a: Point, b: Point): number => {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const lengthSq = dx * dx + dy * dy;
    if (lengthSq === 0) {
        return Math.hypot(p[0] - a[0], p[1] - a[1]);
    }
    const k = Math.min(1, Math.max(0, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / lengthSq));
    return Math.hypot(p[0] - (a[0] + k * dx), p[1] - (a[1] + k * dy));
};

/** Indices (sorted) of the points Ramer-Douglas-Peucker keeps. */
const rdp = (points: readonly Point[], tolerance: number): number[] => {
    const keep = new Set<number>([0, points.length - 1]);
    const stack: Array<[number, number]> = [[0, points.length - 1]];
    while (stack.length > 0) {
        const [from, to] = stack.pop() as [number, number];
        let worst = -1;
        let worstDistance = tolerance;
        for (let i = from + 1; i < to; i++) {
            const d = distanceToSegment(points[i], points[from], points[to]);
            if (d > worstDistance) {
                worst = i;
                worstDistance = d;
            }
        }
        if (worst !== -1) {
            keep.add(worst);
            stack.push([from, worst], [worst, to]);
        }
    }
    return [...keep].sort((a, b) => a - b);
};

/**
 * Ramer-Douglas-Peucker. If more than `maxPoints` survive, the tolerance grows
 * stepwise until the limit holds. First and last point stay; output is rounded to 2 decimals.
 */
export const simplify = (
    points: readonly Point[],
    { tolerance = 0.03, maxPoints = 12 }: SimplifyOptions = {}
): Point[] => {
    if (points.length <= 2) {
        return points.map(([x, y]) => [round2(x), round2(y)]);
    }
    const limit = Math.max(2, Math.floor(maxPoints));
    let tol = Math.max(tolerance, 0);
    let kept = rdp(points, tol);
    while (kept.length > limit) {
        tol = tol === 0 ? 0.005 : tol * 1.25;
        kept = rdp(points, tol);
    }
    return kept.map(i => [round2(points[i][0]), round2(points[i][1])]);
};

export { round2 };
