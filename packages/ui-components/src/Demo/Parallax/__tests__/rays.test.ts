import { describe, expect, it } from 'vitest';

import { buildContours } from '../rays/contours';
import { cone, F, HALF, HILLS, layerPath, layerX, OBJECTS, OY, project, sight, terrain, wedgeArc, XMAX, XMIN, YB } from '../rays/scene';
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
        expect(terrain(510, 228)).toBeGreaterThan(25);
        expect(terrain(290, 235)).toBeGreaterThan(22);
        expect(terrain(0, 0)).toBeCloseTo(0, 5);
    });

    it('the two hills sit the same distance from the opposite edges', () => {
        const hills = OBJECTS.filter(o => o.k === 'hill');
        expect(hills).toHaveLength(2);
        expect(hills[0].s).toBe(800 - hills[1].s);
        expect(hills[0].s).toBeGreaterThan(400);
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
    it('advances only while playing and drives there and back', () => {
        const state = createRaysState(false);
        state.tick(1);
        expect(state.tx).toBe(XMIN);

        state.setPlaying(true);
        state.tick(1);
        expect(state.tx).toBeCloseTo(XMIN + 110);

        // turns around at XMAX and keeps the overshoot: 5.5 units too far come back as 5.5 units in
        state.set(XMAX - 1);
        state.tick(0.05);
        expect(state.dir).toBe(-1);
        expect(state.tx).toBeCloseTo(XMAX - 4.5);

        state.tick(0.05);
        expect(state.tx).toBeCloseTo(XMAX - 10);

        // and again at XMIN
        state.set(XMIN + 1);
        state.tick(0.05);
        expect(state.dir).toBe(1);
        expect(state.tx).toBeCloseTo(XMIN + 4.5);
    });

    it('scales the speed', () => {
        const state = createRaysState(true);
        state.setSpeed(2);
        state.tick(1);
        expect(state.tx).toBeCloseTo(XMIN + 220);
    });

    it('wedges trail the movement in both directions', () => {
        const forward = sight(300, OBJECTS[2], 1).wedge;
        const back = sight(300, OBJECTS[2], -1).wedge;
        expect(forward).not.toBe(back);
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

describe('hill layers', () => {
    it('shift with the train: a nearer layer faster, the shape stays fixed', () => {
        const [main, narrow] = HILLS;
        expect(layerX(main.s, main)).toBeCloseTo(400);
        const shift = (h: typeof main) => layerX(0, h) - layerX(100, h);
        expect(shift(main)).toBeGreaterThan(shift(narrow));
        const path = layerPath(main);
        expect(path.startsWith(`M-500,${Math.round(YB * 100) / 100}`)).toBe(true);
        expect(path.endsWith('Z')).toBe(true);
        expect(path).not.toBe(layerPath(narrow));
    });
});
