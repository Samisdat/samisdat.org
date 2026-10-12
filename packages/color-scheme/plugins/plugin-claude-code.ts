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
  permission: "ink.blue",
  suggestion: "ink.teal",
  success: "status.success",
  error: "status.danger",
  warning: "status.warning",
  promptBorder: "border.strong",
  planMode: "ink.teal",
  autoAccept: "ink.purple",
  diffAdded: "diff.add",
  diffRemoved: "diff.delete",
  userMessageBackground: "surface.raised",
  selectionBg: "selection",
  red_FOR_SUBAGENTS_ONLY: "ink.red",
  blue_FOR_SUBAGENTS_ONLY: "ink.blue",
  green_FOR_SUBAGENTS_ONLY: "ink.green",
  yellow_FOR_SUBAGENTS_ONLY: "ink.yellow",
  purple_FOR_SUBAGENTS_ONLY: "ink.purple",
  orange_FOR_SUBAGENTS_ONLY: "ink.orange",
  pink_FOR_SUBAGENTS_ONLY: "ink.pink",
  cyan_FOR_SUBAGENTS_ONLY: "ink.cyan",
};

// Word-level diff highlight: the line background moved toward its ink.
const WORD_VARIANTS: Record<string, [from: string, to: string]> = {
  diffAddedWord: ["diff.add", "ink.green"],
  diffRemovedWord: ["diff.delete", "ink.red"],
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
