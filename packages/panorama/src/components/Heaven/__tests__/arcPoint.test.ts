import { describe, expect, it } from 'vitest';

import { ARC_END, ARC_START, seasonalPoint } from '../arcPoint';

describe('seasonalPoint', () => {
    it('keeps both ends of the path in every season', () => {
        [0.5, 0.75, 1].forEach(factor => {
            expect(seasonalPoint(ARC_START, factor).y).toBeCloseTo(ARC_START.y);
            expect(seasonalPoint(ARC_END, factor).y).toBeCloseTo(ARC_END.y);
        });
    });

    it('leaves the path as it is at full height', () => {
        expect(seasonalPoint({ x: 850, y: 52 }, 1)).toEqual({ x: 850, y: 52 });
    });

    it('lowers the middle of the arc in winter', () => {
        expect(seasonalPoint({ x: 850, y: 52 }, 0.6).y).toBeGreaterThan(52);
    });
});
