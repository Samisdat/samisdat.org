import { describe, expect, it } from 'vitest';

import { buildContours } from '../rays/contours';
import { cone, F, HALF, OBJECTS, OY, project, ridge, sight, terrain, wedgeArc, XMAX, XMIN, YB } from '../rays/scene';
import { createRaysState } from '../rays/state';

const wedgeAngle = (tx: number, index: number) => {
    const o = OBJECTS[index];
    const { eye, target } = sight(tx, o);
    const now = Math.atan2(target[1] - eye[1], target[0] - eye[0]);
    const before = Math.atan2(target[1] - eye[1], target[0] - (eye[0] - 55));

    return Math.abs(now - before);
};

describe('rays scene', () => {
    it('F fills exactly 800 px across ±HALF', () => {
        expect(F * Math.tan(HALF)).toBeCloseTo(400);
    });

    it('terrain peaks near the hill and vanishes far away', () => {
        expect(terrain(400, 228)).toBeGreaterThan(25);
        expect(terrain(0, 0)).toBeCloseTo(0, 5);
    });

    it('an object on the cone axis projects onto the centre line', () => {
        const tree = OBJECTS.find(o => o.k === 'tree')!;
        expect(project(tree.s, tree).x).toBeCloseTo(400);
        expect(project(tree.s - 30, tree).x).toBeGreaterThan(400);
    });

    it('near trees sweep a larger angle than the hill, equal speed', () => {
        const hill = OBJECTS.findIndex(o => o.k === 'hill');
        const tree = OBJECTS.findIndex(o => o.k === 'tree');
        // the train is abeam of the first tree
        expect(wedgeAngle(150, tree)).toBeGreaterThan(wedgeAngle(150, hill) * 2);
    });

    it('wedgeArc takes the short way round the ±π seam', () => {
        const cw = wedgeArc(0, 0, 10, 3.0, -3.0);
        expect(cw).toContain('0 0 1');
    });

    it('sight rays start at the eye on the tracks', () => {
        expect(sight(200, OBJECTS[0]).eye).toEqual([200, OY]);
    });

    it('the cone opens to both sides of the view direction', () => {
        const path = cone(400);
        expect(path.startsWith('M400,315L')).toBe(true);
    });

    it('ridge is a closed path from the foot line and rises where the hill is', () => {
        const at = (tx: number) => ridge(tx, 150, 330);
        expect(at(400).startsWith(`M0,${Math.round(YB * 100) / 100}`)).toBe(true);
        expect(at(400).endsWith('Z')).toBe(true);
        expect(at(400)).not.toBe(at(XMIN));
    });
});

describe('contours', () => {
    it('builds one path per level around the hill', () => {
        const contours = buildContours(d => OY - d);
        expect(contours).toHaveLength(7);
        // the hill is not high enough for the top levels, the lower ones all exist
        expect(contours.slice(0, 5).every(c => c.d.startsWith('M'))).toBe(true);
        expect(contours.filter(c => c.index)).toHaveLength(4);
    });
});

describe('rays state', () => {
    it('advances only while playing and loops at XMAX', () => {
        const state = createRaysState(false);
        state.tick(1);
        expect(state.tx).toBe(XMIN);

        state.setPlaying(true);
        state.tick(1);
        expect(state.tx).toBeCloseTo(XMIN + 110);

        state.set(XMAX - 1);
        state.tick(0.05);
        expect(state.tx).toBe(XMIN);
    });

    it('notifies subscribers right away and on change, and stops after unsubscribe', () => {
        const state = createRaysState(true);
        const seen: number[] = [];
        const off = state.subscribe(tx => seen.push(tx));
        state.tick(0.1);
        off();
        state.tick(0.1);

        expect(seen).toHaveLength(2);
        expect(seen[0]).toBe(XMIN);
    });
});
