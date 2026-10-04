import { wcagContrast } from "culori";
import { semantic } from "../generated/semantic";
import type { ContrastPair } from "../src/contrast";

export const BASELINE_PATH = new URL("../contrast-baseline.json", import.meta.url);

/** WCAG contrast ratio of a pair, from the generated level 2 values. */
export function ratioOf(pair: ContrastPair): number {
  const values = semantic[pair.mode] as Record<string, string>;
  return wcagContrast(values[pair.foreground], values[pair.background]);
}

export const round2 = (n: number) => Math.round(n * 100) / 100;
