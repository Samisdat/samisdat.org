import { describe, expect, it } from 'vitest';

import { mouseDemoScript, tiltDemoScript, touchDemoScript } from '../deviceDemoScripts';
import { defineScript, scriptDevice } from '../script';
import { evaluate, marksFromScript, totalDuration } from '../timeline';
import { padDemoScript, trackpadDemoScript } from '../trackpadDemoScript';

import type { Script } from '../script';

const click: Script = [{ click: [0.5, -0.5] }];
const move: Script = [
    {
        move: [
            [-0.5, 0],
            [0, 0.5],
            [0.5, 0],
        ],
        ms: 1000,
    },
];
const tilt = defineScript('tilt', [
    {
        tilt: [
            [-1, 0],
            [0, 1],
            [1, 0],
        ],
        ms: 1000,
    },
]);

describe('device', () => {
    it('defaults to pad and reads the declared device', () => {
        expect(scriptDevice([{ wait: 1 }])).toBe('pad');
        expect(scriptDevice(padDemoScript)).toBe('pad');
        expect(scriptDevice(mouseDemoScript)).toBe('mouse');
        expect(scriptDevice(touchDemoScript)).toBe('touch');
        expect(scriptDevice(tiltDemoScript)).toBe('tilt');
    });

    it('keeps the trackpadDemoScript alias', () => {
        expect(trackpadDemoScript).toBe(padDemoScript);
    });
});

describe('evaluate click', () => {
    it('presses briefly at ~400 ms with press and age', () => {
        expect(evaluate(click, 399).press).toEqual({ down: false, age: Infinity });
        expect(evaluate(click, 450).press).toEqual({ down: true, age: 50 });
        expect(evaluate(click, 560).press?.down).toBe(false);
        expect(evaluate(click, 700).finger.age).toBe(300);
        expect(evaluate(click, 450).phase).toBe('click');
    });

    it('fades presence and has no hover offset', () => {
        expect(evaluate(click, 0).finger.presence).toBe(0);
        expect(evaluate(click, 300).finger.presence).toBe(1);
        expect(evaluate(click, 1300).finger.presence).toBeLessThan(0.01);
        expect(evaluate(click, 0).finger.y).toBe(-0.5);
    });

    it('jumps norm to the target and holds it', () => {
        const f = evaluate(click, 1000);
        expect(f.norm.x).toBeCloseTo(0.5);
        expect(f.norm.y).toBeCloseTo(-0.5);
        expect(f.tilt).toBeUndefined();
    });
});

describe('evaluate move', () => {
    it('follows the path without ever pressing', () => {
        for (const t of [0, 200, 700, 1200, 1400]) {
            const f = evaluate(move, t);
            expect(f.finger.down).toBe(false);
            expect(f.press).toEqual({ down: false, age: Infinity });
        }
        expect(evaluate(move, 700).phase).toBe('move');
    });

    it('starts and ends at the outer waypoints, norm follows only during motion', () => {
        expect(evaluate(move, 200).finger.x).toBeCloseTo(-0.5);
        expect(evaluate(move, 1200).finger.x).toBeCloseTo(0.5);
        expect(evaluate(move, 100).norm).toEqual({ x: 0, y: 0 });
        expect(evaluate(move, 1200).norm.x).toBeCloseTo(0.5);
    });

    it('fades presence in and out', () => {
        expect(evaluate(move, 0).finger.presence).toBe(0);
        expect(evaluate(move, 200).finger.presence).toBe(1);
        expect(evaluate(move, 1400).finger.presence).toBe(0);
    });
});

describe('evaluate tilt', () => {
    it('maps norm to beta/gamma with 0.52 rad per unit', () => {
        const f = evaluate(tilt, 1200);
        expect(f.phase).toBe('tilt');
        expect(f.norm.x).toBeCloseTo(1);
        expect(f.tilt?.gamma).toBeCloseTo(0.52);
        expect(f.tilt?.beta).toBeCloseTo(0);
        const mid = evaluate(tilt, 700);
        expect(mid.tilt?.beta).toBeCloseTo(mid.norm.y * 0.52);
        expect(mid.tilt?.gamma).toBeCloseTo(mid.norm.x * 0.52);
    });

    it('stays tilted after the end and reports tilt for idle frames of tilt scripts', () => {
        const f = evaluate(tilt, 99999);
        expect(f.phase).toBeNull();
        expect(f.tilt?.gamma).toBeCloseTo(0.52);
        expect(evaluate(tilt, 0).tilt).toEqual({ beta: 0, gamma: 0 });
    });

    it('sets tilt for a tilt step in a non-tilt script, but not for other frames', () => {
        const f = evaluate(
            [
                {
                    tilt: [
                        [0.5, 0.5],
                        [1, 1],
                    ],
                    ms: 500,
                },
            ],
            400
        );
        expect(f.tilt).toBeDefined();
        expect(evaluate([{ wait: 100 }], 50).tilt).toBeUndefined();
    });
});

describe('press on existing steps', () => {
    it('mirrors finger.down/age for tap and pan', () => {
        const f = evaluate(padDemoScript, 450);
        expect(f.press).toEqual({ down: f.finger.down, age: f.finger.age });
        const p = evaluate(padDemoScript, 1400 + 700);
        expect(p.press?.down).toBe(true);
    });
});

describe('total duration', () => {
    it('adds click and path steps', () => {
        expect(totalDuration(click)).toBe(1400);
        expect(totalDuration(move)).toBe(1400);
        expect(totalDuration(tilt)).toBe(1400);
    });

    it('demo scripts last 4 to 7 s', () => {
        expect(totalDuration(padDemoScript)).toBe(4000);
        expect(totalDuration(touchDemoScript)).toBe(5400);
        expect(totalDuration(tiltDemoScript)).toBe(5600);
        for (const s of [padDemoScript, touchDemoScript, tiltDemoScript]) {
            expect(totalDuration(s)).toBeGreaterThanOrEqual(4000);
            expect(totalDuration(s)).toBeLessThanOrEqual(7000);
        }
    });

    it('the generated mouse demo is longer: four organic moves', () => {
        expect(totalDuration(mouseDemoScript)).toBeGreaterThan(7000);
    });
});

describe('marksFromScript', () => {
    it('marks tap/click at the down moment and paths as bars without fades', () => {
        expect(marksFromScript(padDemoScript)).toEqual([
            { at: 0.4, label: 'Tap' },
            { from: 1.6, to: 3.2, label: 'Pan' },
        ]);
        expect(marksFromScript(mouseDemoScript).map(mark => mark.label)).toEqual([
            'Bewegen',
            'Bewegen',
            'Bewegen',
            'Bewegen',
        ]);
    });

    it('labels tilt as Kippen and offsets by preceding waits', () => {
        expect(marksFromScript(tiltDemoScript)).toEqual([{ from: 0.6, to: 5, label: 'Kippen' }]);
        expect(marksFromScript([])).toEqual([]);
    });

    it('matches the timeline: down moment of a mark is pressed, bar start is movement start', () => {
        const marks = marksFromScript(touchDemoScript);
        const tapMark = marks[0] as { at: number };
        expect(evaluate(touchDemoScript, (tapMark.at + 0.01) * 1000).finger.down).toBe(true);
        const bar = marks[1] as { from: number; to: number };
        expect(evaluate(touchDemoScript, (bar.from + 0.05) * 1000).finger.down).toBe(true);
        expect(evaluate(touchDemoScript, (bar.to + 0.05) * 1000).finger.down).toBe(false);
    });
});
