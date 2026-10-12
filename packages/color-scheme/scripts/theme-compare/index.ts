/**
 * Compares the samisdat syntax colors with well-known Shiki themes and writes
 * a ranked report. Run after color changes: `pnpm compare:themes`.
 *
 * Reads generated/shiki/{dark,light}.json (run `pnpm build` first), writes
 * reports/theme-compare/{metrics.json,index.html} (gitignored). Method and
 * limits: scripts/theme-compare/README.md.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { measureAll, loadSamples, type Metrics, type Variant } from "./measure";
import { render, type Column } from "./report";
import type { Mode } from "../../src/contrast";

const ours = (mode: Mode): Variant => {
  const file = new URL(`../../generated/shiki/${mode}.json`, import.meta.url);
  const theme = JSON.parse(readFileSync(file, "utf8"));
  return { family: "samisdat", mode, theme: { ...theme, name: `samisdat-${mode}` } };
};

const builtin: [string, Mode, string][] = [
  ["Solarized", "dark", "solarized-dark"],
  ["Solarized", "light", "solarized-light"],
  ["Gruvbox", "dark", "gruvbox-dark-medium"],
  ["Gruvbox", "light", "gruvbox-light-medium"],
  ["Dracula", "dark", "dracula"],
  ["Nord", "dark", "nord"],
  ["Catppuccin", "dark", "catppuccin-mocha"],
  ["Catppuccin", "light", "catppuccin-latte"],
  ["Tokyo Night", "dark", "tokyo-night"],
  ["One", "dark", "one-dark-pro"],
  ["One", "light", "one-light"],
  ["Monokai", "dark", "monokai"],
  ["Rosé Pine", "dark", "rose-pine"],
  ["Rosé Pine", "light", "rose-pine-dawn"],
  ["Kanagawa", "dark", "kanagawa-wave"],
  ["Kanagawa", "light", "kanagawa-lotus"],
  ["Everforest", "dark", "everforest-dark"],
  ["Everforest", "light", "everforest-light"],
];

const variants: Variant[] = [
  ours("dark"),
  ours("light"),
  ...builtin.map(([family, mode, theme]): Variant => ({ family, mode, theme })),
];

/**
 * Which direction is "better" is a judgement call, see the README: contrast
 * and distances are better when higher, lightness spread and the dark/light
 * deviation when lower.
 */
const columns: Column[] = [
  { id: "wcag45", label: "WCAG ≥ 4.5", hint: "Share of characters", higherIsBetter: true, get: (m) => m.wcag.share45, format: pct },
  { id: "wcagMin", label: "WCAG min", hint: "Weakest used color", higherIsBetter: true, get: (m) => m.wcag.min, format: fixed(2) },
  { id: "lcMedian", label: "Lc median", hint: "APCA, weighted by use", higherIsBetter: true, get: (m) => m.apca.median, format: fixed(0) },
  { id: "lc60", label: "Lc ≥ 60", hint: "Share of characters", higherIsBetter: true, get: (m) => m.apca.share60, format: pct },
  { id: "lcMin", label: "Lc min", hint: "Weakest used color", higherIsBetter: true, get: (m) => m.apca.min, format: fixed(0) },
  { id: "deAccent", label: "ΔE OK accents", hint: "Closest pair of accent colors", higherIsBetter: true, get: (m) => m.accentDistance.min, format: fixed(3) },
  { id: "protan", label: "Protan", hint: "Closest accent pair, simulated", higherIsBetter: true, get: (m) => m.cvd.protan.min, format: fixed(3) },
  { id: "deutan", label: "Deutan", hint: "Closest accent pair, simulated", higherIsBetter: true, get: (m) => m.cvd.deutan.min, format: fixed(3) },
  { id: "tritan", label: "Tritan", hint: "Closest accent pair, simulated", higherIsBetter: true, get: (m) => m.cvd.tritan.min, format: fixed(3) },
  { id: "lightnessSd", label: "L spread", hint: "SD of accent lightness, lower is more even", higherIsBetter: false, get: (m) => m.lightness.sd, format: fixed(3) },
  { id: "rho", label: "ρ dark/light", hint: "Rank correlation of role readability", higherIsBetter: true, get: (m) => m.correspondence?.spearman, format: fixed(2) },
  { id: "dLc", label: "ΔLc dark/light", hint: "Mean |Lc| difference per role", higherIsBetter: false, get: (m) => m.correspondence?.meanAbsDiffLc, format: fixed(1) },
];

function fixed(digits: number) {
  return (value: number) => value.toFixed(digits);
}
function pct(value: number) {
  return `${Math.round(value * 100)} %`;
}

const samples = loadSamples(new URL("./samples/", import.meta.url));
const metrics: Metrics[] = await measureAll(variants, samples);

const out = new URL("../../reports/theme-compare/", import.meta.url);
mkdirSync(out, { recursive: true });
writeFileSync(new URL("metrics.json", out), JSON.stringify(metrics, null, 1));
writeFileSync(new URL("index.html", out), render(metrics, columns));

const own = metrics.filter((m) => m.family === "samisdat");
for (const m of own) {
  console.log(
    m.key.padEnd(16),
    `WCAG≥4.5 ${pct(m.wcag.share45)}`,
    `Lc median ${m.apca.median.toFixed(0)}`,
    `ΔE accents ${m.accentDistance.min.toFixed(3)}`,
    `CVD p/d/t ${m.cvd.protan.min.toFixed(3)}/${m.cvd.deutan.min.toFixed(3)}/${m.cvd.tritan.min.toFixed(3)}`,
  );
}
console.log(`Report: ${new URL("index.html", out).pathname}`);
