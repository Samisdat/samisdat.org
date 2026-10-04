import { semantic, type Mode } from "@samisdat/color-scheme";
import { formatHex, oklch, parse, wcagContrast } from "culori";

/** Resolved `oklch()` string of a level 2 token. */
export const valueOf = (mode: Mode, id: string): string =>
  (semantic[mode] as Record<string, string>)[id];

export const ratio = (foreground: string, background: string): number =>
  wcagContrast(foreground, background);

export const toHex = (value: string): string => formatHex(value) ?? "n/a";

export const toOklch = (value: string) => {
  const color = oklch(parse(value));
  return { l: color?.l ?? 0, c: color?.c ?? 0, h: color?.h ?? 0 };
};

/** Readable label color on top of an arbitrary swatch. */
export const labelColorOn = (background: string): string =>
  ratio("oklch(0.15 0 0)", background) >= ratio("oklch(1 0 0)", background)
    ? "oklch(0.15 0 0)"
    : "oklch(1 0 0)";
