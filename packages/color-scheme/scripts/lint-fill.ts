/**
 * Fill distinguishability lint: the opaque fills `highlight` (CursorLine,
 * file-tree row, picker selection) and `selection` (Visual, Search) must be
 * visibly different from the two grounds they sit on, `syntax.background`
 * (editor) and `surface.default` (sidebars, floats), and `selection` must be
 * at least as strong as `highlight` so a selection inside the cursor line
 * stays visible.
 *
 * The contrast matrix only checks text on these fills; a fill that is readable
 * but nearly the ground color (light mode used to give ΔE OK 0.06) passes it.
 * Threshold: ΔE OK (OKLab, Euclidean) >= MIN_FILL_DELTA_E, compared unrounded.
 */
import { differenceEuclidean, parse } from "culori";
import { semantic } from "../generated/semantic";
import { modes } from "../src/contrast";
import { MIN_FILL_DELTA_E } from "./thresholds";

const FILLS = ["highlight", "selection"] as const;
const GROUNDS = ["syntax.background", "surface.default"] as const;
const deltaE = differenceEuclidean("oklab");

const errors: string[] = [];
let checked = 0;

for (const mode of modes) {
  const values = semantic[mode] as Record<string, string>;
  const distance = (a: string, b: string) => deltaE(parse(values[a])!, parse(values[b])!);

  for (const fill of FILLS) {
    for (const ground of GROUNDS) {
      const d = distance(fill, ground);
      checked++;
      const min = MIN_FILL_DELTA_E[mode][fill];
      if (d < min) {
        errors.push(`${mode}: ${fill} on ${ground} ΔE OK ${d.toFixed(4)} < ${min}`);
      }
    }
  }
  for (const ground of GROUNDS) {
    const strong = distance("selection", ground);
    const weak = distance("highlight", ground);
    checked++;
    if (strong < weak) {
      errors.push(`${mode}: selection (ΔE OK ${strong.toFixed(4)}) weaker than highlight (${weak.toFixed(4)}) on ${ground}`);
    }
  }
  console.log(
    `${mode}: ` +
      FILLS.map((f) => `${f} ${GROUNDS.map((g) => distance(f, g).toFixed(3)).join("/")}`).join(", ") +
      ` (ΔE OK on ${GROUNDS.join("/")})`,
  );
}

if (errors.length > 0) {
  console.error(`\nFill distinguishability check failed:\n${errors.map((e) => `  ${e}`).join("\n")}`);
  process.exit(1);
}
console.log(`Fill distinguishability check passed (${checked} checks; gates dark ${MIN_FILL_DELTA_E.dark.highlight}/${MIN_FILL_DELTA_E.dark.selection}, light ${MIN_FILL_DELTA_E.light.highlight}/${MIN_FILL_DELTA_E.light.selection} highlight/selection)`);
