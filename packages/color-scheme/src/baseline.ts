import baselineJson from "../contrast-baseline.json";
import { contrastMatrixAll, type ContrastPair, type Mode } from "./contrast";

/** Known failing pairs (id -> ratio at the time of recording). */
export const contrastBaseline: Record<string, number> = baselineJson.entries;

export const isBaseline = (id: string) => id in contrastBaseline;

/** Required pairs minus the baseline: what the lint enforces. */
export const enforcedPairs = (mode: Mode): ContrastPair[] =>
  contrastMatrixAll().filter((p) => p.mode === mode && !isBaseline(p.id));
