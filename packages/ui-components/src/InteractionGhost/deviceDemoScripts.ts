import { defineScript } from './script';

/** 5.4 s: click, curvy pointer move, second click */
export const mouseDemoScript = defineScript('mouse', [
    { click: [-0.5, 0.35] },
    {
        move: [
            [-0.5, 0.35],
            [-0.15, -0.4],
            [0.3, 0.25],
            [0.65, -0.3],
        ],
        ms: 1800,
    },
    { click: [0.65, -0.3] },
    { wait: 400 },
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
