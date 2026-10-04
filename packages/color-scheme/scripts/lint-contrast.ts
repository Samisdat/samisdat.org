/**
 * Runs before Terrazzo's `a11y/min-contrast` (terrazzo.contrast.config.ts,
 * once per mode), which is the actual gate but reports failures by index only.
 * This script:
 * - names every enforced pair that fails, by pair id
 * - checks every baseline entry still exists in the matrix
 * - checks every baseline entry still fails (otherwise: remove it)
 */
import { contrastMatrixAll } from "../src/contrast";
import { contrastBaseline, enforcedPairs } from "../src/baseline";
import { modes } from "../src/contrast";
import { ratioOf } from "./contrast-shared";

const pairs = new Map(contrastMatrixAll().map((p) => [p.id, p]));
const errors: string[] = [];
const staleBaseline: string[] = [];

for (const mode of modes) {
  for (const pair of enforcedPairs(mode)) {
    const ratio = ratioOf(pair);
    if (ratio < pair.min) {
      errors.push(`${pair.id}: ${ratio.toFixed(2)} < ${pair.min}`);
    }
  }
}

for (const id of Object.keys(contrastBaseline)) {
  const pair = pairs.get(id);
  if (!pair) {
    staleBaseline.push(`${id}: not in the contrast matrix anymore, remove from baseline`);
    continue;
  }
  const ratio = ratioOf(pair);
  if (ratio >= pair.min) {
    staleBaseline.push(
      `${id}: now passes (${ratio.toFixed(2)} >= ${pair.min}), remove from baseline`,
    );
  }
}

if (errors.length > 0) {
  console.error(`Contrast check failed (${errors.length}), fix the token values:`);
  for (const error of errors) console.error(`  ✗ ${error}`);
}

if (staleBaseline.length > 0) {
  console.error(`Contrast baseline is stale (${staleBaseline.length}):`);
  for (const entry of staleBaseline) console.error(`  ✗ ${entry}`);
  console.error("Regenerate: pnpm --filter @samisdat/color-scheme contrast:baseline");
}

if (errors.length > 0 || staleBaseline.length > 0) process.exit(1);

console.log(
  `Contrast check passed (${Object.keys(contrastBaseline).length} known failures, ${pairs.size} required pairs)`,
);
