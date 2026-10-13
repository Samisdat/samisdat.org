/** Small measuring helpers for the snapshot: WCAG ratio, ΔE OK, vision deficiency simulation. */
import {
  differenceEuclidean,
  filterDeficiencyDeuter,
  filterDeficiencyProt,
  filterDeficiencyTrit,
  formatHex,
  parse,
  wcagContrast,
} from "culori";

export type Vision = "normal" | "protan" | "deutan" | "tritan";

const filters = {
  protan: filterDeficiencyProt(1),
  deutan: filterDeficiencyDeuter(1),
  tritan: filterDeficiencyTrit(1),
} as const;

const distance = differenceEuclidean("oklab");

const color = (value: string) => {
  const parsed = parse(value);
  if (!parsed) throw new Error(`cannot parse ${value}`);
  return parsed;
};

export const wcag = (a: string, b: string) => wcagContrast(a, b);
export const deltaE = (a: string, b: string) => distance(color(a), color(b));

export const simulate = (vision: keyof typeof filters, value: string): string => {
  const out = formatHex(filters[vision](color(value)));
  if (!out) throw new Error(`cannot simulate ${value}`);
  return out;
};

/** ΔE OK between every pair, as seen by `vision`; rounded to three decimals. */
export const cvdMatrix = (vision: Vision, colors: string[]): number[][] => {
  const seen = colors.map((c) => (vision === "normal" ? color(c) : filters[vision](color(c))));
  return seen.map((a) => seen.map((b) => Math.round(distance(a, b) * 1000) / 1000));
};
