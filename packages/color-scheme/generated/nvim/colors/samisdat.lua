-- Generated – do not edit.
-- Source: tokens/*.tokens.json, built by `pnpm --filter @samisdat/color-scheme build`.
-- Base: tokyonight (moon for dark, day for light); surfaces, text, status and
-- syntax groups are replaced with samisdat values (same mapping as the Shiki
-- theme). Terminal colours, diagnostics and plugin-specific highlight groups
-- are out of scope for now.
--
-- Use:   :set rtp^=<path to generated/nvim> | colorscheme samisdat
-- Light: :set background=light | colorscheme samisdat

local T = {
  dark = {
    ["syntax.foreground"] = "#e6c7c1",
    ["syntax.background"] = "#0f051d",
    ["surface.default"] = "#1e142e",
    ["surface.emphasis"] = "#0f051d",
    ["text.default"] = "#e6c7c1",
    ["text.secondary"] = "#ceafa9",
    ["text.muted"] = "#997c77",
    ["text.subtle"] = "#a58782",
    ["ink.comment"] = "#aecbff",
    ["border.default"] = "#978cae",
    ["border.muted"] = "#7b728c",
    ["border.focus"] = "#1ad4e0",
    ["selection"] = "#45385b",
    ["highlight"] = "#45385b",
    ["status.danger"] = "#ff5352",
    ["status.warning"] = "#e7a75c",
    ["status.info"] = "#6fbaff",
    ["syntax.comment"] = "#aecbff",
    ["syntax.keyword"] = "#ff5352",
    ["syntax.string"] = "#0fcc82",
    ["syntax.string-special"] = "#94c2c3",
    ["syntax.number"] = "#0fcc82",
    ["syntax.constant"] = "#0fcc82",
    ["syntax.function"] = "#6fbaff",
    ["syntax.type"] = "#94c2c3",
    ["syntax.variable"] = "#e6c7c1",
    ["syntax.parameter"] = "#f7bf27",
    ["syntax.property"] = "#1ad4e0",
    ["syntax.tag"] = "#fe90ff",
    ["syntax.tag-attribute"] = "#c0abe0",
    ["syntax.operator"] = "#ceafa9",
    ["syntax.punctuation"] = "#ceafa9",
    ["syntax.diff-plus"] = "#0fcc82",
    ["syntax.diff-minus"] = "#ff5352",
  },
  light = {
    ["syntax.foreground"] = "#1e142e",
    ["syntax.background"] = "#f6d5d0",
    ["surface.default"] = "#e6c7c1",
    ["surface.emphasis"] = "#997c77",
    ["text.default"] = "#1e142e",
    ["text.secondary"] = "#45385b",
    ["text.muted"] = "#6a4f4b",
    ["text.subtle"] = "#574c6a",
    ["ink.comment"] = "#4c3c93",
    ["border.default"] = "#6a4f4b",
    ["border.muted"] = "#a58782",
    ["border.focus"] = "#2d5054",
    ["selection"] = "#eeeaf7",
    ["highlight"] = "#f8f5fe",
    ["status.danger"] = "#8c1134",
    ["status.warning"] = "#723600",
    ["status.info"] = "#2629cb",
    ["syntax.comment"] = "#4c3c93",
    ["syntax.keyword"] = "#8c1134",
    ["syntax.string"] = "#274c1f",
    ["syntax.string-special"] = "#033c41",
    ["syntax.number"] = "#274c1f",
    ["syntax.constant"] = "#274c1f",
    ["syntax.function"] = "#2629cb",
    ["syntax.type"] = "#033c41",
    ["syntax.variable"] = "#1e142e",
    ["syntax.parameter"] = "#492f00",
    ["syntax.property"] = "#2d5054",
    ["syntax.tag"] = "#7b015d",
    ["syntax.tag-attribute"] = "#59008e",
    ["syntax.operator"] = "#45385b",
    ["syntax.punctuation"] = "#45385b",
    ["syntax.diff-plus"] = "#274c1f",
    ["syntax.diff-minus"] = "#8c1134",
  },
}

local mode = vim.o.background == "light" and "light" or "dark"
local t = T[mode]

local ok, tokyonight = pcall(require, "tokyonight")
if not ok then
  vim.notify("samisdat: tokyonight.nvim is required", vim.log.levels.ERROR)
  return
end

tokyonight.load({
  style = mode == "light" and "day" or "moon",
  cache = false,
  on_colors = function(c)
    -- surfaces: editor = code background (syntax.background), floats/sidebars = page surface
    c.bg = t["syntax.background"]
    c.bg_dark = t["surface.default"]
    c.bg_dark1 = t["surface.emphasis"]
    c.bg_float = t["surface.default"]
    c.bg_sidebar = t["surface.default"]
    c.bg_popup = t["surface.default"]
    c.bg_statusline = t["surface.default"]
    c.bg_highlight = t["highlight"]
    c.bg_visual = t["selection"]
    c.bg_search = t["selection"]
    c.fg = t["text.default"]
    c.fg_dark = t["text.secondary"]
    c.fg_float = t["text.default"]
    c.fg_sidebar = t["text.secondary"]
    c.fg_gutter = t["border.muted"]
    c.border = t["border.default"]
    c.border_highlight = t["border.focus"]
    c.dark3 = t["text.muted"]
    c.dark5 = t["text.subtle"]
    c.comment = t["ink.comment"]
    -- status
    c.error = t["status.danger"]
    c.warning = t["status.warning"]
    c.info = t["status.info"]
  end,
  on_highlights = function(hl, c)
    local s = function(k) return t["syntax." .. k] end
    local set = function(groups, spec) for _, g in ipairs(groups) do hl[g] = spec end end
    set({ "Comment", "@comment", "@comment.documentation" }, { fg = s("comment"), italic = true })
    set({ "Keyword", "Statement", "Conditional", "Repeat", "Exception", "Include", "StorageClass", "PreProc", "Define",
      "@keyword", "@keyword.function", "@keyword.return", "@keyword.import", "@keyword.conditional", "@keyword.repeat",
      "@keyword.exception", "@keyword.storage", "@keyword.modifier", "@keyword.type", "@keyword.coroutine", "@type.qualifier",
      "@keyword.directive", "@keyword.directive.define" }, { fg = s("keyword") })
    set({ "String", "Character", "@string", "@character", "@markup.raw", "@string.documentation" }, { fg = s("string") })
    set({ "SpecialChar", "@string.special", "@string.regexp", "@string.escape", "@character.special", "@string.special.url" }, { fg = s("string-special") })
    set({ "Number", "Float", "Boolean", "@number", "@number.float", "@boolean" }, { fg = s("number") })
    set({ "Constant", "@constant", "@constant.builtin", "@constant.macro" }, { fg = s("constant") })
    set({ "Function", "@function", "@function.call", "@function.method", "@function.method.call", "@function.builtin", "@function.macro",
      "@constructor", "@constructor.tsx" }, { fg = s("function") })
    set({ "Type", "Typedef", "@type", "@type.builtin", "@type.definition" }, { fg = s("type") })
    set({ "Identifier", "@variable" }, { fg = s("variable") })
    set({ "@variable.builtin", "@module.builtin" }, { fg = s("keyword") })
    set({ "@variable.parameter", "@variable.parameter.builtin", "@parameter" }, { fg = s("parameter") })
    set({ "@property", "@variable.member", "@field" }, { fg = s("property") })
    set({ "Tag", "Label", "@tag", "@tag.builtin", "@tag.tsx", "@tag.javascript" }, { fg = s("tag") })
    set({ "@tag.attribute" }, { fg = s("tag-attribute") })
    set({ "Operator", "@operator", "@keyword.operator" }, { fg = s("operator") })
    set({ "Delimiter", "@punctuation", "@punctuation.delimiter", "@punctuation.bracket", "@punctuation.special",
      "@tag.delimiter", "@tag.delimiter.tsx" }, { fg = s("punctuation") })
    set({ "@module", "@namespace" }, { fg = s("variable") })
    set({ "Added", "diffAdded", "@diff.plus" }, { fg = s("diff-plus") })
    set({ "Removed", "diffRemoved", "@diff.minus" }, { fg = s("diff-minus") })
  end,
})

vim.g.colors_name = "samisdat"
