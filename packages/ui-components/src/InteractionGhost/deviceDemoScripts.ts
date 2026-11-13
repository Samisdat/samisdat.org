import { glide, ring, sway } from './generatePath';
import { defineScript } from './script';

const last = <T>(list: T[]) => list[list.length - 1];

// generated, to compare with the recording below: left and right, up and down, one slow open circle, home
const swayX = sway('x', [-0.6, 0.64], { seed: 3 });
const swayY = sway('y', [-0.55, 0.58], { from: last(swayX), seed: 7 });
const circle = ring({ from: last(swayY), seed: 11 });
const home = glide(last(circle), [0, 0], { seed: 5 });

/** 17.5 s: wait, calm left/right, calm up/down, slow open circle, back to the center, wait */
export const mouseDemoScript = defineScript('mouse', [
    { wait: 200 },
    { move: swayX, ms: 4000 },
    { move: swayY, ms: 4000 },
    { move: circle, ms: 7500 },
    { move: home, ms: 1600 },
    { wait: 200 },
]);

/** 8 s: the path recorded with the ghost recorder, kept to compare with the generated one */
export const mouseRecordedScript = defineScript('mouse', [
    { wait: 250 },
    {
        move: [
            [0, 0],
            [-0.27, -0.27],
            [-0.79, -0.14],
            [-0.82, 0.39],
            [-0.69, 0.66],
            [-0.03, 0.84],
            [0.87, 0.84],
            [0.8, -0.81],
            [0.83, 0.55],
            [0.87, -0.63],
            [0.83, 0.38],
        ],
        ms: 7500,
    },
    {
        move: [
            [0.783, 0.38],
            [0.16, -0.86],
        ],
        ms: 500,
    },
]);

/** 5.4 s: tap, curvy pan, tap */
export const touchDemoScript = defineScript('touch', [
    { tap: [-0.55, -0.4] },
    {
        pan: [
            [0.5, 0.45],
            [0.1, -0.1],
            [-0.45, 0.2],
            [0.4, -0.45],
        ],
        ms: 1800,
    },
    { tap: [0.4, -0.45] },
    { wait: 400 },
]);

/** 5.6 s: tilt along a figure-eight like path, then back to level */
export const tiltDemoScript = defineScript('tilt', [
    { wait: 400 },
    {
        tilt: [
            [0, 0],
            [0.6, -0.4],
            [0.1, 0.5],
            [-0.6, -0.3],
            [-0.2, 0.45],
            [0, 0],
        ],
        ms: 4400,
    },
    { wait: 400 },
]);
