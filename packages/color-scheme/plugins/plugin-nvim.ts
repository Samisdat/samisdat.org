import type { Plugin } from "@terrazzo/parser";
import { formatHex } from "culori";

const HEADER = `-- Generated – do not edit.
-- Source: tokens/*.tokens.json, built by \`pnpm --filter @samisdat/color-scheme build\`.
-- Base: tokyonight (moon for dark, day for light); surfaces, text, status and
-- syntax groups are replaced with samisdat values (same mapping as the Shiki
-- theme). Terminal colours and diagnostics are mapped too; plugin-specific
-- highlight groups are out of scope for now.
--
-- Use:   :set rtp^=<path to generated/nvim> | colorscheme samisdat
-- Light: :set background=light | colorscheme samisdat`;

// Base tokens for the tokyonight \`on_colors\` surfaces/text/status mapping.
const BASE_IDS = [
  "syntax.foreground",
  "syntax.background",
  "surface.default",
  "surface.emphasis",
  "text.default",
  "text.secondary",
  "text.muted",
  "text.subtle",
  "ink.comment",
  "border.default",
  "border.muted",
  "border.focus",
  "selection",
  "highlight",
  "diff.add",
  "diff.delete",
  "diff.change",
  "status.danger",
  "status.warning",
  "status.info",
  "ink.teal",
  "terminal.ansi0",
  "terminal.ansi1",
  "terminal.ansi2",
  "terminal.ansi3",
  "terminal.ansi4",
  "terminal.ansi5",
  "terminal.ansi6",
  "terminal.ansi7",
  "terminal.ansi8",
  "terminal.ansi9",
  "terminal.ansi10",
  "terminal.ansi11",
  "terminal.ansi12",
  "terminal.ansi13",
  "terminal.ansi14",
  "terminal.ansi15",
] as const;

// \`syntax.*\` tokens driving the \`on_highlights\` mapping, same IDs as the Shiki theme.
const SYNTAX_IDS = [
  "syntax.comment",
  "syntax.keyword",
  "syntax.string",
  "syntax.string-special",
  "syntax.number",
  "syntax.constant",
  "syntax.function",
  "syntax.type",
  "syntax.variable",
  "syntax.parameter",
  "syntax.property",
  "syntax.tag",
  "syntax.tag-attribute",
  "syntax.operator",
  "syntax.punctuation",
  "syntax.diff-plus",
  "syntax.diff-minus",
] as const;

const KNOWN_IDS = new Set<string>([...BASE_IDS, ...SYNTAX_IDS]);

const component = (value: number | "none" | null) =>
  value === "none" || value === null ? 0 : value;

const toHex = (value: { components: (number | "none" | null)[] }) => {
  const [l, c, h] = value.components.map(component);
  const hex = formatHex(`oklch(${l} ${c} ${h})`);
  if (!hex) throw new Error(`cannot convert oklch(${l} ${c} ${h}) to hex`);
  return hex;
};

const TERMINAL_ANSI_IDS = Array.from({ length: 16 }, (_, i) => `terminal.ansi${i}`);

const luaTable = (entries: Record<string, string>, indent: string) =>
  "{\n" +
  Object.entries(entries)
    .map(([id, hex]) => `${indent}  ["${id}"] = "${hex}",`)
    .join("\n") +
  `\n${indent}}`;

const render = (perMode: Record<"dark" | "light", Record<string, string>>) =>
  [
    HEADER,
    "",
    "local T = {",
    `  dark = ${luaTable(perMode.dark, "  ")},`,
    `  light = ${luaTable(perMode.light, "  ")},`,
    "}",
    "",
    'local mode = vim.o.background == "light" and "light" or "dark"',
    "local t = T[mode]",
    "",
    ...TERMINAL_ANSI_IDS.map(
      (id, i) => `vim.g.terminal_color_${i} = t["${id}"]`,
    ),
    "",
    'local ok, tokyonight = pcall(require, "tokyonight")',
    "if not ok then",
    '  vim.notify("samisdat: tokyonight.nvim is required", vim.log.levels.ERROR)',
    "  return",
    "end",
    "",
    "tokyonight.load({",
    '  style = mode == "light" and "day" or "moon",',
    "  cache = false,",
    "  on_colors = function(c)",
    '    -- surfaces: editor = code background (syntax.background), floats/sidebars = page surface',
    '    c.bg = t["syntax.background"]',
    '    c.bg_dark = t["surface.default"]',
    '    c.bg_dark1 = t["surface.emphasis"]',
    '    c.bg_float = t["surface.default"]',
    '    c.bg_sidebar = t["surface.default"]',
    '    c.bg_popup = t["surface.default"]',
    '    c.bg_statusline = t["surface.default"]',
    '    c.bg_highlight = t["highlight"]',
    '    c.bg_visual = t["selection"]',
    '    c.bg_search = t["selection"]',
    '    c.diff.add = t["diff.add"]',
    '    c.diff.delete = t["diff.delete"]',
    '    c.diff.change = t["diff.change"]',
    '    c.diff.text = t["diff.change"]',
    '    c.fg = t["text.default"]',
    '    c.fg_dark = t["text.secondary"]',
    '    c.fg_float = t["text.default"]',
    '    c.fg_sidebar = t["text.secondary"]',
    '    c.fg_gutter = t["border.muted"]',
    '    c.border = t["border.default"]',
    '    c.border_highlight = t["border.focus"]',
    '    c.dark3 = t["text.muted"]',
    '    c.dark5 = t["text.subtle"]',
    '    c.comment = t["ink.comment"]',
    "    -- status",
    '    c.error = t["status.danger"]',
    '    c.warning = t["status.warning"]',
    '    c.info = t["status.info"]',
    '    c.hint = t["ink.teal"]',
    "  end,",
    "  on_highlights = function(hl, c)",
    '    local s = function(k) return t["syntax." .. k] end',
    "    local set = function(groups, spec) for _, g in ipairs(groups) do hl[g] = spec end end",
    '    set({ "Comment", "@comment", "@comment.documentation" }, { fg = s("comment"), italic = true })',
    '    set({ "Keyword", "Statement", "Conditional", "Repeat", "Exception", "Include", "StorageClass", "PreProc", "Define",',
    '      "@keyword", "@keyword.function", "@keyword.return", "@keyword.import", "@keyword.conditional", "@keyword.repeat",',
    '      "@keyword.exception", "@keyword.storage", "@keyword.modifier", "@keyword.type", "@keyword.coroutine", "@type.qualifier",',
    '      "@keyword.directive", "@keyword.directive.define" }, { fg = s("keyword") })',
    '    set({ "String", "Character", "@string", "@character", "@markup.raw", "@string.documentation" }, { fg = s("string") })',
    '    set({ "SpecialChar", "@string.special", "@string.regexp", "@string.escape", "@character.special", "@string.special.url" }, { fg = s("string-special") })',
    '    set({ "Number", "Float", "Boolean", "@number", "@number.float", "@boolean" }, { fg = s("number") })',
    '    set({ "Constant", "@constant", "@constant.builtin", "@constant.macro" }, { fg = s("constant") })',
    '    set({ "Function", "@function", "@function.call", "@function.method", "@function.method.call", "@function.builtin", "@function.macro",',
    '      "@constructor", "@constructor.tsx" }, { fg = s("function") })',
    '    set({ "Type", "Typedef", "@type", "@type.builtin", "@type.definition" }, { fg = s("type") })',
    '    set({ "Identifier", "@variable" }, { fg = s("variable") })',
    '    set({ "@variable.builtin", "@module.builtin" }, { fg = s("keyword") })',
    '    set({ "@variable.parameter", "@variable.parameter.builtin", "@parameter" }, { fg = s("parameter") })',
    '    set({ "@property", "@variable.member", "@field" }, { fg = s("property") })',
    '    set({ "Tag", "Label", "@tag", "@tag.builtin", "@tag.tsx", "@tag.javascript" }, { fg = s("tag") })',
    '    set({ "@tag.attribute" }, { fg = s("tag-attribute") })',
    '    set({ "Operator", "@operator", "@keyword.operator" }, { fg = s("operator") })',
    '    set({ "Delimiter", "@punctuation", "@punctuation.delimiter", "@punctuation.bracket", "@punctuation.special",',
    '      "@tag.delimiter", "@tag.delimiter.tsx" }, { fg = s("punctuation") })',
    '    set({ "@module", "@namespace" }, { fg = s("variable") })',
    '    set({ "Added", "diffAdded", "@diff.plus" }, { fg = s("diff-plus") })',
    '    set({ "Removed", "diffRemoved", "@diff.minus" }, { fg = s("diff-minus") })',
    "    -- diagnostics",
    '    set({ "DiagnosticError", "DiagnosticVirtualTextError" }, { fg = c.error })',
    '    set({ "DiagnosticWarn", "DiagnosticVirtualTextWarn" }, { fg = c.warning })',
    '    set({ "DiagnosticInfo", "DiagnosticVirtualTextInfo" }, { fg = c.info })',
    '    set({ "DiagnosticHint", "DiagnosticVirtualTextHint" }, { fg = c.hint })',
    '    set({ "DiagnosticUnderlineError" }, { undercurl = true, sp = c.error })',
    '    set({ "DiagnosticUnderlineWarn" }, { undercurl = true, sp = c.warning })',
    '    set({ "DiagnosticUnderlineInfo" }, { undercurl = true, sp = c.info })',
    '    set({ "DiagnosticUnderlineHint" }, { undercurl = true, sp = c.hint })',
    '    set({ "DiagnosticSignError" }, { fg = c.error })',
    '    set({ "DiagnosticSignWarn" }, { fg = c.warning })',
    '    set({ "DiagnosticSignInfo" }, { fg = c.info })',
    '    set({ "DiagnosticSignHint" }, { fg = c.hint })',
    "    -- gitsigns.nvim",
    '    set({ "GitSignsAdd", "GitSignsAddNr", "GitSignsAddLn" }, { fg = t["status.success"] })',
    '    set({ "GitSignsChange", "GitSignsChangeNr", "GitSignsChangeLn" }, { fg = t["status.warning"] })',
    '    set({ "GitSignsDelete", "GitSignsDeleteNr", "GitSignsDeleteLn" }, { fg = t["status.danger"] })',
    "    -- telescope.nvim",
    '    set({ "TelescopeNormal" }, { fg = t["text.default"], bg = t["surface.default"] })',
    '    set({ "TelescopeBorder" }, { fg = t["border.default"] })',
    '    set({ "TelescopeSelection", "TelescopeSelectionCaret" }, { bg = t["highlight"], fg = t["text.default"] })',
    '    set({ "TelescopePromptPrefix" }, { fg = t["status.info"] })',
    '    set({ "TelescopeMatching" }, { fg = t["status.info"], bold = true })',
    "    -- fzf-lua",
    '    set({ "FzfLuaNormal" }, { fg = t["text.default"], bg = t["surface.default"] })',
    '    set({ "FzfLuaBorder" }, { fg = t["border.default"] })',
    '    set({ "FzfLuaCursorLine" }, { bg = t["highlight"] })',
    '    set({ "FzfLuaFzfMatch" }, { fg = t["status.info"], bold = true })',
    "    -- snacks.nvim",
    '    set({ "SnacksNotifierInfo" }, { fg = t["status.info"] })',
    '    set({ "SnacksNotifierWarn" }, { fg = t["status.warning"] })',
    '    set({ "SnacksNotifierError" }, { fg = t["status.danger"] })',
    '    set({ "SnacksPickerMatch" }, { fg = t["status.info"], bold = true })',
    '    set({ "SnacksIndent" }, { fg = t["border.muted"] })',
    "    -- trouble.nvim",
    '    set({ "TroubleNormal" }, { fg = t["text.default"], bg = t["surface.default"] })',
    '    set({ "TroubleText" }, { fg = t["text.default"] })',
    '    set({ "TroubleCount" }, { fg = t["text.secondary"] })',
    '    set({ "TroubleError" }, { fg = t["status.danger"] })',
    '    set({ "TroubleWarning" }, { fg = t["status.warning"] })',
    '    set({ "TroubleInformation" }, { fg = t["status.info"] })',
    '    set({ "TroubleHint" }, { fg = t["ink.teal"] })',
    "    -- lazy.nvim",
    '    set({ "LazyNormal" }, { fg = t["text.default"], bg = t["surface.default"] })',
    '    set({ "LazyButton" }, { fg = t["text.default"], bg = t["surface.emphasis"] })',
    '    set({ "LazyButtonActive" }, { fg = t["text.default"], bg = t["highlight"] })',
    '    set({ "LazyH1" }, { fg = t["status.info"], bold = true })',
    '    set({ "LazyProgressDone" }, { fg = t["status.success"] })',
    '    set({ "LazyProgressTodo" }, { fg = t["border.muted"] })',
    "    -- which-key.nvim",
    '    set({ "WhichKey" }, { fg = t["status.info"] })',
    '    set({ "WhichKeyGroup" }, { fg = t["ink.teal"] })',
    '    set({ "WhichKeyDesc" }, { fg = t["text.default"] })',
    '    set({ "WhichKeySeparator" }, { fg = t["border.muted"] })',
    '    set({ "WhichKeyFloat" }, { bg = t["surface.default"] })',
    '    set({ "WhichKeyBorder" }, { fg = t["border.default"] })',
    "    -- markdown markup (tree-sitter + legacy vim syntax)",
    '    set({ "@markup.heading", "@markup.heading.1", "@markup.heading.2", "@markup.heading.3",',
    '      "@markup.heading.4", "@markup.heading.5", "@markup.heading.6", "markdownH1", "markdownH2",',
    '      "markdownH3", "markdownH4", "markdownH5", "markdownH6" }, { fg = s("function"), bold = true })',
    '    set({ "@markup.strong", "markdownBold" }, { bold = true })',
    '    set({ "@markup.italic", "markdownItalic" }, { italic = true })',
    '    set({ "@markup.strikethrough" }, { strikethrough = true })',
    '    set({ "@markup.link", "@markup.link.label", "@markup.link.url", "markdownLinkText", "markdownUrl" },',
    '      { fg = t["status.info"], underline = true })',
    '    set({ "@markup.list", "@markup.list.checked", "@markup.list.unchecked", "markdownListMarker" },',
    '      { fg = s("punctuation") })',
    '    set({ "@markup.raw", "@markup.raw.block", "markdownCode", "markdownCodeBlock" }, { fg = s("string") })',
    '    set({ "@markup.quote" }, { fg = t["text.muted"], italic = true })',
    "  end,",
    "})",
    "",
    'vim.g.colors_name = "samisdat"',
    "",
  ].join("\n");

/**
 * Emits the nvim theme (`colors/samisdat.lua`) from the level 3 `syntax.*`
 * tokens plus the surface/text/status tokens used for tokyonight's base
 * `on_colors`. The theme sits on top of tokyonight (moon for dark, day for
 * light) and covers syntax highlighting, terminal colours and diagnostics;
 * plugin-specific highlight groups are later tickets.
 */
export default function pluginNvim(): Plugin {
  return {
    name: "samisdat:nvim",
    async build({ resolver, outputFile, context }) {
      const fail = (message: string) =>
        context.logger.error({
          group: "plugin",
          label: "samisdat:nvim",
          message,
        });

      const perMode: Partial<Record<"dark" | "light", Record<string, string>>> = {};

      for (const permutation of resolver.listPermutations?.() ?? []) {
        const mode = (permutation as { mode: string }).mode;
        const tokens = resolver.apply(permutation);

        for (const id of Object.keys(tokens)) {
          if (id.startsWith("syntax.") && !KNOWN_IDS.has(id)) {
            fail(`${mode}: ${id} has no entry in plugins/plugin-nvim.ts`);
          }
        }
        const missing = [...KNOWN_IDS].filter((id) => !tokens[id]);
        for (const id of missing) fail(`${mode}: ${id} is missing in the token file`);
        if (missing.length > 0) continue;

        const hex: Record<string, string> = {};
        for (const id of KNOWN_IDS) {
          const token = tokens[id];
          if (token.$type !== "color" || token.$value.colorSpace !== "oklch") {
            fail(`${mode}: ${id} must be an oklch color`);
            continue;
          }
          hex[id] = toHex(token.$value);
        }
        perMode[mode as "dark" | "light"] = hex;
      }

      if (!perMode.dark || !perMode.light) return;

      outputFile(
        "nvim/colors/samisdat.lua",
        render(perMode as Record<"dark" | "light", Record<string, string>>),
      );
    },
  };
}
