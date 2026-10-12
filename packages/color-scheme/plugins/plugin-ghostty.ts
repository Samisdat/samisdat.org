import type { Plugin } from "@terrazzo/parser";
import { toHex } from "./hex";

const HEADER = `# Generated – do not edit.
# Source: tokens/*.tokens.json, built by \`pnpm --filter @samisdat/color-scheme build\`.
# Dark mode only. Symlink into ~/.config/ghostty/themes/samisdat and set
# \`theme = samisdat\` in the Ghostty config.`;

const ANSI_IDS = Array.from({ length: 16 }, (_, i) => `terminal.ansi${i}`);

// Ghostty key -> semantic token
const KEYS: Record<string, string> = {
  background: "syntax.background",
  foreground: "syntax.foreground",
  "cursor-color": "border.focus",
  "selection-background": "selection",
  "selection-foreground": "text.default",
};

/**
 * Emits a Ghostty theme file (`ghostty/samisdat`) from the terminal.* palette
 * and the surface/text tokens, so the terminal matches the nvim theme.
 */
export default function pluginGhostty(): Plugin {
  return {
    name: "samisdat:ghostty",
    async build({ resolver, outputFile, context }) {
      const fail = (message: string) =>
        context.logger.error({
          group: "plugin",
          label: "samisdat:ghostty",
          message,
        });

      const permutation = (resolver.listPermutations?.() ?? []).find(
        (p) => (p as { mode: string }).mode === "dark",
      );
      if (!permutation) return;
      const tokens = resolver.apply(permutation);

      const hex = (id: string) => {
        const token = tokens[id];
        if (!token) {
          fail(`dark: ${id} is missing in the token file`);
          return undefined;
        }
        if (token.$type !== "color" || token.$value.colorSpace !== "oklch") {
          fail(`dark: ${id} must be an oklch color`);
          return undefined;
        }
        return toHex(token.$value);
      };

      const palette = ANSI_IDS.map((id, i) => [i, hex(id)] as const);
      const keys = Object.entries(KEYS).map(([key, id]) => [key, hex(id)] as const);
      if ([...palette, ...keys].some(([, value]) => value === undefined)) return;

      outputFile(
        "ghostty/samisdat",
        [
          HEADER,
          "",
          ...palette.map(([i, value]) => `palette = ${i}=${value}`),
          ...keys.map(([key, value]) => `${key} = ${value}`),
          "",
        ].join("\n"),
      );
    },
  };
}
