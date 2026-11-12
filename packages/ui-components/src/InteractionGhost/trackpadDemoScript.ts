import { defineScript } from './script';

export const padDemoScript = defineScript('pad', [
    { tap: [0.55, -0.5] },
    {
        pan: [
            [-0.6, 0.45],
            [-0.1, -0.2],
            [0.6, 0.3],
        ],
        ms: 1600,
    },
    { wait: 600 },
]);

/** @deprecated alias of padDemoScript */
export const trackpadDemoScript = padDemoScript;
