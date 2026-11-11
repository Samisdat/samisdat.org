import { describe, expect, it } from 'vitest';

import { createTakeoverDetector, TAKEOVER_DISTANCE } from '../takeover';

describe('createTakeoverDetector', () => {
    it('defaults to 6 px', () => {
        expect(TAKEOVER_DISTANCE).toBe(6);
    });

    it('does not trigger on the first event (no path yet)', () => {
        const d = createTakeoverDetector(6);
        expect(d.move(500, 500)).toBe(false);
    });

    it('sums travelled distance across events', () => {
        const d = createTakeoverDetector(6);
        d.move(0, 0);
        expect(d.move(3, 0)).toBe(false);
        expect(d.move(3, 3)).toBe(false);
        expect(d.move(3, 4)).toBe(true);
    });

    it('needs strictly more than the threshold', () => {
        const d = createTakeoverDetector(6);
        d.move(0, 0);
        expect(d.move(6, 0)).toBe(false);
        expect(d.move(7, 0)).toBe(true);
    });

    it('ignores synthetic events without travel', () => {
        const d = createTakeoverDetector(6);
        d.move(100, 100);
        for (let i = 0; i < 50; i++) expect(d.move(100, 100)).toBe(false);
    });

    it('starts over after reset', () => {
        const d = createTakeoverDetector(6);
        d.move(0, 0);
        d.move(5, 0);
        d.reset();
        expect(d.move(100, 0)).toBe(false);
        expect(d.move(103, 0)).toBe(false);
    });
});
