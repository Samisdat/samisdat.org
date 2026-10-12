import { wcagContrast } from "culori";
import { semantic } from "../generated/semantic";

// Pairs the pi and Claude Code themes create that the generated role matrix
// does not cover (surfaces with textTier neutral-only carry no secondary text).
// Background of pi custom messages and tool boxes is surface.raised; muted text
// (text.subtle) is only used on the terminal default background.
const MIN = 4.5;
const PAIRS: [foreground: string, background: string][] = [
  ["text.secondary", "surface.raised"],
  ["text.default", "diff.add"],
  ["text.default", "diff.delete"],
  ["text.emphasis", "surface.raised"],
  ["ink.purple", "surface.raised"],
  ["text.secondary", "diff.add"],
  ["text.secondary", "diff.delete"],
];

const dark = semantic.dark as Record<string, string>;
const rows = PAIRS.map(([fg, bg]) => ({
  fg,
  bg,
  ratio: wcagContrast(dark[fg], dark[bg]),
}));
console.table(rows.map((r) => ({ ...r, ratio: r.ratio.toFixed(2) })));

const failing = rows.filter((r) => r.ratio < MIN);
if (failing.length > 0) {
  console.error(`LLM theme contrast failed (< ${MIN}:1): ${failing.map((r) => `${r.fg} on ${r.bg}`).join(", ")}`);
  process.exit(1);
}
console.log(`LLM theme contrast check passed (${rows.length} pairs)`);
