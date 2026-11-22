import { createSpline } from './spline';

import type { Point, Script } from './script';

const SAMPLES = 24;

/** One path per tap (single point) and pan (sampled spline) step, in norm coordinates. */
export const scriptPaths = (script: Script): Point[][] =>
    script.flatMap((step): Point[][] => {
        if ('tap' in step) return [[step.tap]];
        if ('pan' in step && step.pan.length > 0) {
            const spline = createSpline(step.pan);
            return [Array.from({ length: SAMPLES + 1 }, (_, i) => spline.at(i / SAMPLES))];
        }
        return [];
    });
