import type { Plugin } from "@terrazzo/parser";
import { formatHex, interpolate } from "culori";
import { modeTokens } from "./mode-tokens";
import { toHex } from "./hex";

// Claude Code override -> semantic token. Shimmer tokens are left out on
// purpose: they inherit from the base preset.
const OVERRIDES: Record<string, string> = {
  claude: "border.focus",
  text: "text.default",
  inactive: "text.subtle",
  subtle: "border.default",
  permission: "ink.sapphire",
  suggestion: "ink.turquoise",
  success: "status.success",
  error: "status.danger",
  warning: "status.warning",
  promptBorder: "border.strong",
  planMode: "ink.turquoise",
  autoAccept: "ink.amethyst",
  diffAdded: "diff.add",
  diffRemoved: "diff.delete",
  userMessageBackground: "surface.raised",
  selectionBg: "selection",
  red_FOR_SUBAGENTS_ONLY: "ink.ruby",
  blue_FOR_SUBAGENTS_ONLY: "ink.sapphire",
  green_FOR_SUBAGENTS_ONLY: "ink.jade",
  yellow_FOR_SUBAGENTS_ONLY: "ink.gold",
  purple_FOR_SUBAGENTS_ONLY: "ink.amethyst",
  orange_FOR_SUBAGENTS_ONLY: "ink.copper",
  pink_FOR_SUBAGENTS_ONLY: "ink.rose",
  cyan_FOR_SUBAGENTS_ONLY: "ink.steel",
};

// Word-level diff highlight: the line background moved toward its ink.
const WORD_VARIANTS: Record<string, [from: string, to: string]> = {
  diffAddedWord: ["diff.add", "ink.jade"],
  diffRemovedWord: ["diff.delete", "ink.ruby"],
};
const WORD_MIX = 0.3;

/**
 * Emits a Claude Code custom theme (`claude-code/samisdat.json`) on the dark
 * preset from the semantic tokens.
 */
export default function pluginClaudeCode(): Plugin {
  return {
    name: "samisdat:claude-code",
    async build({ resolver, outputFile, context }) {
      const dark = modeTokens({ resolver, context }, "samisdat:claude-code");
      if (!dark.available) return;

      const overrides: Record<string, string> = {};
      for (const [key, id] of Object.entries(OVERRIDES)) {
        const value = dark.get(id);
        if (value) overrides[key] = toHex(value);
      }
      for (const [key, [from, to]] of Object.entries(WORD_VARIANTS)) {
        const a = dark.get(from);
        const b = dark.get(to);
        if (!a || !b) continue;
        const mix = interpolate([toHex(a), toHex(b)], "oklch");
        overrides[key] = formatHex(mix(WORD_MIX));
      }
      if (!dark.ok()) return;

      outputFile(
        "claude-code/samisdat.json",
        `${JSON.stringify({ name: "samisdat", base: "dark", overrides }, null, 2)}\n`,
      );
    },
  };
}
