/**
 * Distinguishability lint: per mode, every pair of `ink.*` tokens must differ
 * by at least MIN_DELTA_E (Euclidean distance in OKLab, "ΔE OK"). Contrast
 * against the surface alone does not guarantee that the hues can be told
 * apart; lightness is the second axis (see README, "Unterscheidbarkeit").
 */
import { differenceEuclidean } from "culori";
import { semantic } from "../generated/semantic";
import { modes } from "../src/contrast";

const MIN_DELTA_E = 0.08;
const deltaE = differenceEuclidean("oklab");

const errors: string[] = [];
let checked = 0;
let minSeen = Infinity;

for (const mode of modes) {
  const values = semantic[mode] as Record<string, string>;
  const inks = Object.keys(values).filter((id) => id.startsWith("ink."));
  for (let i = 0; i < inks.length; i++) {
    for (let j = i + 1; j < inks.length; j++) {
      const distance = deltaE(values[inks[i]], values[inks[j]]);
      checked++;
      minSeen = Math.min(minSeen, distance);
      if (distance < MIN_DELTA_E) {
        errors.push(
          `${mode}: ${inks[i]} (${values[inks[i]]}) ~ ${inks[j]} (${values[inks[j]]}): ΔE OK ${distance.toFixed(4)} < ${MIN_DELTA_E}`,
        );
      }
    }
  }
}

if (errors.length > 0) {
  console.error(`Ink distinguishability check failed (${errors.length}):`);
  for (const error of errors) console.error(`  ✗ ${error}`);
  process.exit(1);
}

console.log(
  `Ink distinguishability check passed (${checked} pairs, min ΔE OK ${minSeen.toFixed(3)} >= ${MIN_DELTA_E})`,
);
