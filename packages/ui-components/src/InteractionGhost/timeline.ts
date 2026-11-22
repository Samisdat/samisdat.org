import { createSpline } from './spline';

import { scriptDevice } from './script';

import type { Finger, Frame, Phase, Point, Script, Step } from './script';

export const TAP_FADE_IN = 300;
export const TAP_DOWN_AT = 400;
export const TAP_DOWN_MS = 150;
export const TAP_FADE_OUT_AT = 1000;
export const TAP_TOTAL = 1400;
export const PAN_FADE = 200;
/** tilt in rad per norm unit */
export const TILT_RAD = 0.52;
/** the finger hovers this far above the target before touching down */
const HOVER_OFFSET = 0.1;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const prog = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
export const eio = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
const eout = (k: number) => 1 - Math.pow(1 - k, 3);

const ORIGIN: Point = [0, 0];

type Spline = ReturnType<typeof createSpline>;
type Path = { points: Point[]; ms: number; phase: Phase };

const isTap = (s: Step): s is Extract<Step, { tap: Point }> => 'tap' in s;
const isClick = (s: Step): s is Extract<Step, { click: Point }> => 'click' in s;

const pathOf = (step: Step): Path | undefined => {
    if ('pan' in step) {
        return { points: step.pan, ms: step.ms, phase: 'pan' };
    }
    if ('move' in step) {
        return { points: step.move, ms: step.ms, phase: 'move' };
    }
    if ('tilt' in step) {
        return { points: step.tilt, ms: step.ms, phase: 'tilt' };
    }
    return undefined;
};

export const stepDuration = (step: Step): number => {
    if (isTap(step) || isClick(step)) {
        return TAP_TOTAL;
    }
    const path = pathOf(step);
    if (path) {
        return path.ms + 2 * PAN_FADE;
    }
    return 'wait' in step ? step.wait : 0;
};

export const totalDuration = (script: Script): number => script.reduce((sum, s) => sum + stepDuration(s), 0);

type Ctx = { tilt: boolean };

const toFrame = (norm: Point, finger: Finger, phase: Phase | null, ctx: Ctx): Frame => {
    const frame: Frame = {
        norm: { x: norm[0], y: norm[1] },
        finger,
        phase,
        press: { down: finger.down, age: finger.age },
    };
    if (ctx.tilt || phase === 'tilt') {
        frame.tilt = { beta: norm[1] * TILT_RAD, gamma: norm[0] * TILT_RAD };
    }
    return frame;
};

const idle = (held: Point, ctx: Ctx): Frame =>
    toFrame(held, { x: held[0], y: held[1], presence: 0, down: false, age: Infinity }, null, ctx);

/** tap (finger hovers in) and click (mouse, no hover) share the same timing */
const pressFrame = (phase: 'tap' | 'click', target: Point, from: Point, t: number, ctx: Ctx): Frame => {
    const presence = prog(t, 0, TAP_FADE_IN) * (1 - prog(t, TAP_FADE_OUT_AT, TAP_TOTAL - 100));
    const down = t >= TAP_DOWN_AT && t < TAP_DOWN_AT + TAP_DOWN_MS;
    const hover = phase === 'tap' ? HOVER_OFFSET * (1 - prog(t, 0, TAP_FADE_IN)) : 0;
    const k = eout(prog(t, TAP_DOWN_AT, TAP_DOWN_AT + 150));
    const norm: Point = [lerp(from[0], target[0], k), lerp(from[1], target[1], k)];
    return toFrame(
        norm,
        {
            x: target[0],
            y: target[1] - hover,
            presence,
            down,
            age: t >= TAP_DOWN_AT ? t - TAP_DOWN_AT : Infinity,
        },
        phase,
        ctx
    );
};

const splines = new WeakMap<Step, Spline>();
const splineFor = (step: Step, points: Point[]) => {
    let spline = splines.get(step);
    if (!spline) {
        spline = createSpline(points);
        splines.set(step, spline);
    }
    return spline;
};

/** pan: pressed while moving. move/tilt: never pressed. */
const pathFrame = (step: Step, path: Path, held: Point, t: number, ctx: Ctx): Frame => {
    const moveEnd = PAN_FADE + path.ms;
    const p = splineFor(step, path.points).at(eio(prog(t, PAN_FADE, moveEnd)));
    const presence = prog(t, 0, PAN_FADE) * (1 - prog(t, moveEnd, moveEnd + PAN_FADE));
    const moving = t >= PAN_FADE && t < moveEnd;
    const pressed = path.phase === 'pan';
    return toFrame(
        t < PAN_FADE ? held : p,
        {
            x: p[0],
            y: p[1],
            presence,
            down: pressed && moving,
            age: pressed && t >= PAN_FADE ? t - PAN_FADE : Infinity,
        },
        path.phase,
        ctx
    );
};

const stepEnd = (step: Step, held: Point): Point => {
    if (isTap(step)) {
        return step.tap;
    }
    if (isClick(step)) {
        return step.click;
    }
    const path = pathOf(step);
    return path ? (path.points[path.points.length - 1] ?? held) : held;
};

const frameFor = (step: Step, held: Point, t: number, ctx: Ctx): Frame => {
    if (isTap(step)) {
        return pressFrame('tap', step.tap, held, t, ctx);
    }
    if (isClick(step)) {
        return pressFrame('click', step.click, held, t, ctx);
    }
    const path = pathOf(step);
    return path && path.points.length > 0 ? pathFrame(step, path, held, t, ctx) : idle(held, ctx);
};

/** Pure: the ghost's state at script time tMs. Holds the last norm after the end. */
export const evaluate = (script: Script, tMs: number): Frame => {
    const ctx: Ctx = { tilt: scriptDevice(script) === 'tilt' };
    let held: Point = ORIGIN;
    let start = 0;
    for (const step of script) {
        const duration = stepDuration(step);
        const t = tMs - start;
        if (t < duration) {
            return t < 0 ? idle(held, ctx) : frameFor(step, held, t, ctx);
        }
        held = stepEnd(step, held);
        start += duration;
    }
    return idle(held, ctx);
};

/** A diamond at `at` or a bar from `from` to `to`, in seconds of script time. */
export type Mark = { at: number; label?: string } | { from: number; to: number; label: string };

const PATH_LABELS: Record<'pan' | 'move' | 'tilt', string> = { pan: 'Pan', move: 'Bewegen', tilt: 'Kippen' };

/** Timeline marks: tap/click at the down moment, paths from first to last movement (fades excluded). */
export const marksFromScript = (script: Script): Mark[] => {
    const marks: Mark[] = [];
    let start = 0;
    for (const step of script) {
        if (isTap(step)) {
            marks.push({ at: (start + TAP_DOWN_AT) / 1000, label: 'Tap' });
        } else if (isClick(step)) {
            marks.push({ at: (start + TAP_DOWN_AT) / 1000, label: 'Klick' });
        } else {
            const path = pathOf(step);
            if (path) {
                marks.push({
                    from: (start + PAN_FADE) / 1000,
                    to: (start + PAN_FADE + path.ms) / 1000,
                    label: PATH_LABELS[path.phase as keyof typeof PATH_LABELS],
                });
            }
        }
        start += stepDuration(step);
    }
    return marks;
};
