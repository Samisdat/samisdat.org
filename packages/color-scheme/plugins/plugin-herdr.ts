import type { Plugin } from "@terrazzo/parser";
import { toHex } from "./hex";

const HEADER = `# Generated – do not edit.
# Source: tokens/*.tokens.json, built by \`pnpm --filter @samisdat/color-scheme build\`.
# Dark mode only. Copy this block into herdr's config.toml, replacing the
# \`[theme]\` name, then run \`herdr server reload-config\`.`;

// herdr theme slot -> semantic token
const SLOTS: Record<string, string> = {
  accent: "border.focus",
  panel_bg: "surface.emphasis",
  sidebar_bg: "surface.emphasis",
  active_row_bg: "selection",
  selection_bg: "selection",
  surface0: "surface.default",
  surface1: "surface.raised",
  surface_dim: "surface.emphasis",
  overlay0: "surface.subtle",
  overlay1: "surface.muted",
  text: "text.default",
  subtext0: "text.muted",
  mauve: "ink.amethyst",
  green: "status.success",
  yellow: "ink.gold",
  red: "status.danger",
  blue: "status.info",
  teal: "ink.turquoise",
  peach: "ink.copper",
};

/**
 * Emits a herdr `[theme.custom.dark]` block (`herdr/theme.toml`) from the
 * semantic tokens, so herdr matches the nvim theme.
 */
export default function pluginHerdr(): Plugin {
  return {
    name: "samisdat:herdr",
    async build({ resolver, outputFile, context }) {
      const fail = (message: string) =>
        context.logger.error({
          group: "plugin",
          label: "samisdat:herdr",
          message,
        });

      const permutation = (resolver.listPermutations?.() ?? []).find(
        (p) => (p as { mode: string }).mode === "dark",
      );
      if (!permutation) return;
      const tokens = resolver.apply(permutation);

      const lines: string[] = [];
      for (const [slot, id] of Object.entries(SLOTS)) {
        const token = tokens[id];
        if (!token) {
          fail(`dark: ${id} is missing in the token file`);
          continue;
        }
        if (token.$type !== "color" || token.$value.colorSpace !== "oklch") {
          fail(`dark: ${id} must be an oklch color`);
          continue;
        }
        lines.push(`${slot} = "${toHex(token.$value)}"`);
      }
      if (lines.length !== Object.keys(SLOTS).length) return;

      outputFile(
        "herdr/theme.toml",
        [HEADER, "", "[theme.custom.dark]", ...lines, ""].join("\n"),
      );
    },
  };
}
