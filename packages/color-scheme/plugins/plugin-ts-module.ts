import type { Plugin } from "@terrazzo/parser";

const HEADER = `/**
 * Generated – do not edit.
 * Source: tokens/*.tokens.json, built by \`pnpm --filter @samisdat/color-scheme build\`.
 */`;

const ID_PATTERN = /^color\.([a-z]+)\.(\d+)$/;

const component = (value: number | "none" | null) =>
  value === "none" || value === null ? 0 : value;

/**
 * Emits level 1 (values) as a typed TS module: one `as const` object per hue,
 * each step mapped to a CSS `oklch()` string, ready for Linaria interpolation.
 */
export default function pluginTsModule({
  filename = "primitives.ts",
}: { filename?: string } = {}): Plugin {
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
    },
  };
}
