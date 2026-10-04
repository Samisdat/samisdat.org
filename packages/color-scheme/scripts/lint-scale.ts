/**
 * Scale lint for level 1: per hue, L must fall strictly from step 50 to 950,
 * adjacent steps must differ by at least MIN_DELTA_L, and no step may be missing.
 */
import { HUES, loadScales, STEPS } from "./shared";

const MIN_DELTA_L = 0.02;
// Tolerance for floating point noise in the difference check.
const EPSILON = 1e-9;

const scales = loadScales();
const errors: string[] = [];

for (const hue of HUES) {
  const scale = scales[hue];
  if (!scale) {
    errors.push(`color.${hue}: hue is missing`);
    continue;
  }

  for (const step of STEPS) {
    if (!scale[step]) errors.push(`color.${hue}.${step}: step is missing`);
  }

  for (let i = 1; i < STEPS.length; i++) {
    const lighter = STEPS[i - 1];
    const darker = STEPS[i];
    const a = scale[lighter];
    const b = scale[darker];
    if (!a || !b) continue;

    const delta = a.l - b.l;
    if (delta <= 0) {
      errors.push(
        `color.${hue}.${darker}: L ${b.l} is not darker than color.${hue}.${lighter} (L ${a.l})`,
      );
    } else if (delta + EPSILON < MIN_DELTA_L) {
      errors.push(
        `color.${hue}.${darker}: ΔL to color.${hue}.${lighter} is ${delta.toFixed(4)}, minimum is ${MIN_DELTA_L}`,
      );
    }
  }
}

for (const hue of Object.keys(scales)) {
  if (!(HUES as readonly string[]).includes(hue)) {
    errors.push(`color.${hue}: unknown hue (add it to HUES in scripts/shared.ts)`);
  }
}

if (errors.length > 0) {
  console.error(`Scale lint failed (${errors.length}):`);
  for (const error of errors) console.error(`  ✗ ${error}`);
  process.exit(1);
}

console.log(`Scale lint passed (${HUES.length} hues × ${STEPS.length} steps)`);
