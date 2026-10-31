import { wcagContrast } from 'culori';

import { semantic } from '../generated/semantic';

// Pairs the pi, Claude Code and artifact outputs create that the generated role
// matrix does not cover (surfaces with textTier neutral-only carry no
// secondary text).
const MIN = 4.5;
type Pair = [foreground: string, background: string];

// pi custom messages and tool boxes sit on surface.raised; muted text
// (text.subtle) is only used on the terminal default background. Dark only.
const THEME_PAIRS: Pair[] = [
    ['text.default', 'diff.add'],
    ['text.default', 'diff.delete'],
    ['ink.amethyst', 'surface.raised'],
    ['text.secondary', 'diff.add'],
    ['text.secondary', 'diff.delete'],
];

// Artifact cards use surface.raised with these text colors, in both modes.
const ARTIFACT_PAIRS: Pair[] = [
    ['text.default', 'surface.raised'],
    ['text.emphasis', 'surface.raised'],
    ['text.secondary', 'surface.raised'],
];

const checks: { mode: 'dark' | 'light'; pairs: Pair[] }[] = [
    { mode: 'dark', pairs: [...THEME_PAIRS, ...ARTIFACT_PAIRS] },
    { mode: 'light', pairs: ARTIFACT_PAIRS },
];

const rows = checks.flatMap(({ mode, pairs }) => {
    const values = semantic[mode] as Record<string, string>;
    return pairs.map(([fg, bg]) => ({
        mode,
        fg,
        bg,
        ratio: wcagContrast(values[fg], values[bg]),
    }));
});
console.table(rows.map(r => ({ ...r, ratio: r.ratio.toFixed(2) })));

const failing = rows.filter(r => r.ratio < MIN);
if (failing.length > 0) {
    console.error(
        `LLM theme contrast failed (< ${MIN}:1): ${failing.map(r => `${r.mode} ${r.fg} on ${r.bg}`).join(', ')}`
    );
    process.exit(1);
}
console.log(`LLM theme contrast check passed (${rows.length} pairs)`);
