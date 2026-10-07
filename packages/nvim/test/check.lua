-- Headless check: `nvim --headless --clean -l test/check.lua` from the package.
-- Loads the colour scheme in both modes and fails on unknown palette keys,
-- missing captures or colours that differ from the palette.

local root = vim.fn.fnamemodify(debug.getinfo(1, "S").source:sub(2), ":p:h:h")
vim.opt.rtp:prepend(root)
vim.o.termguicolors = true

local failures = {}
local function fail(message)
  table.insert(failures, message)
end

local function hex(number)
  return number and string.format("#%06x", number) or nil
end

local function expect(group, attr, want, mode)
  local got = hex(vim.api.nvim_get_hl(0, { name = group, link = false })[attr])
  if got ~= want then
    fail(string.format("%s: %s.%s is %s, expected %s", mode, group, attr, tostring(got), want))
  end
end

-- A typo like `p.text.muteed` would silently yield `fg = nil`; a strict
-- palette turns it into an error.
-- `syntax_styles` is sparse on purpose and stays a plain table.
local function strict(tbl, path)
  if path:match("%.syntax_styles$") then
    return tbl
  end
  local proxy = {}
  for key, value in pairs(tbl) do
    proxy[key] = type(value) == "table" and strict(value, path .. "." .. key) or value
  end
  return setmetatable(proxy, {
    __index = function(_, key)
      error(string.format("unknown palette key %s.%s", path, tostring(key)), 2)
    end,
  })
end

local palettes = require("samisdat.palette")
local groups = require("samisdat.groups")

for _, mode in ipairs({ "dark", "light" }) do
  local p = palettes[mode]

  local ok, err = pcall(groups.get, strict(p, mode))
  if not ok then
    fail(mode .. ": " .. err)
  end
  ok, err = pcall(groups.terminal, strict(p, mode), mode)
  if not ok then
    fail(mode .. ": " .. err)
  end

  vim.o.background = mode
  vim.cmd.colorscheme("samisdat")

  if vim.g.colors_name ~= "samisdat" then
    fail(mode .. ": colors_name is " .. tostring(vim.g.colors_name))
  end
  if vim.o.background ~= mode then
    fail(mode .. ": background switched to " .. vim.o.background)
  end

  expect("Normal", "fg", p.syntax.foreground, mode)
  expect("Normal", "bg", p.syntax.background, mode)
  for capture, color in pairs(p.syntax) do
    if capture ~= "foreground" and capture ~= "background" then
      expect("@" .. capture, "fg", color, mode)
    end
  end
  expect("@variable.parameter", "fg", p.syntax.parameter, mode)

  for capture in pairs(p.syntax_styles) do
    local hl = vim.api.nvim_get_hl(0, { name = "@" .. capture })
    if not (hl.italic or hl.bold or hl.underline or hl.strikethrough) then
      fail(mode .. ": @" .. capture .. " lost its font style")
    end
  end

  for index = 0, 15 do
    if type(vim.g["terminal_color_" .. index]) ~= "string" then
      fail(mode .. ": terminal_color_" .. index .. " missing")
    end
  end
end

-- Changing 'background' reloads the colour scheme.
vim.o.background = "dark"
expect("Normal", "bg", palettes.dark.syntax.background, "switch")

if #failures > 0 then
  io.stderr:write(table.concat(failures, "\n") .. "\n")
  os.exit(1)
end
print("samisdat colour scheme: ok")
