import { describe, expect, it } from 'vitest';

import { mouseDemoScript } from '../deviceDemoScripts';
import { glide, noise, ring, sway } from '../generatePath';
import { totalDuration } from '../timeline';

const radius = ([x, y]: [number, number]) => Math.hypot(x, y);

describe('generated paths', () => {
    it('noise is deterministic and stays within -1..1', () => {
        for (let i = 0; i < 50; i++) {
            expect(noise(i, 3)).toBe(noise(i, 3));
            expect(Math.abs(noise(i, 3))).toBeLessThanOrEqual(1);
        }
    });

    it('sway starts at the origin, swings to both sides and ends near the center', () => {
        const path = sway('x', [-0.6, 0.65]);

        expect(path[0]).toEqual([0, 0]);
        expect(Math.min(...path.map(([x]) => x))).toBeLessThan(-0.4);
        expect(Math.max(...path.map(([x]) => x))).toBeGreaterThan(0.4);
        expect(radius(path.at(-1) as [number, number])).toBeLessThan(0.1);
    });

    it('sway bows away from its axis on alternating sides, so it is never a straight line on the axis', () => {
        const alongX = sway('x', [-0.6, 0.65]);
        const alongY = sway('y', [-0.55, 0.6]);

        expect(Math.max(...alongX.map(([, y]) => Math.abs(y)))).toBeGreaterThan(0.1);
        expect(Math.max(...alongY.map(([x]) => Math.abs(x)))).toBeGreaterThan(0.1);
        expect(alongX.some(([, y]) => y > 0.05) && alongX.some(([, y]) => y < -0.05)).toBe(true);
    });

    it('glide bows a little between two points and ends exactly at the target', () => {
        const path = glide([0.4, -0.3], [0, 0]);

        expect(path[0]).toEqual([0.4, -0.3]);
        expect(path.at(-1)).toEqual([0, 0]);
        expect(path).toHaveLength(3);
        // the middle point is not on the straight line between the two
        const [mx, my] = path[1];
        expect(Math.abs(mx * -0.3 - my * 0.4)).toBeGreaterThan(0.01);
    });

    it('sway on y moves vertically and continues from a given start', () => {
        const path = sway('y', [-0.5, 0.5], { from: [0.04, 0.03] });

        expect(path[0]).toEqual([0.04, 0.03]);
        expect(Math.min(...path.map(([, y]) => y))).toBeLessThan(-0.35);
        expect(Math.max(...path.map(([, y]) => y))).toBeGreaterThan(0.35);
    });

    it('ring is an open, uneven circle around the center', () => {
        const path = ring();
        const around = path.slice(1);
        const radii = around.map(radius);

        expect(path[0]).toEqual([0, 0]);
        expect(around[0]).not.toEqual(around.at(-1));
        expect(Math.max(...radii) - Math.min(...radii)).toBeGreaterThan(0.1);
        expect(around.some(([x]) => x > 0.4) && around.some(([x]) => x < -0.4)).toBe(true);
        expect(around.some(([, y]) => y > 0.3) && around.some(([, y]) => y < -0.3)).toBe(true);
    });

    it('the mouse demo script waits, sways left/right and up/down, circles, goes home and waits', () => {
        const kinds = mouseDemoScript.map(step => Object.keys(step)[0]);

        expect(kinds).toEqual(['wait', 'move', 'move', 'move', 'move', 'wait']);
        expect(mouseDemoScript.device).toBe('mouse');
        expect(totalDuration(mouseDemoScript)).toBeGreaterThan(15000);

        const moves = mouseDemoScript.flatMap(step => ('move' in step ? [step.move] : []));
        expect(moves.at(-1)?.at(-1)).toEqual([0, 0]);
    });
});
