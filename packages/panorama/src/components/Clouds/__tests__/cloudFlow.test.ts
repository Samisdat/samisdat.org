import { describe, expect, it } from 'vitest';

import { edgeY } from '../arcOutline';
import { flowOf, flowParts, halvesOf } from '../cloudFlow';
import { drawCloud } from '../cloudOutline';

const flow = flowOf({ seed: 43, type: 'cumulus' });

const bodyOf = (t: number, mass = 1) => {
    const parts = flowParts(flow, t, mass);

    return [...parts.tails, ...parts.row, ...parts.crown];
};

/** Height of the body above the level line at x. */
const heightAt = (t: number, x: number) =>
    bodyOf(t).reduce((highest, lobe) => Math.max(highest, flow.base - (edgeY(lobe, x) ?? flow.base)), 0);

describe('cloud flow', () => {
    it('is a function of time: the same t gives the same cloud', () => {
        expect(flowParts(flow, 75)).toEqual(flowParts(flow, 75));
    });

    it('changes its shape over time', () => {
        expect(drawCloud(flowParts(flow, 60)).body).not.toBe(drawCloud(flowParts(flow, 0)).body);
    });

    it('moves its lobes from the windward side (right) towards lee (left)', () => {
        const first = flowParts(flow, 0).row.map(({ cx }) => cx);
        const later = flowParts(flow, 5).row.map(({ cx }) => cx);
        const shared = first.filter(x => later.some(y => Math.abs(x - flow.speed * 5 - y) < 0.01));

        expect(shared.length).toBeGreaterThan(first.length / 2);
    });

    it('stands higher on the windward side than on the lee side', () => {
        const middle = flow.width / 2;
        let windward = 0;
        let lee = 0;

        for (let t = 0; t < 300; t += 10) {
            for (let d = 10; d < middle; d += 10) {
                windward += heightAt(t, middle + d);
                lee += heightAt(t, middle - d);
            }
        }

        expect(windward).toBeGreaterThan(lee);
    });

    it('blows its lobes up one by one as it forms', () => {
        const count = (mass: number) => flowParts(flow, 0, mass).row.length;

        expect(bodyOf(0, 0)).toHaveLength(0);
        expect(count(0.3)).toBeGreaterThan(0);
        expect(count(0.3)).toBeLessThan(count(1));
    });

    it('keeps light above the dark underside everywhere', () => {
        for (let t = 0; t < 300; t += 15) {
            const parts = flowParts(flow, t);

            parts.ups.forEach(up => {
                expect(flow.base - up.ry).toBeGreaterThan(flow.base - heightAt(t, up.cx));
            });
        }
    });

    it('parts into two halves that together cover the whole cloud', () => {
        const [left, right] = halvesOf(flow, 0.5);

        expect(left.from).toBe(0);
        expect(left.to).toBe(right.from);
        expect(right.to).toBe(flow.width);
        expect(flowParts(left, 30).row.length + flowParts(right, 30).row.length).toBeGreaterThan(0);
    });
});
