/**
 * Regenerates contrast-baseline.json from the current token values:
 * every required pair that does not reach its minimum ratio.
 *
 * The baseline may only shrink. Run this after fixing pairs; a growing
 * baseline needs a review argument.
 */
import { writeFileSync } from "node:fs";
import { contrastMatrixAll } from "../src/contrast";
import { BASELINE_PATH, ratioOf, round2 } from "./contrast-shared";

const entries: Record<string, number> = {};
for (const pair of contrastMatrixAll()) {
  const ratio = ratioOf(pair);
  if (ratio < pair.min) entries[pair.id] = round2(ratio);
}

writeFileSync(
  BASELINE_PATH,
  `${JSON.stringify(
    {
      $comment:
        "Known failing contrast pairs. May only shrink. Regenerate with `pnpm --filter @samisdat/color-scheme contrast:baseline`.",
      entries,
    },
    null,
    2,
  )}\n`,
);

console.log(`Baseline written: ${Object.keys(entries).length} entries`);
