import type { Plugin } from "@terrazzo/parser";
import { modeTokens, toOklchString } from "./mode-tokens";

const NAME = "samisdat";
const SCHEMA =
  "https://raw.githubusercontent.com/earendil-works/pi/main/packages/coding-agent/src/modes/interactive/theme/theme-schema.json";

// pi theme color -> semantic token. The 51 required colors plus thinkingMax.
const COLORS: Record<string, string> = {
  accent: "border.focus",
  border: "border.default",
  borderAccent: "border.focus",
  borderMuted: "border.muted",
  success: "status.success",
  error: "status.danger",
  warning: "status.warning",
  muted: "text.subtle",
  dim: "text.muted",
  text: "text.default",
  thinkingText: "text.subtle",
  selectedBg: "selection",
  userMessageBg: "surface.raised",
  userMessageText: "text.default",
  customMessageBg: "surface.raised",
  customMessageText: "text.secondary",
  customMessageLabel: "ink.amethyst",
  toolPendingBg: "surface.raised",
  toolSuccessBg: "diff.add",
  toolErrorBg: "diff.delete",
  toolTitle: "text.emphasis",
  toolOutput: "text.secondary",
  mdHeading: "ink.gold",
  mdLink: "ink.sapphire",
  mdLinkUrl: "text.subtle",
  mdCode: "ink.steel",
  mdCodeBlock: "text.default",
  mdCodeBlockBorder: "border.default",
  mdQuote: "text.subtle",
  mdQuoteBorder: "border.default",
  mdHr: "border.default",
  mdListBullet: "ink.turquoise",
  toolDiffAdded: "syntax.diff-plus",
  toolDiffRemoved: "syntax.diff-minus",
  toolDiffContext: "text.secondary",
  syntaxComment: "syntax.comment",
  syntaxKeyword: "syntax.keyword",
  syntaxFunction: "syntax.function",
  syntaxVariable: "syntax.variable",
  syntaxString: "syntax.string",
  syntaxNumber: "syntax.number",
  syntaxType: "syntax.type",
  syntaxOperator: "syntax.operator",
  syntaxPunctuation: "syntax.punctuation",
  // Thinking level ramp: cold and quiet -> warm and loud.
  thinkingOff: "border.muted",
  thinkingMinimal: "ink.sapphire",
  thinkingLow: "ink.turquoise",
  thinkingMedium: "ink.jade",
  thinkingHigh: "ink.gold",
  thinkingXhigh: "ink.copper",
  thinkingMax: "ink.rose",
  bashMode: "ink.jade",
};

/**
 * Emits a pi theme (`pi/samisdat.json`) from the semantic tokens. Colors are
 * written as OKLCH, which pi gamut-maps to sRGB itself.
 */
export default function pluginPi(): Plugin {
  return {
    name: "samisdat:pi",
    async build({ resolver, outputFile, context }) {
      const dark = modeTokens({ resolver, context }, "samisdat:pi");
      if (!dark.available) return;

      const colors: Record<string, string> = {};
      for (const [color, id] of Object.entries(COLORS)) {
        const value = dark.get(id);
        if (value) colors[color] = toOklchString(value);
      }
      if (!dark.ok()) return;

      outputFile(
        "pi/samisdat.json",
        `${JSON.stringify({ $schema: SCHEMA, name: NAME, appearance: "dark", colors }, null, 2)}\n`,
      );
    },
  };
}
