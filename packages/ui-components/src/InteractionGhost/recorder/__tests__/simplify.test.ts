import { describe, expect, it } from 'vitest';

import { simplify } from '../simplify';

import type { Point } from '../../script';

describe('simplify', () => {
    it('keeps a straight line as two points', () => {
        const line: Point[] = Array.from({ length: 30 }, (_, i) => [i / 29, i / 29]);
        expect(simplify(line)).toEqual([
            [0, 0],
            [1, 1],
        ]);
    });

    it('keeps the shape of a curve', () => {
        const arc: Point[] = Array.from({ length: 60 }, (_, i) => {
            const a = (i / 59) * Math.PI;
            return [Math.cos(a), Math.sin(a)];
        });
        const out = simplify(arc);
        expect(out.length).toBeGreaterThan(3);
        expect(out.length).toBeLessThanOrEqual(12);
        expect(out[0]).toEqual([1, 0]);
        expect(out[out.length - 1]).toEqual([-1, 0]);
        expect(out.some(([x, y]) => Math.abs(x) < 0.2 && y > 0.9)).toBe(true);
    });

    it('smooths noise on a line', () => {
        const noisy: Point[] = Array.from({ length: 40 }, (_, i) => [i / 39, i % 2 === 0 ? 0.004 : -0.004]);
        expect(simplify(noisy)).toHaveLength(2);
    });

    it('enforces maxPoints by growing the tolerance', () => {
        const zigzag: Point[] = Array.from({ length: 100 }, (_, i) => [i / 99, i % 2 === 0 ? 0.5 : -0.5]);
        const out = simplify(zigzag, { maxPoints: 6 });
        expect(out.length).toBeLessThanOrEqual(6);
        expect(out[0][0]).toBe(0);
        expect(out[out.length - 1][0]).toBe(1);
    });

    it('rounds to two decimals and handles short input', () => {
        expect(simplify([[0.12345, -0.98765]])).toEqual([[0.12, -0.99]]);
        expect(simplify([])).toEqual([]);
    });
});
