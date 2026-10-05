import type { Plugin } from "@terrazzo/parser";

const HEADER = `/**
 * Generated – do not edit.
 * Source: tokens/*.tokens.json, built by \`pnpm --filter @samisdat/color-scheme build\`.
 */`;

const ID_PATTERN = /^color\.([a-z]+)\.(\d+)$/;

const component = (value: number | "none" | null) =>
  value === "none" || value === null ? 0 : value;

const toOklch = (value: { components: (number | "none" | null)[] }) => {
  const [l, c, h] = value.components.map(component);
  return `oklch(${l} ${c} ${h})`;
};

/**
 * Emits two typed TS modules:
 * - level 1 (values): one `as const` object per hue, each step mapped to a CSS
 *   `oklch()` string, ready for Linaria interpolation.
 * - level 2 (meaning): resolved `oklch()` literal per mode and token id, without
 *   the level 1 primitives.
 */
export default function pluginTsModule({
  filename = "primitives.ts",
  semanticFilename = "semantic.ts",
}: { filename?: string; semanticFilename?: string } = {}): Plugin {
  return {
    name: "samisdat:ts-module",
    async build({ resolver, outputFile, context }) {
      // Level 1 does not differ per mode, so any permutation is fine.
      const permutation = resolver.listPermutations?.()[0] ?? {};
      const tokens = resolver.apply(permutation);

      const hues = new Map<string, Map<number, string>>();
      for (const [id, token] of Object.entries(tokens)) {
        const match = ID_PATTERN.exec(id);
        if (!match) continue;
        if (token.$type !== "color" || token.$value.colorSpace !== "oklch") {
          context.logger.error({
            group: "plugin",
            label: "samisdat:ts-module",
            message: `${id} must be an oklch color`,
          });
          continue;
        }
        const [l, c, h] = token.$value.components.map(component);
        const [, hue, step] = match;
        if (!hues.has(hue)) hues.set(hue, new Map());
        hues.get(hue)!.set(Number(step), `oklch(${l} ${c} ${h})`);
      }

      const stepList = [
        ...new Set([...hues.values()].flatMap((m) => [...m.keys()])),
      ].sort((a, b) => a - b);

      const blocks = [...hues].map(([hue, steps]) => {
        const lines = [...steps]
          .sort(([a], [b]) => a - b)
          .map(([step, css]) => `  ${step}: "${css}",`);
        return `export const ${hue} = {\n${lines.join("\n")}\n} as const;`;
      });

      const hueNames = [...hues.keys()];
      const code = [
        HEADER,
        "",
        ...blocks.flatMap((b) => [b, ""]),
        `export const hues = [${hueNames.map((h) => `"${h}"`).join(", ")}] as const;`,
        `export const steps = [${stepList.join(", ")}] as const;`,
        "",
        "export type Hue = (typeof hues)[number];",
        "export type Step = (typeof steps)[number];",
        "",
        "export const palette = {",
        ...hueNames.map((h) => `  ${h},`),
        "} as const satisfies Record<Hue, Record<Step, string>>;",
        "",
      ].join("\n");

      outputFile(filename, code);

      const semantic: Record<string, Record<string, string>> = {};
      for (const mode of resolver.listPermutations?.() ?? []) {
        const modeName = (mode as { mode: string }).mode;
        const modeTokens: Record<string, string> = {};
        for (const [id, token] of Object.entries(resolver.apply(mode))) {
          if (id.startsWith("color.")) continue;
          if (token.$type !== "color" || token.$value.colorSpace !== "oklch") {
            context.logger.error({
              group: "plugin",
              label: "samisdat:ts-module",
              message: `${id} must be an oklch color`,
            });
            continue;
          }
          modeTokens[id] = toOklch(token.$value);
        }
        semantic[modeName] = modeTokens;
      }

      const modeBlocks = Object.entries(semantic).map(([modeName, tokens]) => {
        const lines = Object.entries(tokens).map(
          ([id, css]) => `    "${id}": "${css}",`,
        );
        return `  ${modeName}: {\n${lines.join("\n")}\n  },`;
      });
      const modeNames = Object.keys(semantic);
      const firstMode = modeNames[0];

      outputFile(
        semanticFilename,
        [
          HEADER,
          "",
          "export const semantic = {",
          ...modeBlocks,
          "} as const;",
          "",
          `export const modes = [${modeNames.map((m) => `"${m}"`).join(", ")}] as const;`,
          "",
          "export type Mode = (typeof modes)[number];",
          `export type SemanticToken = keyof (typeof semantic)["${firstMode}"];`,
          "",
        ].join("\n"),
      );

      // Named re-exports instead of `export *`: Linaria's dependency graph
      // (wyw-in-js) does not follow star exports reliably.
      const primitiveModule = `./${filename.replace(/\.ts$/, "")}`;
      const semanticModule = `./${semanticFilename.replace(/\.ts$/, "")}`;
      outputFile(
        "index.ts",
        [
          HEADER,
          "",
          `export { ${[...hueNames, "hues", "steps", "palette"].join(", ")} } from "${primitiveModule}";`,
          `export type { Hue, Step } from "${primitiveModule}";`,
          `export { semantic, modes } from "${semanticModule}";`,
          `export type { Mode, SemanticToken } from "${semanticModule}";`,
          "",
        ].join("\n"),
      );
    },
  };
}
