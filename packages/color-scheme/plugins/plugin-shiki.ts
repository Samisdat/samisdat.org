import type { Plugin } from "@terrazzo/parser";
import { formatHex } from "culori";
import { captureName, captures } from "../src/textmate-scopes";

const HEADER = `/**
 * Generated – do not edit.
 * Source: tokens/*.tokens.json and src/textmate-scopes.ts, built by \`pnpm --filter @samisdat/color-scheme build\`.
 */`;

const SYNTAX_EXTENSION = "org.samisdat.syntax";
const THEME_NAME = "samisdat";

type Theme = {
  name: string;
  fg: string;
  bg: string;
  colors: Record<string, string>;
  tokenColors: {
    scope: string[];
    settings: { foreground: string; fontStyle?: string };
  }[];
};

const component = (value: number | "none" | null) =>
  value === "none" || value === null ? 0 : value;

const toHex = (value: { components: (number | "none" | null)[] }) => {
  const [l, c, h] = value.components.map(component);
  const hex = formatHex(`oklch(${l} ${c} ${h})`);
  if (!hex) throw new Error(`cannot convert oklch(${l} ${c} ${h}) to hex`);
  return hex;
};

const tokenIdOf = (capture: string) => `syntax.${captureName(capture)}`;

/**
 * Emits the Shiki theme from the level 3 `syntax.*` tokens:
 * - `shiki-theme.ts`: one theme for both modes, colours are
 *   `var(--color-syntax-…)`, so theme switch and morphing work in the browser.
 * - `shiki/<mode>.json`: resolved hex per mode (VS Code theme format) for
 *   consumers without CSS.
 * The capture -> TextMate scope table lives in `src/textmate-scopes.ts`.
 */
export default function pluginShiki(): Plugin {
  return {
    name: "samisdat:shiki",
    async build({ resolver, outputFile, context }) {
      const fail = (message: string) =>
        context.logger.error({
          group: "plugin",
          label: "samisdat:shiki",
          message,
        });

      const build = (
        colorOf: (id: string) => string,
        fontStyleOf: (id: string) => string | undefined,
      ): Theme => {
        const fg = colorOf("syntax.foreground");
        const bg = colorOf("syntax.background");
        return {
          name: THEME_NAME,
          fg,
          bg,
          colors: { "editor.foreground": fg, "editor.background": bg },
          tokenColors: captures.map(({ capture, scopes }) => {
            const id = tokenIdOf(capture);
            const fontStyle = fontStyleOf(id);
            return {
              scope: [...scopes],
              settings: {
                foreground: colorOf(id),
                ...(fontStyle ? { fontStyle } : {}),
              },
            };
          }),
        };
      };

      const knownIds = new Set([
        "syntax.foreground",
        "syntax.background",
        ...captures.map((c) => tokenIdOf(c.capture)),
      ]);

      let cssTheme: Theme | undefined;
      for (const permutation of resolver.listPermutations?.() ?? []) {
        const mode = (permutation as { mode: string }).mode;
        const tokens = resolver.apply(permutation);

        for (const id of Object.keys(tokens)) {
          if (id.startsWith("syntax.") && !knownIds.has(id)) {
            fail(`${mode}: ${id} has no entry in src/textmate-scopes.ts`);
          }
        }
        const missing = [...knownIds].filter((id) => !tokens[id]);
        for (const id of missing) fail(`${mode}: ${id} is missing in the token file`);
        if (missing.length > 0) continue;

        const fontStyleOf = (id: string) =>
          (
            tokens[id].$extensions?.[SYNTAX_EXTENSION] as
              | { fontStyle?: string }
              | undefined
          )?.fontStyle;

        const hexTheme = build((id) => {
          const token = tokens[id];
          if (token.$type !== "color" || token.$value.colorSpace !== "oklch") {
            throw new Error(`${id} must be an oklch color`);
          }
          return toHex(token.$value);
        }, fontStyleOf);
        outputFile(
          `shiki/${mode}.json`,
          JSON.stringify({ ...hexTheme, type: mode }, null, 2) + "\n",
        );

        // Font style is data of the token and identical in every mode; the
        // first mode is enough for the CSS variable theme.
        cssTheme ??= build(
          (id) => `var(--color-${id.replaceAll(".", "-")})`,
          fontStyleOf,
        );
      }

      if (!cssTheme) return;

      outputFile(
        "shiki-theme.ts",
        [
          HEADER,
          "",
          "// Structurally compatible with Shiki's `ThemeRegistration`, without depending on shiki.",
          "export type ShikiTheme = {",
          "  name: string;",
          "  fg: string;",
          "  bg: string;",
          "  colors: Record<string, string>;",
          "  tokenColors: {",
          "    scope: string[];",
          "    settings: { foreground: string; fontStyle?: string };",
          "  }[];",
          "};",
          "",
          `export const shikiTheme: ShikiTheme = ${JSON.stringify(cssTheme, null, 2)};`,
          "",
        ].join("\n"),
      );
    },
  };
}
