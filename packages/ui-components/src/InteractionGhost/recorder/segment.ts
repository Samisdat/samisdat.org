import { simplify } from './simplify';

import type { Device, Point, Step } from '../script';
import type { RecordedEvent, SegmentOptions, SimplifyOptions } from './types';

type Gesture = { start: number; end: number; step: Step };

const pathLength = (points: readonly Point[]) =>
    points.reduce((sum, p, i) => (i === 0 ? 0 : sum + Math.hypot(p[0] - points[i - 1][0], p[1] - points[i - 1][1])), 0);

const toPoint = (e: RecordedEvent): Point => [e.x, e.y];

/** Down ... up on pad / touch: tap if barely moved and short, pan otherwise. */
const pressGestures = (events: readonly RecordedEvent[], opts: Required<SegmentOptions> & SimplifyOptions) => {
    const gestures: Gesture[] = [];
    let current: RecordedEvent[] | null = null;
    const finish = () => {
        if (!current) {
            return;
        }
        const start = current[0].t;
        const end = current[current.length - 1].t;
        const points = current.map(toPoint);
        const ms = Math.round(end - start);
        const isTap = pathLength(points) < opts.tapTravel && end - start < opts.tapMaxMs;
        const step: Step = isTap ? { tap: simplify([points[0]])[0] } : { pan: simplify(points, opts), ms };
        gestures.push({ start, end, step });
        current = null;
    };
    for (const e of events) {
        if (e.type === 'down') {
            finish();
            current = [e];
        } else if (current && (e.type === 'move' || e.type === 'up')) {
            current.push(e);
            if (e.type === 'up') {
                finish();
            }
        }
    }
    finish();
    return gestures;
};

/** Mouse: runs of move events (split at pauses) and clicks. */
const mouseGestures = (events: readonly RecordedEvent[], opts: Required<SegmentOptions> & SimplifyOptions) => {
    const gestures: Gesture[] = [];
    let run: RecordedEvent[] = [];
    const flush = () => {
        if (run.length >= 2) {
            const start = run[0].t;
            const end = run[run.length - 1].t;
            gestures.push({
                start,
                end,
                step: { move: simplify(run.map(toPoint), opts), ms: Math.round(end - start) },
            });
        }
        run = [];
    };
    for (const e of events) {
        if (e.type === 'click') {
            flush();
            gestures.push({ start: e.t, end: e.t, step: { click: simplify([toPoint(e)])[0] } });
        } else if (e.type === 'move') {
            if (run.length > 0 && e.t - run[run.length - 1].t > opts.pauseMs) {
                flush();
            }
            run.push(e);
        }
    }
    flush();
    return gestures;
};

/** Turns raw pointer events of one session into script steps, with waits for pauses. */
export const segment = (
    events: readonly RecordedEvent[],
    device: Device,
    options: SegmentOptions & SimplifyOptions = {}
): Step[] => {
    const opts = { pauseMs: 400, tapTravel: 0.04, tapMaxMs: 300, ...options };
    const sorted = [...events].sort((a, b) => a.t - b.t);
    const gestures = device === 'mouse' ? mouseGestures(sorted, opts) : pressGestures(sorted, opts);
    gestures.sort((a, b) => a.start - b.start);

    const steps: Step[] = [];
    gestures.forEach((g, i) => {
        if (i > 0) {
            const gap = g.start - gestures[i - 1].end;
            if (gap > opts.pauseMs) {
                steps.push({ wait: Math.round(gap) });
            }
        }
        steps.push(g.step);
    });
    return steps;
};
