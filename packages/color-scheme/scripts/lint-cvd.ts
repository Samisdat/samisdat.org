/**
 * Colour-vision-deficiency lint: per mode, simulate protanopia, deuteranopia
 * and tritanopia (Machado 2009, severity 1, culori `filterDeficiency*`) and
 * require ΔE OK >= MIN_DELTA_E
 * - for every pair of `ink.*` (incl. `ink.comment`)
 * - between every `ink.*` and `text.default` / `text.secondary`
 * Failing pairs are named with simulation type and values.
 */
import {
  differenceEuclidean,
  filterDeficiencyDeuter,
  filterDeficiencyProt,
  filterDeficiencyTrit,
  parse,
  formatHex,
} from "culori";
import { semantic } from "../generated/semantic";
import { modes } from "../src/contrast";

const MIN_DELTA_E = 0.04;
const TEXT = ["text.default", "text.secondary"];
const deltaE = differenceEuclidean("oklab");

const simulations = {
  protanopia: filterDeficiencyProt(1),
  deuteranopia: filterDeficiencyDeuter(1),
  tritanopia: filterDeficiencyTrit(1),
} as const;

const errors: string[] = [];
let checked = 0;
const mins: Record<string, { value: number; pair: string }> = {};

for (const mode of modes) {
  const values = semantic[mode] as Record<string, string>;
  const inks = Object.keys(values).filter((id) => id.startsWith("ink."));
  const pairs: [string, string][] = [];
  for (let i = 0; i < inks.length; i++) {
    for (let j = i + 1; j < inks.length; j++) pairs.push([inks[i], inks[j]]);
    for (const text of TEXT) pairs.push([inks[i], text]);
  }

  for (const [name, simulate] of Object.entries(simulations)) {
    for (const [a, b] of pairs) {
      const sa = simulate(parse(values[a])!);
      const sb = simulate(parse(values[b])!);
      const distance = deltaE(sa, sb);
      checked++;
      const key = `${mode} ${name}`;
      if (!mins[key] || distance < mins[key].value) {
        mins[key] = { value: distance, pair: `${a} ~ ${b}` };
      }
      if (distance < MIN_DELTA_E) {
        errors.push(
          `${mode}, ${name}: ${a} (${values[a]} → ${formatHex(sa)}) ~ ${b} (${values[b]} → ${formatHex(sb)}): ΔE OK ${distance.toFixed(4)} < ${MIN_DELTA_E}`,
        );
      }
    }
  }
}

for (const [key, { value, pair }] of Object.entries(mins)) {
  console.log(`  min ΔE OK ${key}: ${value.toFixed(4)} (${pair})`);
}

if (errors.length > 0) {
  console.error(`CVD check failed (${errors.length}):`);
  for (const error of errors) console.error(`  ✗ ${error}`);
  process.exit(1);
}
console.log(`CVD check passed (${checked} simulated pairs, min ΔE OK >= ${MIN_DELTA_E})`);
