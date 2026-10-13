import type { Plugin } from "@terrazzo/parser";
import { modeTokens, toOklchString } from "./mode-tokens";
import { toHex } from "./hex";

// claude.ai caps the custom-instructions field; stay well below it.
const INSTRUCTIONS_LIMIT = 3000;

// Level 1 (raw scales) and the ANSI palette are not part of the web variables.
const EXCLUDED = /^(color|terminal)\./;

// Roles listed in instructions.md (hex, both modes). The rest, such as the
// syntax.* captures and aliases, is in the CSS and the skill only.
const INSTRUCTION_ROLES = [
  "surface.default",
  "surface.emphasis",
  "surface.raised",
  "text.default",
  "text.emphasis",
  "text.secondary",
  "text.subtle",
  "border.default",
  "border.strong",
  "ink.ruby",
  "ink.copper",
  "ink.gold",
  "ink.jade",
  "ink.turquoise",
  "ink.steel",
  "ink.sapphire",
  "ink.amethyst",
  "ink.rose",
  "ink.lapis",
  "syntax.background",
];

const cssName = (id: string) => `--color-${id.replaceAll(".", "-")}`;

const SKILL_DESCRIPTION =
  "Style Claude artifacts (HTML, React, SVG) with the samisdat color scheme, dark by default and light on request. Use whenever building or restyling an artifact, page or chart for the user.";

type Entry = { id: string; oklch: string; hex: string };

/**
 * Emits everything needed to give Claude artifacts the samisdat colors: the
 * CSS variables (same names as the website; dark on `:root`, light on
 * `:root[data-theme="light"]`), a compact text for claude.ai custom
 * instructions and a Claude Code skill embedding the same CSS.
 */
export default function pluginArtifactCss(): Plugin {
  return {
    name: "samisdat:artifact-css",
    async build({ resolver, outputFile, context }) {
      const label = "samisdat:artifact-css";
      const collect = (mode: string) => {
        const tokens = modeTokens({ resolver, context }, label, mode);
        if (!tokens.available) return undefined;
        const entries: Entry[] = [];
        for (const id of tokens.ids().filter((id) => !EXCLUDED.test(id))) {
          const value = tokens.get(id);
          if (value) entries.push({ id, oklch: toOklchString(value), hex: toHex(value) });
        }
        return tokens.ok() ? entries : undefined;
      };

      const dark = collect("dark");
      const light = collect("light");
      if (!dark || !light) return;

      const block = (selector: string, entries: Entry[]) => [
        `${selector} {`,
        ...entries.map((e) => `  ${cssName(e.id)}: ${e.oklch};`),
        "}",
      ];
      const css = [
        "/* Generated – do not edit. samisdat color scheme, same variable names as the website. */",
        "/* Dark is the default; set data-theme=\"light\" on <html> for light. */",
        ...block(":root", dark),
        "",
        ...block(':root[data-theme="light"]', light),
        "",
      ].join("\n");

      const hexPair = (id: string) => {
        const d = dark.find((e) => e.id === id);
        const l = light.find((e) => e.id === id);
        if (!d || !l) throw new Error(`artifact-css: ${id} missing in dark or light`);
        return `${cssName(id)}: ${d.hex} / ${l.hex}`;
      };

      const instructions = [
        "When you create an artifact (HTML, React, SVG, charts, PDFs), use the samisdat color scheme.",
        '- Default is dark. Use light only if I ask for it (light, hell, print, PDF).',
        '- Define the variables on :root with the dark value; define the light values on :root[data-theme="light"] and set data-theme="light" on <html> when light is wanted. Reference colors only via var(); never invent others. For PDFs without CSS use the light hex values.',
        "- Page background --color-surface-default, text --color-text-default, code blocks --color-syntax-background.",
        "- Cards and panels use --color-surface-raised with --color-text-default/-emphasis/-secondary only; accent (ink) text goes only on --color-surface-default or --color-syntax-background.",
        "- Accents come only from --color-ink-*. Status colors: success = ink-jade, danger = ink-ruby, warning = ink-copper, info = ink-sapphire. Focus = ink-turquoise.",
        "- text-* and ink-* are for text, surface-* for backgrounds, border-* for borders.",
        "",
        "Values (dark / light):",
        ...INSTRUCTION_ROLES.map(hexPair),
        "",
      ].join("\n");

      if (instructions.length > INSTRUCTIONS_LIMIT) {
        context.logger.error({
          group: "plugin",
          label,
          message: `instructions.md is ${instructions.length} characters, limit is ${INSTRUCTIONS_LIMIT}`,
        });
        return;
      }

      const skill = [
        "---",
        "name: samisdat-artifacts",
        `description: ${SKILL_DESCRIPTION}`,
        "---",
        "",
        "# samisdat artifact colors",
        "",
        'Generated – do not edit. Paste the CSS below into the artifact\'s `<style>` and use only these variables. Dark is the default; set `data-theme="light"` on `<html>` only when the user asks for light (or for print).',
        "",
        "- Page background `--color-surface-default`, text `--color-text-default`, code blocks `--color-syntax-background`.",
        "- Cards and panels use `--color-surface-raised` with `--color-text-default`, `-emphasis` or `-secondary` only. Accent (`ink-*`) text goes only on `--color-surface-default` or `--color-syntax-background`.",
        "- Accents come only from `--color-ink-*`; status uses `--color-status-*`.",
        "- `text-*` and `ink-*` are for text, `surface-*` for backgrounds, `border-*` for borders.",
        "",
        "```css",
        css.trimEnd(),
        "```",
        "",
      ].join("\n");

      outputFile("artifact/samisdat.css", css);
      outputFile("artifact/instructions.md", instructions);
      outputFile("artifact/SKILL.md", skill);
    },
  };
}
