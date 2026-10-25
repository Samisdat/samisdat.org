// Fluid type maths, kept free of next/font and React so plain Node code (snapshot scripts, vitest) can use it.
//
// One progress value --t (0 at the narrow, 1 at the wide end of the viewport range) drives every size.
// A size is stored as { min, max } in px (at root font size ROOT_PX); CSS gets it in rem, so the user's
// browser font size and zoom still scale it.

export const ROOT_PX = 20;

/** Viewport range the sizes move across, in rem (18rem = 360px, 64rem = 1280px at the 20px root). */
export const VIEWPORT_REM = { min: 18, max: 64 } as const;

/** Ratio of the type scale at the narrow and the wide end; the preset's own max ratio is derived from its h1/body. */
const RATIO = { min: 1.2, max: 1.333 } as const;

const BODY_FLOOR_PX = 16;
const MONO_FLOOR_PX = 14;

/** Scale steps above the body size. */
const STEP = { h1: 4, h2: 3, h3: 2 } as const;

/** A size in px at the narrow (`min`) and the wide (`max`) end of the viewport range; `min === max` is fixed. */
export type Fluid = { min: number; max: number };

export const fixed = (px: number): Fluid => ({ min: px, max: px });

export const parsePx = (value: string): number => {
    const match = /^(\d+(?:\.\d+)?)px$/.exec(value);
    if (!match) {
        throw new Error(`[typography] expected a px size, got "${value}"`);
    }
    return Number(match[1]);
};

const round = (n: number): number => Math.round(n * 10) / 10;

export type SizeInput = { head: number; body: number; mono: number };

export type FluidSizes = { h1: Fluid; h2: Fluid; h3: Fluid; body: Fluid; mono: Fluid };

/**
 * Body and h1 keep their given size as the maximum. The scale ratio is whatever takes body to h1 in four steps,
 * h2/h3 follow the scale. The narrow end uses the same min:max relation of the ratio as RATIO.
 * Body never drops below BODY_FLOOR_PX, mono follows the body proportionally but not below MONO_FLOOR_PX
 * (a size that is already below its floor stays fixed).
 */
export function deriveSizes({ head, body, mono }: SizeInput): FluidSizes {
    const bodyMin = Math.min(body, BODY_FLOOR_PX);
    const ratioMax = (head / body) ** (1 / STEP.h1);
    const ratioMin = ratioMax * (RATIO.min / RATIO.max);
    const step = (n: number): Fluid => ({ min: round(bodyMin * ratioMin ** n), max: round(body * ratioMax ** n) });

    return {
        h1: step(STEP.h1),
        h2: step(STEP.h2),
        h3: step(STEP.h3),
        body: { min: bodyMin, max: body },
        mono: { min: round(Math.min(mono, Math.max((mono * bodyMin) / body, MONO_FLOOR_PX))), max: mono },
    };
}

/** Size in px at a given progress. */
export const sizeAt = ({ min, max }: Fluid, t: number): number => min + (max - min) * t;

const rem = (px: number): string => `${Number((px / ROOT_PX).toFixed(4))}rem`;

/** The CSS value for a size: a plain rem length when fixed, otherwise interpolated by --t. */
export const fluidCss = ({ min, max }: Fluid): string =>
    min === max ? rem(max) : `calc(${rem(min)} + ${rem(max - min)} * var(--t))`;

/** Custom properties the sizes rely on; set once on the root element. tan(atan2(y, x)) is y / x for lengths. */
export const FLUID_ROOT_VARS = {
    '--vmin': `${VIEWPORT_REM.min}rem`,
    '--vmax': `${VIEWPORT_REM.max}rem`,
    '--t': 'clamp(0, tan(atan2(100vw - var(--vmin), var(--vmax) - var(--vmin))), 1)',
} as const;
