import { terrain } from './scene';

const S0 = 180;
const S1 = 640;
const D0 = 140;
const D1 = 330;
const STEP = 4;
const LEVELS = [3, 9, 15, 21, 27, 33, 39];

export type Contour = { level: number; index: boolean; d: string };

type Edge = 'top' | 'right' | 'bottom' | 'left';

/** Marching squares: bits are top-left 8, top-right 4, bottom-right 2, bottom-left 1. */
const SEGMENTS: Record<number, [Edge, Edge][]> = {
    1: [['left', 'bottom']],
    2: [['bottom', 'right']],
    3: [['left', 'right']],
    4: [['top', 'right']],
    5: [
        ['top', 'left'],
        ['bottom', 'right'],
    ],
    6: [['top', 'bottom']],
    7: [['top', 'left']],
    8: [['top', 'left']],
    9: [['top', 'bottom']],
    10: [
        ['top', 'right'],
        ['left', 'bottom'],
    ],
    11: [['top', 'right']],
    12: [['left', 'right']],
    13: [['bottom', 'right']],
    14: [['left', 'bottom']],
};

const sample = () => {
    const cols = Math.round((S1 - S0) / STEP) + 1;
    const rows = Math.round((D1 - D0) / STEP) + 1;

    return Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => terrain(S0 + c * STEP, D0 + r * STEP))
    );
};

const fmt = (value: number) => Math.round(value * 10) / 10;

const contourPath = (heights: number[][], level: number, mapY: (d: number) => number) => {
    const lerp = (a: number, b: number) => (level - a) / (b - a);
    let path = '';

    for (let r = 0; r < heights.length - 1; r++) {
        for (let c = 0; c < heights[r].length - 1; c++) {
            const [tl, tr, bl, br] = [heights[r][c], heights[r][c + 1], heights[r + 1][c], heights[r + 1][c + 1]];
            const code = (tl >= level ? 8 : 0) | (tr >= level ? 4 : 0) | (br >= level ? 2 : 0) | (bl >= level ? 1 : 0);
            const s = S0 + c * STEP;
            const d = D0 + r * STEP;
            const at: Record<Edge, [number, number]> = {
                top: [s + STEP * lerp(tl, tr), d],
                bottom: [s + STEP * lerp(bl, br), d + STEP],
                left: [s, d + STEP * lerp(tl, bl)],
                right: [s + STEP, d + STEP * lerp(tr, br)],
            };

            for (const [from, to] of SEGMENTS[code] ?? []) {
                path += `M${fmt(at[from][0])},${fmt(mapY(at[from][1]))}L${fmt(at[to][0])},${fmt(mapY(at[to][1]))}`;
            }
        }
    }

    return path;
};

/** Contour lines of the terrain in map coordinates. Computed once, not per frame. */
export const buildContours = (mapY: (d: number) => number): Contour[] => {
    const heights = sample();

    return LEVELS.map((level, i) => ({ level, index: i % 2 === 0, d: contourPath(heights, level, mapY) }));
};
