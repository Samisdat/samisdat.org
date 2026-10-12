import type { Plugin } from "@terrazzo/parser";
import { darkTokens, toOklchString } from "./dark-tokens";
import { toHex } from "./hex";

// claude.ai caps the custom-instructions field; stay well below it.
const INSTRUCTIONS_LIMIT = 3000;

// Level 1 (raw scales) and the ANSI palette are not part of the web variables.
const EXCLUDED = /^(color|terminal)\./;

const cssName = (id: string) => `--color-${id.replaceAll(".", "-")}`;

const SKILL_DESCRIPTION =
  "Style Claude artifacts (HTML, React, SVG) with the samisdat dark color scheme. Use whenever building or restyling an artifact, page or chart for the user.";

/**
 * Emits everything needed to give Claude artifacts the samisdat dark colors:
 * the CSS variables (same names as the website), a compact text for claude.ai
 * custom instructions and a Claude Code skill embedding the same CSS.
 */
export default function pluginArtifactCss(): Plugin {
  return {
    name: "samisdat:artifact-css",
    async build({ resolver, outputFile, context }) {
      const label = "samisdat:artifact-css";
      const dark = darkTokens({ resolver, context }, label);
      if (!dark.available) return;

      const vars: { name: string; oklch: string; hex: string }[] = [];
      for (const id of dark.ids().filter((id) => !EXCLUDED.test(id))) {
        const value = dark.get(id);
        if (value) {
          vars.push({ name: cssName(id), oklch: toOklchString(value), hex: toHex(value) });
        }
      }
      if (!dark.ok()) return;

      const css = [
        "/* Generated – do not edit. samisdat dark color scheme, same variable names as the website. */",
        ":root {",
        ...vars.map((v) => `  ${v.name}: ${v.oklch};`),
        "}",
        "",
      ].join("\n");

      const instructions = [
        "When you create an artifact (HTML, React, SVG, charts), use the samisdat dark color scheme. Dark mode only, no light variant.",
        "- Define these on :root and reference them via var(); never invent other colors.",
        "- Page background --color-surface-default, text --color-text-default, cards --color-surface-raised, code blocks --color-syntax-background.",
        "- Accents come only from the --color-ink-* set; status uses --color-status-*.",
        "- Only text-* and ink-* colors for text; surface-* are backgrounds, border-* are borders.",
        "",
        ...vars.map((v) => `${v.name}: ${v.hex}`),
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
        "Generated – do not edit. Paste the CSS below into the artifact's `<style>` and use only these variables. Dark mode only.",
        "",
        "- Page background `--color-surface-default`, text `--color-text-default`, cards `--color-surface-raised`, code blocks `--color-syntax-background`.",
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
