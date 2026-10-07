import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { modes, semantic, type Mode } from "@samisdat/color-scheme/semantic";
import { formatHex, interpolate } from "culori";

const OUT = new URL("../lua/samisdat/palette.lua", import.meta.url);

const HEADER = `-- Generated – do not edit.
-- Source: @samisdat/color-scheme (generated/semantic.ts, tokens/*.tokens.json),
-- built by \`pnpm --filter @samisdat/nvim build\`.`;

const SYNTAX_EXTENSION = "org.samisdat.syntax";

/**
 * Editor-only backgrounds that the token system does not carry (it has no
 * alpha, see ADR 0019): the ink mixed into `syntax.background` in OKLab.
 * Text on top keeps the syntax colours, so the share stays small.
 */
const DERIVED = {
  diff_add: { ink: "syntax.diff-plus", amount: 0.2 },
  diff_delete: { ink: "syntax.diff-minus", amount: 0.2 },
  diff_change: { ink: "ink.blue", amount: 0.15 },
  diff_text: { ink: "ink.blue", amount: 0.35 },
} as const;

type Token = keyof (typeof semantic)["dark"];

const toHex = (color: Parameters<typeof formatHex>[0]) => {
  const hex = formatHex(color);
  if (!hex) throw new Error(`cannot convert ${JSON.stringify(color)} to hex`);
  return hex;
};

const mix = (from: string, to: string, amount: number) =>
  toHex(interpolate([from, to], "oklab")(amount));

const require = createRequire(import.meta.url);

/** `fontStyle` from `$extensions["org.samisdat.syntax"]` per syntax capture. */
const syntaxStyles = (mode: Mode) => {
  const path = require.resolve(
    `@samisdat/color-scheme/tokens/${mode}.tokens.json`,
  );
  const json = JSON.parse(readFileSync(path, "utf8")) as {
    syntax: Record<
      string,
      { $extensions?: Record<string, { fontStyle?: string }> }
    >;
  };
  const styles: Record<string, string> = {};
  for (const [name, token] of Object.entries(json.syntax)) {
    const fontStyle = token.$extensions?.[SYNTAX_EXTENSION]?.fontStyle;
    if (fontStyle) styles[captureOf(name)] = fontStyle;
  }
  return styles;
};

/** Token name back to the tree-sitter capture: `tag-attribute` -> `tag.attribute`. */
const captureOf = (name: string) => name.replaceAll("-", ".");

const key = (name: string) => `[${JSON.stringify(name)}]`;

const table = (entries: [string, string][], indent: string) =>
  [
    "{",
    ...entries.map(
      ([name, value]) => `${indent}  ${key(name)} = ${JSON.stringify(value)},`,
    ),
    `${indent}}`,
  ].join("\n");

/**
 * Level 2 and 3 tokens as nested Lua tables, grouped by the first path
 * segment: `ink.red` -> `ink.red`, `syntax.tag-attribute` ->
 * `syntax["tag.attribute"]`, `selection` stays top level.
 */
const modeTable = (mode: Mode) => {
  const tokens = semantic[mode];
  const groups = new Map<string, [string, string][]>();
  const top: [string, string][] = [];

  for (const [id, value] of Object.entries(tokens)) {
    const hex = toHex(value);
    const [group, ...rest] = id.split(".");
    if (rest.length === 0) {
      top.push([group, hex]);
      continue;
    }
    const name = group === "syntax" ? captureOf(rest.join(".")) : rest.join(".");
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group)!.push([name, hex]);
  }

  const background = tokens["syntax.background"];
  const derived = Object.entries(DERIVED).map(
    ([name, { ink, amount }]): [string, string] => [
      name,
      mix(background, tokens[ink as Token], amount),
    ],
  );

  const styles = Object.entries(syntaxStyles(mode));

  const indent = "    ";
  return [
    "{",
    ...[...groups].map(
      ([group, entries]) => `${indent}${group} = ${table(entries, indent)},`,
    ),
    ...top.map(([name, hex]) => `${indent}${name} = ${JSON.stringify(hex)},`),
    `${indent}derived = ${table(derived, indent)},`,
    `${indent}syntax_styles = ${table(styles, indent)},`,
    "  }",
  ].join("\n");
};

const lua = [
  HEADER,
  "",
  "return {",
  ...modes.map((mode) => `  ${mode} = ${modeTable(mode)},`),
  "}",
  "",
].join("\n");

writeFileSync(OUT, lua);
console.log(`wrote ${OUT.pathname}`);
