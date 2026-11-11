import { createSpline } from './spline';

import type { Finger, Frame, PanStep, Point, Script, Step, TapStep } from './script';

export const TAP_FADE_IN = 300;
export const TAP_DOWN_AT = 400;
export const TAP_DOWN_MS = 150;
export const TAP_FADE_OUT_AT = 1000;
export const TAP_TOTAL = 1400;
export const PAN_FADE = 200;
/** the finger hovers this far above the target before touching down */
const HOVER_OFFSET = 0.1;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const prog = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
export const eio = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
const eout = (k: number) => 1 - Math.pow(1 - k, 3);

const ORIGIN: Point = [0, 0];

const isTap = (s: Step): s is TapStep => 'tap' in s;
const isPan = (s: Step): s is PanStep => 'pan' in s;

export const stepDuration = (step: Step): number => {
    if (isTap(step)) {
        return TAP_TOTAL;
    }
    if (isPan(step)) {
        return step.ms + 2 * PAN_FADE;
    }
    return step.wait;
};

export const totalDuration = (script: Script): number => script.reduce((sum, s) => sum + stepDuration(s), 0);

const toFrame = (norm: Point, finger: Finger): Frame => ({
    norm: { x: norm[0], y: norm[1] },
    finger,
});

const idle = (at: Point, held: Point): Frame =>
    toFrame(held, { x: at[0], y: at[1], presence: 0, down: false, age: Infinity });

const tapFrame = (target: Point, from: Point, t: number): Frame => {
    const presence = prog(t, 0, TAP_FADE_IN) * (1 - prog(t, TAP_FADE_OUT_AT, TAP_TOTAL - 100));
    const down = t >= TAP_DOWN_AT && t < TAP_DOWN_AT + TAP_DOWN_MS;
    const hover = HOVER_OFFSET * (1 - prog(t, 0, TAP_FADE_IN));
    const k = eout(prog(t, TAP_DOWN_AT, TAP_DOWN_AT + 150));
    const norm: Point = [lerp(from[0], target[0], k), lerp(from[1], target[1], k)];
    return toFrame(norm, {
        x: target[0],
        y: target[1] - hover,
        presence,
        down,
        age: t >= TAP_DOWN_AT ? t - TAP_DOWN_AT : Infinity,
    });
};

const splines = new WeakMap<PanStep, ReturnType<typeof createSpline>>();
const splineFor = (step: PanStep) => {
    let spline = splines.get(step);
    if (!spline) {
        spline = createSpline(step.pan);
        splines.set(step, spline);
    }
    return spline;
};

const panFrame = (step: PanStep, held: Point, t: number): Frame => {
    const spline = splineFor(step);
    const moveEnd = PAN_FADE + step.ms;
    const k = eio(prog(t, PAN_FADE, moveEnd));
    const p = spline.at(k);
    const presence = prog(t, 0, PAN_FADE) * (1 - prog(t, moveEnd, moveEnd + PAN_FADE));
    const down = t >= PAN_FADE && t < moveEnd;
    return toFrame(t < PAN_FADE ? held : p, {
        x: p[0],
        y: p[1],
        presence,
        down,
        age: t >= PAN_FADE ? t - PAN_FADE : Infinity,
    });
};

const stepEnd = (step: Step, held: Point): Point => {
    if (isTap(step)) {
        return step.tap;
    }
    if (isPan(step)) {
        return step.pan[step.pan.length - 1] ?? held;
    }
    return held;
};

/** Pure: the ghost's state at script time tMs. Holds the last norm after the end. */
export const evaluate = (script: Script, tMs: number): Frame => {
    let held: Point = ORIGIN;
    let start = 0;
    for (const step of script) {
        const duration = stepDuration(step);
        const t = tMs - start;
        if (t < duration) {
            if (t < 0) {
                break;
            }
            if (isTap(step)) {
                return tapFrame(step.tap, held, t);
            }
            if (isPan(step) && step.pan.length > 0) {
                return panFrame(step, held, t);
            }
            return idle(held, held);
        }
        held = stepEnd(step, held);
        start += duration;
    }
    return idle(held, held);
};
