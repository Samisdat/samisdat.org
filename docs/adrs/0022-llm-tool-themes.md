# ADR 0022: Themes für LLM-Werkzeuge aus den Dark-Tokens

Datum: 2026-10-12 · Status: Akzeptiert

## Kontext

ADR 0019 nennt LLM-CLIs (Claude, Gemini, OpenAI) als späteren Konsumenten von
`@samisdat/color-scheme`. Tatsächlich genutzt werden:

- die **Claude Code CLI** (Custom-Theme-JSON in `~/.claude/themes/`),
- **pi** (Theme-JSON; Copilot ist dort nur ein Modell-Provider und hat keine
  eigene Oberfläche),
- **Claude-Artifacts** in claude.ai, das kein Theme-Mechanismus kennt: Farben
  kommen nur an, wenn Claude sie beim Erzeugen selbst ins HTML schreibt.

Gemini CLI und OpenAI Codex CLI werden nicht genutzt.

## Entscheidung

Drei weitere Terrazzo-Plugins erzeugen die Dateien aus den Semantik-Tokens
(Ebene 2/3), committet unter `packages/color-scheme/generated/`. Das Auslesen
eines Modes liegt in `plugins/mode-tokens.ts` (fehlende oder nicht-OKLCH-Tokens
werden über den Logger gemeldet, es entsteht nie eine Teildatei).

### Claude Code (`claude-code/samisdat.json`)

- Nur Dark: `base: dark`, Overrides in Hex für Text, Status, Rahmen, Diff,
  Nutzernachricht, Selection und die acht Subagent-Farben.
- Die Wort-Diff-Varianten (`diffAddedWord`, `diffRemovedWord`) sind der
  Zeilenhintergrund, in OKLCH zu 30 % in Richtung `ink.jade` bzw. `ink.ruby`
  gemischt.
- Shimmer-Tokens erbt das Preset; der Verlauf bleibt stimmig, ohne dass wir
  jeden Zwischenton pflegen.

### pi (`pi/samisdat.json`)

- Alle 51 Pflichtfarben plus `thinkingMax`, als OKLCH-Strings; pi mappt selbst
  in sRGB. Die Datei erfüllt pis `theme-schema.json`.
- `thinking*` ist eine Rampe von kalt/leise nach warm/laut:
  `border.muted` → Blau → Türkis → Grün → Gelb → Orange → Pink.

### Artifacts (`artifact/`)

- `samisdat.css`: Dark als Default auf `:root`, Light auf
  `:root[data-theme="light"]`. Variablennamen wie auf der Website
  (`--color-<pfad>`), ohne Ebene 1 und `terminal.*`. Kein Morphing.
- `instructions.md`: kompakter Text für die Custom Instructions in claude.ai
  mit den Regeln und 20 Rollen als Hex (dark / light). Der Build bricht bei
  mehr als 3000 Zeichen ab; das ist eine Annahme, das tatsächliche Limit ist
  nicht verifiziert.
- `SKILL.md`: Claude-Code-Skill `samisdat-artifacts` mit demselben
  Zwei-Mode-CSS.
- **Dark ist der Default.** Light gilt nur auf Anfrage („hell“, „light“,
  Druck, PDF); Claude setzt dann `data-theme="light"` auf `<html>`. PDFs ohne
  CSS (reportlab, kein OKLCH) nutzen die Light-Hex-Werte.
- **Kartenregel:** `surface.raised` ist `neutral-only`. Karten tragen deshalb
  nur `text.default`, `-emphasis` und `-secondary`; Akzenttext (`ink.*`) steht
  nur auf `surface.default` oder `syntax.background`.

### Kontrast

`scripts/lint-llm-themes.ts` (Teil von `lint`) prüft die Paare, die die
generierte Rollenmatrix nicht abdeckt, mit WCAG ≥ 4,5:1: Diff-Hintergründe,
`text.secondary` und `ink.amethyst` auf `surface.raised` (Dark) sowie die
Kartentexte auf `surface.raised` in beiden Modes. Beim Aufsetzen ist der Lint
dreimal angeschlagen (`text.subtle` auf `surface.raised` 3,24:1,
`text.secondary` und `ink.amethyst` auf `surface.subtle` unter 4,5:1); das
Mapping wurde daraufhin angepasst, nicht der Schwellwert.

### Konsequenzen

- `.gitignore` nimmt `packages/color-scheme/generated/**/*.md` von der
  UPPERCASE-Regel (ADR 0013) aus. Wegen `core.ignorecase` traf sie auch
  `instructions.md`.
- Aktiviert wird nicht im Repo, sondern per Symlink bzw. Einfügen in claude.ai
  (siehe README des Pakets).

## Begründung

- **Nur Dark für Claude Code und pi**: Terminal und Editor laufen dunkel; ein
  zweites Theme wäre ungenutzter Pflegeaufwand.
- **Dark-Default mit Light auf Anfrage für Artifacts**: Artifacts landen auch
  in Dokumenten und PDFs, wo hell sinnvoll ist. `prefers-color-scheme` wurde
  verworfen: Das Artifact-Fenster folgt dem Systemmodus, nicht dem Zweck des
  einzelnen Dokuments.
- **Gleiche Variablennamen wie die Website**: Ein Artifact lässt sich ohne
  Umbenennen in die Website übernehmen; Claude braucht nur ein Vokabular.
- **Reduzierte Rollenliste in den Instructions**: Zwei vollständige Hex-Sätze
  sprengen das Zeichenlimit. Das volle CSS liegt im Skill und kann in ein
  Claude-Design-System-Artifact übernommen werden.
- **Generieren statt von Hand pflegen**: Alle Werte folgen den Tokens und damit
  den bestehenden Kontrast-, APCA- und Farbfehlsichtigkeits-Gates.
- **Ein gemeinsamer Helper** statt je Plugin eigener Mode-Auflösung.

## Verworfen

- Gemini CLI und OpenAI Codex CLI: nicht genutzt.
- Light-Mode für Claude Code und pi: kein Bedarf.
- Theme-Morphing (`--theme-progress`) in Artifacts: nur für die Website sinnvoll.
