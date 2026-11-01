/**
 * Measures how readable and how distinguishable the syntax colors of a Shiki
 * theme are on a fixed code sample (scripts/theme-compare/samples).
 *
 * Per theme: WCAG 2 contrast against the editor background,
 * perceptual distance between the colors that are actually used (ΔE OK and
 * ΔE2000), the same distance after simulating protan/deutan/tritan vision, and
 * the lightness spread of the accent colors. Per family with both a dark and a
 * light variant: how well the role-to-readability order carries over between
 * the modes.
 *
 * Colors are weighted by how many characters of the sample they paint, and
 * colors closer than a just-noticeable difference are merged first, so a theme
 * is not penalised for near-duplicate shades it barely uses.
 */
import { readdirSync, readFileSync } from 'node:fs';

import {
    converter,
    differenceCiede2000,
    differenceEuclidean,
    filterDeficiencyDeuter,
    filterDeficiencyProt,
    filterDeficiencyTrit,
    formatHex,
    parse,
    wcagContrast,
    type Color,
} from 'culori';
import { createHighlighter, type BundledLanguage } from 'shiki';

import type { Correspondence, Entry, Metrics, Pair, Variant } from './measure-types';

export type { Correspondence, Entry, Metrics, Pair, Variant } from './measure-types';

/** Just-noticeable difference in OKLab; closer colors count as one. */
const JND = 0.02;
/** Colors painting less than this share of the sample are ignored. */
const MIN_WEIGHT = 0.005;
/** Colors with OKLCH chroma below this are neutrals, not accents. */
const ACCENT_CHROMA = 0.05;

const toOklch = converter('oklch');
const toRgb = converter('rgb');
const distanceOk = differenceEuclidean('oklab');
const distance2000 = differenceCiede2000();
const simulations = {
    protan: filterDeficiencyProt(1),
    deutan: filterDeficiencyDeuter(1),
    tritan: filterDeficiencyTrit(1),
} as const;

const must = <T>(value: T | undefined, what: string): T => {
    if (value === undefined) throw new Error(`Cannot parse ${what}`);
    return value;
};

const color = (value: string): Color => must(parse(value), `color ${value}`);

/** Flattens a color with alpha onto an opaque background, returns hex. */
const composite = (value: string, background: string): string => {
    const parsed = color(value);
    const alpha = parsed.alpha ?? 1;
    if (alpha >= 1) return formatHex(parsed);
    const fg = must(toRgb(parsed), value);
    const bg = must(toRgb(color(background)), background);
    return formatHex({
        mode: 'rgb',
        r: fg.r * alpha + bg.r * (1 - alpha),
        g: fg.g * alpha + bg.g * (1 - alpha),
        b: fg.b * alpha + bg.b * (1 - alpha),
    });
};

/** Samples are named `<name>.<ext>.sample` so linters and tsc leave them alone. */
const LANGS: Record<string, BundledLanguage> = { tsx: 'tsx', css: 'css', json: 'json', sh: 'bash' };

export type Sample = { lang: BundledLanguage; code: string };

export function loadSamples(dir: URL): Sample[] {
    return readdirSync(dir)
        .filter(file => file.endsWith('.sample'))
        .sort()
        .map(file => {
            const ext = file.split('.').at(-2) ?? '';
            const lang = LANGS[ext];
            if (!lang) throw new Error(`No language mapped for sample ${file}`);
            return { lang, code: readFileSync(new URL(file, dir), 'utf8') };
        });
}

type PairStat = { a: string; b: string; ok: number; e2000: number } & Record<keyof typeof simulations, number>;

const pairStats = (colors: string[]): PairStat[] => {
    const out: PairStat[] = [];
    for (let i = 0; i < colors.length; i++) {
        for (let j = i + 1; j < colors.length; j++) {
            const a = colors[i];
            const b = colors[j];
            const [ca, cb] = [color(a), color(b)];
            const sim = (name: keyof typeof simulations) => distanceOk(simulations[name](ca), simulations[name](cb));
            out.push({
                a,
                b,
                ok: distanceOk(ca, cb),
                e2000: distance2000(ca, cb),
                protan: sim('protan'),
                deutan: sim('deutan'),
                tritan: sim('tritan'),
            });
        }
    }
    return out;
};

const minOf = (pairs: PairStat[], key: 'ok' | 'e2000' | keyof typeof simulations) => {
    if (pairs.length === 0) return { value: Number.POSITIVE_INFINITY, pair: null };
    const best = pairs.reduce((m, p) => (p[key] < m[key] ? p : m));
    return { value: best[key], pair: [best.a, best.b] as Pair };
};

const mean = (values: number[]) => values.reduce((a, b) => a + b, 0) / values.length;
const sd = (values: number[]) => {
    const m = mean(values);
    return Math.sqrt(values.reduce((a, b) => a + (b - m) ** 2, 0) / values.length);
};

/** Characters of the sample, each as the (merged) color it is painted in. */
type Stream = { background: string; chars: string[]; clusters: { color: string; count: number }[] };

function paint(
    highlighter: Awaited<ReturnType<typeof createHighlighter>>,
    themeName: string,
    samples: Sample[]
): Stream {
    const counts = new Map<string, number>();
    const chars: string[] = [];
    let background = '';
    for (const { lang, code } of samples) {
        const result = highlighter.codeToTokens(code, { lang, theme: themeName });
        background = formatHex(color(must(result.bg, 'theme background')));
        for (const line of result.tokens) {
            for (const token of line) {
                const painted = composite(token.color ?? must(result.fg, 'theme foreground'), background);
                for (const ch of token.content) {
                    if (/\s/.test(ch)) continue;
                    chars.push(painted);
                    counts.set(painted, (counts.get(painted) ?? 0) + 1);
                }
            }
        }
    }
    // Merge colors closer than a just-noticeable difference into the heavier one.
    const clusters: { color: string; count: number }[] = [];
    const alias = new Map<string, string>();
    for (const [c, count] of [...counts].sort((a, b) => b[1] - a[1])) {
        const hit = clusters.find(k => distanceOk(color(k.color), color(c)) < JND);
        if (hit) {
            hit.count += count;
            alias.set(c, hit.color);
        } else {
            clusters.push({ color: c, count });
            alias.set(c, c);
        }
    }
    return { background, chars: chars.map(c => must(alias.get(c), c)), clusters };
}

const themeNameOf = (theme: Variant['theme']) => (typeof theme === 'string' ? theme : (theme.name ?? ''));

function measureOne(variant: Variant, stream: Stream): Metrics {
    const { background, chars, clusters } = stream;
    const total = chars.length;
    const palette: Entry[] = clusters
        .filter(k => k.count / total >= MIN_WEIGHT)
        .map(({ color: c, count }) => {
            const lch = must(toOklch(color(c)), c);
            return {
                color: c,
                weight: count / total,
                wcag: wcagContrast(c, background),
                l: lch.l,
                chroma: lch.c ?? 0,
                hue: lch.h ?? 0,
            };
        })
        .sort((a, b) => b.weight - a.weight);

    const share = (test: (e: Entry) => boolean) => palette.filter(test).reduce((a, e) => a + e.weight, 0);
    const weightedMedian = (key: 'wcag') => {
        let acc = 0;
        for (const e of [...palette].sort((a, b) => a[key] - b[key])) {
            acc += e.weight;
            if (acc >= 0.5) return e[key];
        }
        return Math.max(...palette.map(e => e[key]));
    };

    const all = pairStats(palette.map(e => e.color));
    const accentEntries = palette.filter(e => e.chroma >= ACCENT_CHROMA);
    const accent = pairStats(accentEntries.map(e => e.color));
    const nearest = minOf(all, 'ok');
    const nearestAccent = minOf(accent, 'ok');
    const lightness = accentEntries.map(e => e.l);

    return {
        key: `${variant.family}|${variant.mode}`,
        family: variant.family,
        mode: variant.mode,
        theme: themeNameOf(variant.theme),
        background,
        colors: palette.length,
        accents: accentEntries.length,
        wcag: {
            min: Math.min(...palette.map(e => e.wcag)),
            median: weightedMedian('wcag'),
            share45: share(e => e.wcag >= 4.5),
            share7: share(e => e.wcag >= 7),
        },
        distance: {
            min: nearest.value,
            pair: nearest.pair,
            below008: all.filter(p => p.ok < 0.08).length,
            pairs: all.length,
        },
        accentDistance: {
            min: nearestAccent.value,
            pair: nearestAccent.pair,
            below008: accent.filter(p => p.ok < 0.08).length,
            pairs: accent.length,
            minDeltaE2000: minOf(accent, 'e2000').value,
        },
        cvd: Object.fromEntries(
            (Object.keys(simulations) as (keyof typeof simulations)[]).map(name => {
                const worst = minOf(accent, name);
                return [
                    name,
                    { min: worst.value, pair: worst.pair, below004: accent.filter(p => p[name] < 0.04).length },
                ];
            })
        ) as Metrics['cvd'],
        lightness: { mean: mean(lightness), sd: sd(lightness), range: Math.max(...lightness) - Math.min(...lightness) },
        palette,
    };
}

const rank = (values: number[]) => {
    const order = values.map((v, i) => [v, i] as const).sort((p, q) => p[0] - q[0]);
    const ranks: number[] = Array(values.length);
    order.forEach(([, i], k) => (ranks[i] = k));
    return ranks;
};

const spearman = (x: number[], y: number[]) => {
    const [rx, ry] = [rank(x), rank(y)];
    const n = x.length;
    const d2 = rx.reduce((acc, v, i) => acc + (v - ry[i]) ** 2, 0);
    return 1 - (6 * d2) / (n * (n * n - 1));
};

/** How the role-to-readability order carries over from dark to light. */
function correspondence(dark: Stream, light: Stream): Correspondence {
    const roles = new Map<string, number>();
    dark.chars.forEach((c, i) => {
        const key = `${c}>${light.chars[i]}`;
        roles.set(key, (roles.get(key) ?? 0) + 1);
    });
    const rows = [...roles]
        .filter(([, n]) => n / dark.chars.length >= MIN_WEIGHT)
        .map(([key, n]) => {
            const [d, l] = key.split('>');
            return {
                w: n / dark.chars.length,
                dark: wcagContrast(d, dark.background),
                light: wcagContrast(l, light.background),
            };
        });
    const weight = rows.reduce((a, r) => a + r.w, 0);
    return {
        roles: rows.length,
        spearman: spearman(
            rows.map(r => r.dark),
            rows.map(r => r.light)
        ),
        meanAbsDiffWcag: rows.reduce((a, r) => a + Math.abs(r.dark - r.light) * r.w, 0) / weight,
    };
}

export async function measureAll(variants: Variant[], samples: Sample[]): Promise<Metrics[]> {
    const highlighter = await createHighlighter({
        themes: variants.map(v => v.theme),
        langs: [...new Set(samples.map(s => s.lang))],
    });
    const streams = new Map(
        variants.map(v => [`${v.family}|${v.mode}`, paint(highlighter, themeNameOf(v.theme), samples)])
    );
    const results = variants.map(v => measureOne(v, must(streams.get(`${v.family}|${v.mode}`), v.family)));
    for (const family of new Set(results.map(r => r.family))) {
        const dark = results.find(r => r.family === family && r.mode === 'dark');
        const light = results.find(r => r.family === family && r.mode === 'light');
        if (!dark || !light) continue;
        dark.correspondence = light.correspondence = correspondence(
            must(streams.get(dark.key), dark.key),
            must(streams.get(light.key), light.key)
        );
    }
    return results;
}
