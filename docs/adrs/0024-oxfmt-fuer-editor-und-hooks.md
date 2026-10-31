# ADR 0024: oxfmt als Formatter für Editor und Claude-Hooks

Datum: 2026-10-31 · Status: Akzeptiert

## Kontext

Prettier mit den Plugins `multiline-arrays` und `organize-imports` braucht pro Datei
1,3–1,4 s (ohne Plugins 0,7 s). Für Format-on-Save in Neovim und für den
PostToolUse-Hook, der nach jedem Edit läuft, ist das zu langsam. oxfmt braucht
60–80 ms pro Datei über `--stdin-filepath`, ohne Daemon.

## Entscheidung

- `.oxfmtrc.json` stammt aus `oxfmt --migrate=prettier` und ersetzt die Optionswerte
  aus `.prettierrc.cjs` 1:1. `rangeStart`, `rangeEnd` und
  `organizeImportsSkipDestructiveCodeActions` entfallen (nicht unterstützt).
- **multiline-arrays geht verloren.** oxfmt kann keine Prettier-Plugins laden und hat
  kein Gegenstück. Arrays werden nach `printWidth` umbrochen, nicht nach
  Elementzahl. Bewusst akzeptiert, um Editor und Hook schnell zu halten (20× gegenüber Prettier).
- **`sortImports` ist an** und gruppiert die Imports: Side-Effects, Node-Builtins,
  externe Pakete, interne, relative (`parent`/`sibling`/`index`), Styles, Types, Rest;
  zwischen den Gruppen steht eine Leerzeile. Es entfernt keine ungenutzten Imports
  (das konnte `organize-imports`), die meldet oxlint.
- **TOML, YAML und JSON** bekommen per `overrides` `tabWidth: 2` (wie pnpm es für
  `package.json` schreibt); Code bleibt bei 4.
- Neovim (conform.nvim) und der Claude-Hook nutzen oxfmt, sobald `.oxfmtrc.json` und
  die lokale Binary da sind. Ohne Config bleibt Neovim bei prettierd.
- Prettier bleibt vorerst für die `format`-Skripte und qlty. Die Frage, ob Prettier
  ganz entfällt, braucht einen eigenen Branch, weil der Bestand einmal neu formatiert
  werden muss (heute weichen 162 von 248 Dateien unter `packages/*/src` ab).

## Konsequenzen

- Editor und Hook formatieren anders als `pnpm format`. Bis zum einmaligen Reformat
  entstehen Diffs in angefassten Dateien, die nur Formatierung sind.
- Wer einen Hook-Lauf anpasst: `scripts/claude-hooks/lint-edited-file.mjs`.
