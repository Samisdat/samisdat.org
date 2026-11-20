import type { Point } from './script';

export type Spline = {
    /** point at arc-length fraction u (0..1), evenly spaced in distance */
    at: (u: number) => Point;
    length: number;
};

const SAMPLES_PER_SEGMENT = 32;

const catmullRom = (p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point => {
    const t2 = t * t;
    const t3 = t2 * t;
    const axis = (i: 0 | 1) =>
        0.5 *
        (2 * p1[i] +
            (-p0[i] + p2[i]) * t +
            (2 * p0[i] - 5 * p1[i] + 4 * p2[i] - p3[i]) * t2 +
            (-p0[i] + 3 * p1[i] - 3 * p2[i] + p3[i]) * t3);
    return [axis(0), axis(1)];
};

const mirror = (a: Point, b: Point): Point => [2 * a[0] - b[0], 2 * a[1] - b[1]];

const dense = (points: Point[]): Point[] => {
    const first = points[0];
    const last = points[points.length - 1];
    const padded: Point[] = [mirror(first, points[1]), ...points, mirror(last, points[points.length - 2])];
    const out: Point[] = [first];
    for (let i = 1; i < padded.length - 2; i++) {
        for (let s = 1; s <= SAMPLES_PER_SEGMENT; s++) {
            out.push(catmullRom(padded[i - 1], padded[i], padded[i + 1], padded[i + 2], s / SAMPLES_PER_SEGMENT));
        }
    }
    return out;
};

/** Catmull-Rom spline through all points, sampled by constant arc length. */
export const createSpline = (points: Point[]): Spline => {
    if (points.length === 0) {
        throw new Error('createSpline needs at least one point');
    }
    if (points.length === 1) {
        return { at: () => points[0], length: 0 };
    }

    const samples = dense(points);
    const cumulative = [0];
    for (let i = 1; i < samples.length; i++) {
        cumulative.push(
            cumulative[i - 1] + Math.hypot(samples[i][0] - samples[i - 1][0], samples[i][1] - samples[i - 1][1])
        );
    }
    const length = cumulative[cumulative.length - 1];

    const at = (u: number): Point => {
        if (length === 0 || u <= 0) {
            return samples[0];
        }
        if (u >= 1) {
            return samples[samples.length - 1];
        }
        const target = u * length;
        let lo = 0;
        let hi = cumulative.length - 1;
        while (hi - lo > 1) {
            const mid = (lo + hi) >> 1;
            if (cumulative[mid] <= target) {
                lo = mid;
            } else {
                hi = mid;
            }
        }
        const span = cumulative[hi] - cumulative[lo];
        const k = span === 0 ? 0 : (target - cumulative[lo]) / span;
        return [
            samples[lo][0] + (samples[hi][0] - samples[lo][0]) * k,
            samples[lo][1] + (samples[hi][1] - samples[lo][1]) * k,
        ];
    };

    return { at, length };
};
