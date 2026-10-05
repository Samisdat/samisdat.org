/**
 * APCA gate (second gate next to the WCAG lint, see src/apca.ts): per mode,
 * every `ink.*` and every `syntax.*` foreground must reach |Lc| >= 60 on
 * `syntax.background` and `surface.default`, unless the token (or the token it
 * aliases) carries a documented `apcaMin` exception. `text.default` below
 * Lc 75 only warns. Prints the full Lc table per mode.
 */
import { semantic } from "../generated/semantic";
import { apcaAbs, apcaPairs, apcaTextPairs, APCA_TEXT_WARN, type ApcaPair } from "../src/apca";
import { modes } from "../src/contrast";

const errors: string[] = [];
const warnings: string[] = [];
let checked = 0;
let excepted = 0;

for (const mode of modes) {
  const values = semantic[mode] as Record<string, string>;
  const lc = (p: ApcaPair) => apcaAbs(values[p.foreground], values[p.background]);

  const rows = new Map<string, Record<string, string>>();
  for (const p of apcaPairs(mode)) {
    const value = lc(p);
    checked++;
    const lowered = p.min !== 60;
    if (lowered) excepted++;
    const row = rows.get(p.foreground) ?? {};
    row[p.background] = `${value.toFixed(1)}${lowered ? ` (min ${p.min})` : ""}`;
    rows.set(p.foreground, row);
    if (value < p.min) {
      errors.push(
        `${p.id}: Lc ${value.toFixed(1)} < ${p.min} (${values[p.foreground]} on ${values[p.background]})`,
      );
    }
  }
  console.log(`\nAPCA |Lc| (${mode})`);
  console.table(
    Object.fromEntries(
      [...rows].map(([fg, row]) => [
        fg,
        { "syntax.background": row["syntax.background"], "surface.default": row["surface.default"] },
      ]),
    ),
  );

  for (const p of apcaTextPairs(mode)) {
    const value = lc(p);
    if (value < APCA_TEXT_WARN) {
      errors.push(`${p.id}: Lc ${value.toFixed(1)} < ${APCA_TEXT_WARN} (body text minimum)`);
    }
  }
}

for (const w of warnings) console.warn(`  ! ${w}`);

if (errors.length > 0) {
  console.error(`APCA check failed (${errors.length}):`);
  for (const error of errors) console.error(`  ✗ ${error}`);
  console.error(
    'Fix the value, or document an exception: $extensions["org.samisdat.a11y"] { apcaMin, apcaReason } on the level 2 token.',
  );
  process.exit(1);
}
console.log(`APCA check passed (${checked} pairs, ${excepted} with documented exception)`);
