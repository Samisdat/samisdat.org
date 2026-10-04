import { readFileSync } from "node:fs";

export const STEPS = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
] as const;
export type Step = (typeof STEPS)[number];

export const HUES = [
  "aubergine",
  "ivory",
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "cyan",
  "blue",
  "purple",
  "pink",
] as const;
export type Hue = (typeof HUES)[number];

export type Oklch = { l: number; c: number; h: number };

export const PRIMITIVES_PATH = new URL(
  "../tokens/primitives.tokens.json",
  import.meta.url,
);

type ColorValue = { colorSpace: string; components: (number | "none")[] };
type TokenNode = { $value?: ColorValue; $description?: string };

const num = (v: number | "none") => (v === "none" ? 0 : v);

/** Reads the level 1 token file and returns L/C/H per hue and step. */
export function loadScales(
  path: URL = PRIMITIVES_PATH,
): Partial<Record<string, Partial<Record<number, Oklch>>>> {
  const json = JSON.parse(readFileSync(path, "utf8")) as {
    color?: Record<string, Record<string, TokenNode>>;
  };
  const result: Record<string, Record<number, Oklch>> = {};
  for (const [hue, group] of Object.entries(json.color ?? {})) {
    if (hue.startsWith("$")) continue;
    result[hue] = {};
    for (const [step, node] of Object.entries(group)) {
      if (step.startsWith("$") || !node.$value) continue;
      const [l, c, h] = node.$value.components;
      result[hue][Number(step)] = { l: num(l), c: num(c), h: num(h) };
    }
  }
  return result;
}
