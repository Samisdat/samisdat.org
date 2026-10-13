/**
 * Freezes the current color scheme into one JSON file for a blog post:
 * `pnpm snapshot <id>` writes packages/website/content/snapshots/<id>.json.
 *
 * Everything the post components show is measured here, from the token files
 * and the generated Shiki themes. The components only render this file, so an
 * old post does not change when the scheme is updated later. Run `pnpm build`
 * first (the Shiki themes are read from generated/). Format: ./types.ts.
 */
import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { formatHex, parse } from "culori";
import { createHighlighter, type BundledLanguage, type ThemeRegistrationAny } from "shiki";
import { semantic } from "../../generated/semantic";
import { palette } from "../../generated/primitives";
import { modes, tokensOf, type FlatToken, type Mode } from "../../src/contrast";
import { variants } from "../theme-compare/definition";
import { loadSamples, measureAll } from "../theme-compare/measure";
import { hellinger, labOf, loadNameModel, nearestCell, topTerms } from "../name-model";
import { readFileSync } from "node:fs";
import { ALTERNATIVES } from "./alternatives";
import { SAMPLE_DIFF, SAMPLE_TS } from "./code-sample";
import { cvdMatrix, deltaE, simulate, wcag } from "./measure";
import { wcagLevel } from "./levels";
import type { CodeLine, ModeSnapshot, Snapshot, SnapshotToken } from "./types";

const id = process.argv[2];
if (!id || !/^[a-z0-9-]+$/.test(id)) {
  console.error("usage: pnpm snapshot <id>   (lowercase, digits, dashes; e.g. 2026-10)");
  process.exit(1);
}
const out = new URL(`../../../website/content/snapshots/${id}.json`, import.meta.url);

const hex = (value: string): string => {
  const out = formatHex(parse(value));
  if (!out) throw new Error(`cannot convert ${value}`);
  return out;
};

const git = (args: string) => execSync(`git ${args}`, { encoding: "utf8" }).trim();

const INKS = ["red", "orange", "yellow", "green", "teal", "cyan", "blue", "purple", "pink", "comment"].map(
  (n) => `ink.${n}`,
);
const SURFACES = [
  "surface.default",
  "surface.raised",
  "surface.subtle",
  "surface.muted",
  "surface.emphasis",
  "syntax.background",
  "highlight",
  "selection",
];
// Where ink text is allowed or used: page, raised (nav bar), code, editor fills.
const INK_SURFACES = ["surface.default", "surface.raised", "syntax.background", "highlight", "selection"];
const TEXTS = ["text.emphasis", "text.default", "text.secondary", "text.subtle", "text.muted"];
const FOREGROUNDS = [...INKS, ...TEXTS];

const highlighter = await createHighlighter({
  themes: modes.map((m) => {
    const theme = JSON.parse(readFileSync(new URL(`../../generated/shiki/${m}.json`, import.meta.url), "utf8"));
    return { ...theme, name: `samisdat-${m}` } as ThemeRegistrationAny;
  }),
  langs: ["tsx"] as BundledLanguage[],
});

const tokenize = (code: string, mode: Mode): CodeLine[] => {
  const result = highlighter.codeToTokens(code, { lang: "tsx", theme: `samisdat-${mode}` });
  return result.tokens.map((line) =>
    line.map((t) => ({
      c: t.content,
      f: t.color ? hex(t.color) : undefined,
      s: t.fontStyle ? (t.fontStyle & 1 ? "italic" : t.fontStyle & 2 ? "bold" : undefined) : undefined,
    })),
  );
};

const nameModel = loadNameModel();

function buildMode(mode: Mode): ModeSnapshot {
  const values = semantic[mode] as Record<string, string>;
  const flat = new Map(tokensOf(mode).map((t) => [t.id, t]));
  const colors: Record<string, string> = {};
  const tokens: SnapshotToken[] = Object.keys(values).map((tokenId) => {
    colors[tokenId] = hex(values[tokenId]);
    const t = flat.get(tokenId) as FlatToken | undefined;
    return { id: tokenId, hex: colors[tokenId], raw: t?.value, exempt: t?.exempt, textTier: t?.textTier };
  });

  const contrast: ModeSnapshot["contrast"] = {};
  for (const fg of FOREGROUNDS) {
    contrast[fg] = {};
    for (const bg of SURFACES) {
      const w = wcag(colors[fg], colors[bg]);
      contrast[fg][bg] = { w: Math.floor(w * 100) / 100, wl: wcagLevel(w) };
    }
  }

  const bg = colors["syntax.background"];
  const legend = tokens
    .filter((t) => t.id.startsWith("syntax.") && t.id !== "syntax.background")
    .map((t) => {
      const w = wcag(t.hex, bg);
      return {
        id: t.id,
        hex: t.hex,
        raw: t.raw,
        w: Math.floor(w * 100) / 100,
        wl: wcagLevel(w),
      };
    });

  const inkHex = INKS.map((i) => colors[i]);
  const cvd = {
    simulated: Object.fromEntries(
      (["protan", "deutan", "tritan"] as const).map((k) => [k, inkHex.map((h) => simulate(k, h))]),
    ) as ModeSnapshot["cvd"]["simulated"],
    delta: Object.fromEntries(
      (["normal", "protan", "deutan", "tritan"] as const).map((k) => [k, cvdMatrix(k, inkHex)]),
    ) as ModeSnapshot["cvd"]["delta"],
  };

  const cells = INKS.map((i) => nearestCell(nameModel, labOf(colors[i])));
  const names = INKS.map((i, k) => ({
    id: i,
    top: topTerms(nameModel, cells[k].cell, 3).map((n) => ({ term: n.term, p: Math.round(n.p * 100) / 100 })),
    gap: Math.round(cells[k].distance * 10) / 10,
  }));
  const hell = INKS.map((_, a) => INKS.map((__, b) => (a === b ? 0 : hellinger(nameModel, cells[a].cell, cells[b].cell))));

  const exceptions = [
    ...[...flat.values()]
      .filter((t) => t.exempt)
      .map((t) => ({ id: t.id, kind: "exempt" as const, reason: t.exempt as string })),
  ];

  const fill = (token: string) => ({
    token,
    toSyntax: Math.round(deltaE(colors[token], colors["syntax.background"]) * 1000) / 1000,
    toSurface: Math.round(deltaE(colors[token], colors["surface.default"]) * 1000) / 1000,
  });

  const alt = ALTERNATIVES[mode];
  const alternatives = alt && {
    ink: alt.ink,
    items: alt.items.map(({ label, hex: candidate }) => ({
      label,
      hex: candidate,
      contrast: Object.fromEntries(
        SURFACES.map((s) => {
          const w = wcag(candidate, colors[s]);
          return [s, { w: Math.floor(w * 100) / 100, wl: wcagLevel(w) }];
        }),
      ),
    })),
  };

  return {
    alternatives,
    colors,
    tokens,
    contrast,
    code: { bg, fg: colors["syntax.foreground"], theme: tokenize(SAMPLE_TS, mode), diff: diffLines(mode), legend },
    cvd,
    names: { inks: names, hellinger: hell },
    exceptions,
    fills: [fill("highlight"), fill("selection")],
  };
}

function diffLines(mode: Mode) {
  return SAMPLE_DIFF.map(({ kind, text }) => ({
    kind,
    line: kind === "hunk" ? [{ c: text }] : tokenize(text, mode)[0],
  }));
}

const samples = loadSamples(new URL("../theme-compare/samples/", import.meta.url));
// Only samisdat is measured: the snapshot needs the dark/light correspondence, not a theme ranking.
const metrics = await measureAll(variants.filter((v) => v.family === "samisdat"), samples);

const correspondence = metrics.find((m) => m.family === "samisdat" && m.mode === "dark")?.correspondence;

const scales = Object.fromEntries(
  Object.entries(palette).map(([hue, steps]) => [
    hue,
    Object.fromEntries(Object.entries(steps).map(([step, v]) => [step, hex(v as string)])),
  ]),
);

const snapshot: Snapshot = {
  version: 1,
  id,
  date: new Date().toISOString().slice(0, 10),
  git: { commit: git("rev-parse --short HEAD"), dirty: git("status --porcelain -- .").length > 0 },
  inks: INKS,
  surfaces: SURFACES,
  inkSurfaces: INK_SURFACES,
  texts: TEXTS,
  modes: { dark: buildMode("dark"), light: buildMode("light") },
  scales,
  correspondence: correspondence ?? null,
};

mkdirSync(dirname(out.pathname), { recursive: true });
writeFileSync(out, `${JSON.stringify(snapshot)}\n`);
console.log(`snapshot ${id}: ${out.pathname} (${(JSON.stringify(snapshot).length / 1024).toFixed(0)} KB)`);
if (snapshot.git.dirty) console.log("note: packages/color-scheme has uncommitted changes, the hash does not identify this state");
