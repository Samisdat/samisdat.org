# @samisdat/nvim

Neovim-Colorscheme `samisdat`, gespeist aus [`@samisdat/color-scheme`](../color-scheme/README.md). Dark und Light folgen `'background'`.

## Installation

Das Package ist ein normales Neovim-Plugin (`colors/`, `lua/`). Mit lazy.nvim aus einem lokalen Checkout:

```lua
{
  dir = "~/code/samisdat.org/packages/nvim",
  lazy = false,
  priority = 1000,
  config = function()
    vim.cmd.colorscheme("samisdat")
  end,
}
```

Ohne Plugin-Manager: `vim.opt.rtp:prepend("~/code/samisdat.org/packages/nvim")`, dann `:colorscheme samisdat`. Wechsel per `:set background=light` bzw. `dark`; Neovim lädt das Schema dann neu. Voraussetzung: `termguicolors` (seit 0.10 automatisch, wenn das Terminal es kann), Neovim ≥ 0.9.

## Aufbau

| Datei | Inhalt |
|---|---|
| `lua/samisdat/palette.lua` | **generiert**: Ebene 2 und 3 (`surface`, `text`, `ink`, `status`, `border`, `syntax`, `selection`, `highlight`) als Hex pro Mode, dazu `derived` und `syntax_styles` |
| `lua/samisdat/groups.lua` | Highlight-Gruppen und ANSI-Farben für `:terminal`, nur aus der Palette |
| `lua/samisdat/init.lua` | `load()`: Mode wählen, Gruppen setzen |
| `colors/samisdat.lua` | Einstieg für `:colorscheme` |
| `scripts/generate.ts` | Generator der Palette |
| `test/check.lua` | Headless-Check (siehe unten) |

Der Generator liest `@samisdat/color-scheme/semantic` (OKLCH, rechnet mit `culori` nach Hex) und den `fontStyle` aus `$extensions["org.samisdat.syntax"]` der Mode-Dateien. Ebene 1 kommt nicht vor; Farben in `groups.lua` sind immer Palette-Schlüssel, keine Literale.

**Syntax**: `syntax.*` nutzt bereits das Vokabular der Tree-sitter-Captures. Jeder Eintrag wird automatisch zu `@<capture>` (`syntax.tag-attribute` → `@tag.attribute`); ein neues Capture in `@samisdat/color-scheme` erscheint nach `pnpm --filter @samisdat/nvim build` ohne Änderung an `groups.lua`. Von Hand zugeordnet sind nur Neovim-Captures ohne eigenes Token (`@variable.parameter` → `parameter`, `@variable.member` → `property`, `@module` → `type` …) und die klassischen Syntax-Gruppen (`Comment`, `Statement` …). Unterkategorien ohne Eintrag (`@keyword.return`) erben vom Eltern-Capture.

**Flächen**: `Normal` liegt auf `syntax.background`, Floats, Statusline, `CursorLine` und Popup-Menü auf `surface.default`. Auf beiden Flächen sind alle `syntax.*`- und `ink.*`-Farben kontrastgeprüft (siehe Kontrast-Lint in `@samisdat/color-scheme`).

**Abgeleitete Farben** (`derived`): Diff-Hintergründe gibt es im Token-System nicht, weil es nur deckende Farben kennt. Der Generator mischt dafür das Ink in OKLab in `syntax.background` (`DERIVED` in `scripts/generate.ts`: 20 % für hinzugefügt/gelöscht, 15 % bzw. 35 % Blau für geändert/geänderter Text). Diese Werte sind nicht gelintet. Kandidaten für ein späteres `editor.*` im Token-System.

**Terminal**: `terminal_color_0`–`15` kommen aus den Inks; 0/7/8/15 sind pro Mode passende Neutrale. Wird durch `terminal.*` ersetzt, sobald es die Tokens gibt (ADR 0019, „Später“).

## Skripte

| Skript | Zweck |
|---|---|
| `pnpm --filter @samisdat/nvim build` | `lua/samisdat/palette.lua` neu erzeugen |
| `pnpm --filter @samisdat/nvim test:nvim` | Headless-Check, braucht `nvim` im `PATH` |
| `pnpm lint:nvim` (Root) | build, Prüfung, dass `palette.lua` aktuell ist, und Headless-Check; läuft in CI |

Der Headless-Check lädt das Schema in beiden Modes und schlägt fehl, wenn `groups.lua` einen unbekannten Palette-Schlüssel nutzt (sonst wäre die Farbe stillschweigend leer), ein `syntax.*`-Capture fehlt oder abweicht, der Kommentarstil verloren geht oder ANSI-Farben fehlen.

**Farbe geändert in `@samisdat/color-scheme`**: `pnpm lint:tokens`, dann `pnpm --filter @samisdat/nvim build`, beide generierten Dateien committen.
