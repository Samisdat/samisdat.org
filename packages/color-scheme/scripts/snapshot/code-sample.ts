/** Code shown in the snapshot's code blocks. Changing it changes future snapshots only. */
export const SAMPLE_TS = `// Comments get their own ink instead of grey.
import { syntax } from "./tokens/dark";
import type { ThemeRegistration } from "shiki";

export const MIN_CONTRAST = 4.5;

export const samisdatDark = {
  name: "samisdat-dark",
  type: "dark",
  colors: { "editor.background": syntax.background },
  tokenColors: [
    { scope: "comment", settings: { foreground: syntax.comment } },
    { scope: "keyword", settings: { foreground: syntax.keyword } },
  ],
} satisfies ThemeRegistration;

export function toCSS(
  tokens: Record<string, string>,
  prefix = "--color",
) {
  return Object.entries(tokens)
    .map(([name, value]) => \`\${prefix}-\${name}: \${value};\`)
    .join("\\n");
}`;

export type DiffKind = "hunk" | "ctx" | "add" | "del";

export const SAMPLE_DIFF: { kind: DiffKind; text: string }[] = [
  { kind: "hunk", text: "@@ tokens/dark.ts @@" },
  { kind: "ctx", text: "export const syntax = {" },
  { kind: "ctx", text: "  background: surface.emphasis," },
  { kind: "ctx", text: "  foreground: text.default," },
  { kind: "del", text: "  comment: text.muted," },
  { kind: "add", text: "  comment: ink.lapis," },
  { kind: "ctx", text: "  keyword: ink.ruby," },
  { kind: "add", text: "  parameter: ink.gold," },
  { kind: "ctx", text: "};" },
];
