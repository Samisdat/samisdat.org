-- samisdat colour scheme for Neovim. Colours come from @samisdat/color-scheme;
-- 'background' picks the mode (dark/light).

local M = {}

function M.load()
  if vim.g.colors_name then
    vim.cmd("highlight clear")
  end
  vim.g.colors_name = "samisdat"

  local mode = vim.o.background == "light" and "light" or "dark"
  local palette = require("samisdat.palette")[mode]
  local groups = require("samisdat.groups")

  for name, spec in pairs(groups.get(palette)) do
    vim.api.nvim_set_hl(0, name, spec)
  end

  for index, color in ipairs(groups.terminal(palette, mode)) do
    vim.g["terminal_color_" .. (index - 1)] = color
  end
end

return M
