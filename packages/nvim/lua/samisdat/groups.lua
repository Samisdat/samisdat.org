-- Highlight groups for one mode of the palette (lua/samisdat/palette.lua).
--
-- Only palette colours are used, never literals. Syntax follows the
-- tree-sitter captures of `syntax.*` in @samisdat/color-scheme; every capture
-- there becomes `@<capture>` automatically, the tables below add the nvim
-- captures and legacy groups that map onto them.

local M = {}

-- TextMate `fontStyle` ("italic", "bold underline" …) as nvim attributes.
local function style(font_style)
  local spec = {}
  for part in (font_style or ""):gmatch("%a+") do
    spec[part] = true
  end
  return spec
end

---@param p table palette of one mode
---@return table<string, vim.api.keyset.highlight>
function M.get(p)
  local s = p.syntax
  local bg = s.background
  local float = p.surface.default

  -- Syntax capture with its font style from the tokens.
  local function syn(capture)
    return vim.tbl_extend("force", { fg = s[capture] }, style(p.syntax_styles[capture]))
  end

  local groups = {
    -- Editor
    Normal = { fg = s.foreground, bg = bg },
    NormalNC = { link = "Normal" },
    NormalFloat = { fg = p.text.default, bg = float },
    FloatBorder = { fg = p.border.default, bg = float },
    FloatTitle = { fg = p.text.emphasis, bg = float, bold = true },
    FloatFooter = { fg = p.text.subtle, bg = float },
    Cursor = { fg = bg, bg = s.foreground },
    lCursor = { link = "Cursor" },
    CursorIM = { link = "Cursor" },
    TermCursor = { link = "Cursor" },
    CursorLine = { bg = float },
    CursorColumn = { link = "CursorLine" },
    ColorColumn = { link = "CursorLine" },
    LineNr = { fg = p.text.muted },
    LineNrAbove = { link = "LineNr" },
    LineNrBelow = { link = "LineNr" },
    CursorLineNr = { fg = p.text.emphasis, bold = true },
    SignColumn = { fg = p.text.muted },
    FoldColumn = { fg = p.text.muted },
    Folded = { fg = p.text.subtle, bg = float },
    VertSplit = { fg = p.border.muted },
    WinSeparator = { fg = p.border.muted },
    EndOfBuffer = { fg = p.border.muted },
    NonText = { fg = p.border.muted },
    Whitespace = { fg = p.border.muted },
    SpecialKey = { fg = p.border.muted },
    Conceal = { fg = p.text.subtle },
    Visual = { bg = p.selection },
    VisualNOS = { link = "Visual" },
    Search = { fg = bg, bg = p.ink.yellow },
    CurSearch = { fg = bg, bg = p.ink.orange, bold = true },
    IncSearch = { link = "CurSearch" },
    Substitute = { fg = bg, bg = p.ink.pink },
    MatchParen = { fg = p.text.emphasis, bold = true, underline = true },
    Directory = { fg = s["function"] },
    Title = { fg = p.text.emphasis, bold = true },
    QuickFixLine = { bg = p.highlight, bold = true },

    StatusLine = { fg = p.text.default, bg = float },
    StatusLineNC = { fg = p.text.subtle, bg = float },
    StatusLineTerm = { link = "StatusLine" },
    StatusLineTermNC = { link = "StatusLineNC" },
    WinBar = { fg = p.text.default, bold = true },
    WinBarNC = { fg = p.text.subtle },
    TabLine = { fg = p.text.subtle, bg = float },
    TabLineFill = { bg = float },
    TabLineSel = { fg = p.text.emphasis, bg = bg, bold = true },

    Pmenu = { fg = p.text.default, bg = float },
    PmenuSel = { fg = p.text.emphasis, bg = p.selection, bold = true },
    PmenuKind = { fg = s.type, bg = float },
    PmenuKindSel = { fg = s.type, bg = p.selection },
    PmenuExtra = { fg = p.text.subtle, bg = float },
    PmenuExtraSel = { fg = p.text.subtle, bg = p.selection },
    PmenuMatch = { fg = p.border.focus, bg = float, bold = true },
    PmenuMatchSel = { fg = p.border.focus, bg = p.selection, bold = true },
    PmenuSbar = { bg = float },
    PmenuThumb = { bg = p.border.muted },
    WildMenu = { link = "PmenuSel" },

    ModeMsg = { fg = p.text.emphasis, bold = true },
    MsgArea = { fg = p.text.default },
    MoreMsg = { fg = p.status.success },
    Question = { fg = p.status.info },
    ErrorMsg = { fg = p.status.danger },
    WarningMsg = { fg = p.status.warning },
    OkMsg = { fg = p.status.success },

    SpellBad = { sp = p.status.danger, undercurl = true },
    SpellCap = { sp = p.status.warning, undercurl = true },
    SpellLocal = { sp = p.status.info, undercurl = true },
    SpellRare = { sp = p.ink.purple, undercurl = true },

    -- Diff
    DiffAdd = { bg = p.derived.diff_add },
    DiffDelete = { fg = s["diff.minus"], bg = p.derived.diff_delete },
    DiffChange = { bg = p.derived.diff_change },
    DiffText = { bg = p.derived.diff_text },
    Added = { fg = s["diff.plus"] },
    Removed = { fg = s["diff.minus"] },
    Changed = { fg = p.ink.blue },
    diffAdded = { link = "Added" },
    diffRemoved = { link = "Removed" },
    diffChanged = { link = "Changed" },

    -- Diagnostics
    DiagnosticError = { fg = p.status.danger },
    DiagnosticWarn = { fg = p.status.warning },
    DiagnosticInfo = { fg = p.status.info },
    DiagnosticHint = { fg = p.border.focus },
    DiagnosticOk = { fg = p.status.success },
    DiagnosticUnderlineError = { sp = p.status.danger, undercurl = true },
    DiagnosticUnderlineWarn = { sp = p.status.warning, undercurl = true },
    DiagnosticUnderlineInfo = { sp = p.status.info, undercurl = true },
    DiagnosticUnderlineHint = { sp = p.border.focus, undercurl = true },
    DiagnosticUnderlineOk = { sp = p.status.success, undercurl = true },
    DiagnosticUnnecessary = { fg = p.text.subtle },
    DiagnosticDeprecated = { strikethrough = true },
    LspReferenceText = { bg = p.highlight },
    LspReferenceRead = { link = "LspReferenceText" },
    LspReferenceWrite = { link = "LspReferenceText" },
    LspInlayHint = { fg = p.text.subtle, italic = true },
    LspCodeLens = { fg = p.text.subtle },
    LspSignatureActiveParameter = { fg = s.parameter, bold = true },

    -- Legacy syntax groups (regex highlighting, plugins linking to them)
    Comment = syn("comment"),
    Constant = syn("constant"),
    String = syn("string"),
    Character = syn("string"),
    Number = syn("number"),
    Boolean = syn("constant"),
    Float = syn("number"),
    Identifier = syn("variable"),
    Function = syn("function"),
    Statement = syn("keyword"),
    Conditional = syn("keyword"),
    Repeat = syn("keyword"),
    Label = syn("keyword"),
    Operator = syn("operator"),
    Keyword = syn("keyword"),
    Exception = syn("keyword"),
    PreProc = syn("keyword"),
    Include = syn("keyword"),
    Define = syn("keyword"),
    Macro = syn("constant"),
    PreCondit = syn("keyword"),
    Type = syn("type"),
    StorageClass = syn("keyword"),
    Structure = syn("type"),
    Typedef = syn("type"),
    Special = syn("string.special"),
    SpecialChar = syn("string.special"),
    Tag = syn("tag"),
    Delimiter = syn("punctuation"),
    SpecialComment = syn("comment"),
    Debug = { fg = p.status.warning },
    Underlined = { underline = true },
    Ignore = { fg = p.text.muted },
    Error = { fg = p.status.danger },
    Todo = { fg = p.status.warning, bold = true },

    -- Tree-sitter captures that are not a `syntax.*` token themselves.
    -- Unlisted sub-captures (`@keyword.return`, `@function.call` …) fall back
    -- to their parent.
    ["@variable.parameter"] = syn("parameter"),
    ["@variable.member"] = syn("property"),
    ["@variable.builtin"] = syn("constant"),
    ["@boolean"] = syn("constant"),
    ["@number.float"] = syn("number"),
    ["@character"] = syn("string"),
    ["@string.regexp"] = syn("string.special"),
    ["@string.escape"] = syn("string.special"),
    ["@string.special.url"] = vim.tbl_extend("force", syn("string.special"), { underline = true }),
    ["@module"] = syn("type"),
    ["@constructor"] = syn("type"),
    ["@label"] = syn("keyword"),
    ["@attribute"] = syn("tag.attribute"),
    ["@tag.delimiter"] = syn("tag"),
    ["@diff.delta"] = { fg = p.ink.blue },
    ["@comment.error"] = { fg = p.status.danger, bold = true },
    ["@comment.warning"] = { fg = p.status.warning, bold = true },
    ["@comment.todo"] = { fg = p.status.warning, bold = true },
    ["@comment.note"] = { fg = p.status.info, bold = true },

    ["@markup.heading"] = { fg = s["function"], bold = true },
    ["@markup.strong"] = { bold = true },
    ["@markup.italic"] = { italic = true },
    ["@markup.strikethrough"] = { strikethrough = true },
    ["@markup.underline"] = { underline = true },
    ["@markup.quote"] = { fg = p.text.secondary, italic = true },
    ["@markup.math"] = syn("string.special"),
    ["@markup.link"] = syn("tag.attribute"),
    ["@markup.link.label"] = syn("tag.attribute"),
    ["@markup.link.url"] = vim.tbl_extend("force", syn("string.special"), { underline = true }),
    ["@markup.raw"] = syn("string"),
    ["@markup.list"] = syn("punctuation"),
    ["@markup.list.checked"] = { fg = p.status.success },
    ["@markup.list.unchecked"] = syn("punctuation"),

    -- Plugins without a link to the groups above
    GitSignsAdd = { link = "Added" },
    GitSignsChange = { link = "Changed" },
    GitSignsDelete = { link = "Removed" },
  }

  -- Every `syntax.*` capture as `@<capture>`, unless set explicitly above.
  for capture in pairs(s) do
    if capture ~= "foreground" and capture ~= "background" then
      local name = "@" .. capture
      if groups[name] == nil then
        groups[name] = syn(capture)
      end
    end
  end

  return groups
end

-- ANSI colours for :terminal. Index 0/7/8/15 are neutrals, the rest inks.
---@param p table palette of one mode
---@param mode "dark"|"light"
---@return string[] 16 colours, index 0 first
function M.terminal(p, mode)
  local ink = p.ink
  local black, bright_black, white, bright_white
  if mode == "dark" then
    black, bright_black = p.surface.raised, p.surface.muted
    white, bright_white = p.text.secondary, p.text.emphasis
  else
    black, bright_black = p.text.default, p.text.muted
    white, bright_white = p.surface.emphasis, p.surface.subtle
  end
  return {
    black, ink.red, ink.green, ink.yellow, ink.blue, ink.purple, ink.teal, white,
    bright_black, ink.red, ink.green, ink.yellow, ink.blue, ink.pink, ink.cyan, bright_white,
  }
end

return M
