# ADR 0019: Color Scheme als eigenes Paket

Datum: 2026-10-05 · Status: Akzeptiert

## Kontext

Das Farbschema lebt in `packages/ui-components/src/tokens/`:

- `color/primitives.ts`: 11 absolute OKLCH-Werte.
- `color/derived.ts`: Abstufungen per Relative Color Syntax
  (`oklch(from var(--primitive-ivory) calc(l - 0.07) c h)`), also erst im
  Browser berechnet. Namen adjektivisch (`deep`, `raised`, `muted`,
  `-on-dark`, `-on-light`).
- `themes.ts`: Rollen (`color-background-*`, `color-foreground-*`) und
  Farbtöne (`color-red` …) pro Theme, Light-Theme per
  `color-mix(… var(--theme-progress))` morphend.

Probleme:

- **Kein Werkzeug kennt die tatsächlichen Werte.** Kontrast steht nur
  geschätzt in `contrast.md`; Shiki, Terminal und Editor können keine
  Relative Color Syntax auswerten.
- **WCAG AA wird verletzt.** Nachgerechnet: `purple` auf dem
  Seitenhintergrund 3.99:1, `ivory-dim` 2.87:1, nahezu alle Akzente auf
  `aubergine-raised` unter 3:1. Sichtbar wurde das, als Codefarben aus
  Shiki im Fließtext genutzt wurden: Der Codeblock-Hintergrund ist dunkler
  als die Seite, die Farben waren nur gegen ihn abgestimmt.
- **Shiki-Theme ist defekt.** `getTextMateColorSchema` greift auf Keys zu,
  die `getColorHexMap()` nicht liefert (`darkestBg`, `lightFg`,
  `purpleAlpha66` …), ignoriert den Mode und liefert nur Dark.
- **Namespace-Kollision.** Panorama definiert eigene `--color-*`-Variablen
  (`--color-aubergine`).

Das Schema soll künftig geteilt werden: Website und Shiki jetzt,
nvim/zsh/herdr und LLM-CLIs (Claude, Gemini, OpenAI) später.

## Entscheidung

Neues Paket `@samisdat/color-scheme` (`packages/color-scheme`).

### Quelle und Build

- **Absolute OKLCH-Werte** sind die Quelle der Wahrheit. Ein Generator darf
  Skalen vorschlagen; committet werden die ausgeschriebenen Werte.
- **Format: W3C DTCG** (`*.tokens.json`, Spec 2025.10). Modes über den
  DTCG-Resolver (`*.resolver.json`, Modifier `mode`), nicht über das
  veraltete `$extensions.mode`.
- **Build und Lint: Terrazzo** (`@terrazzo/cli`, Plugins `css` und `js`).
  Ebene 1 wird per `exclude: ['color.**']` aus dem CSS entfernt; ein
  `transform` mit `transformAlias` setzt die Literale in die Aliase ein.
- **Generierte Artefakte werden committet** (`generated/`, als
  `linguist-generated` markiert). CI baut neu und prüft per
  `git diff --exit-code`.

### Drei Ebenen

| Ebene | Inhalt | Im Web |
|---|---|---|
| 1 · Wert | Volle Skalen `50–950` (50 = hell) | keine CSS-Variable; TS-Import |
| 2 · Bedeutung | `surface`, `text`, `border`, `ink.<hue>`, `status`, `selection`, `highlight` | `--color-<pfad>` |
| 3 · Einsatzort | geteilte Orte: `syntax.*`, später `terminal.*` | `--color-<pfad>` |

- **Ebene 1**: Skalen für `aubergine`, `ivory` (Eigennamen der
  Markenfarben) und generisch benannte Akzente (`red`, `orange`, `yellow`,
  `green`, `teal`, `cyan`, `blue`, `purple`, `pink`). Hue bleibt über die
  Skala konstant; Abweichungen werden in `$description` begründet. Im Web
  gelangt Ebene 1 nur per typisiertem TS-Import ins CSS (Linaria setzt das
  Literal ein, der Bundler verwirft Ungenutztes).
- **Ebene 2**: `ink.<hue>` ist der Satz lesbarer Akzentfarben mit
  Kontrastgarantie; `status.*` sind Aliase darauf.
- **Ebene 3**: Geteilte Einsatzorte liegen im Paket. `syntax.*` folgt dem
  Vokabular der Neovim-Tree-sitter-Captures (`keyword`, `string`,
  `function`, `tag`, `tag.attribute` …), mit `fontStyle` neben der Farbe.
  App-spezifische Einsatzorte liegen im App-Package; für die Website
  bleibt Ebene 3 vorerst leer.
- **Modes**: dark und light, jeweils vollständig. Weitere Modes sind nur
  zusätzliche Daten.
- **Nur deckende Farben**, keine Alpha-Werte.

### Barrierefreiheit (WCAG 2.2 AA)

- Die Prüfmatrix wird aus Rollen generiert, nicht von Hand gepflegt:
  - `text.*` und `ink.*` auf jedem Surface mit `textTier: full`: ≥ 4.5:1
  - `border.strong`, `border.focus` auf jedem Surface: ≥ 3:1
  - `syntax.*` auf `syntax.background` und `surface.default`: ≥ 4.5:1
- Surfaces tragen `textTier: full | neutral-only`. Auf `neutral-only`
  stehen nur `text.default` und `text.emphasis`.
- Auch `text.muted` und Code-Kommentare erfüllen 4.5:1.
- Ausnahmen (dekorativ, deaktiviert) stehen begründet im Token unter
  `$extensions`.
- Geprüft werden die Endpunkte des Theme-Morphings, nicht Zwischenframes.

### Konsumenten

- **Website**: Das Paket liefert typisierte Werte pro Mode;
  `ui-components` rendert das CSS und behält das Morphing über
  `--theme-progress`.
- **Shiki**: Ein generiertes Theme setzt `var(--color-syntax-*)` als
  Farbe. Codeblock folgt dem Theme (hell im Light Mode); Inline-Code nutzt
  dieselben Variablen. Für Konsumenten ohne CSS erzeugt der Generator Hex
  pro Mode.
- **Panorama** (nicht Teil dieser Umsetzung): eigene DTCG-Datei im
  Panorama-Package, Namespace `--panorama-*`, nur Ebene 1, keine Modes,
  vom Kontrast-Lint ausgenommen, Eigennamen erlaubt.

### Tooling

- **Storybook**: Contrast Grid (Pflichtpaare hervorgehoben, pro Mode),
  Paletten-Ansicht mit L/C-Kurve, Syntax-Vorschau (Codeblock und Fließtext
  mit Inline-Code).
- **Lints**:
  - Kontrast: Terrazzo `a11y/min-contrast`, Paare in `terrazzo.config.ts`
    generiert. Die Regel sieht nur den Default-Mode, deshalb läuft der
    Check einmal pro Mode (`MODE=dark|light`).
  - Gamut: Terrazzo `core/max-gamut` mit `gamut: 'srgb'`.
  - Skala (L monoton, Mindestabstand) und Architektur (kein Hex, kein
    `var(--color-<palette>-<n>)` in Komponenten): eigene Skripte.
- **Ausführung**: `pnpm lint:tokens` in CI, `pnpm dev:tokens` als Watch.
- **Später** (mit Terminal/nvim): Unterscheidbarkeit der Ink-Farben unter
  Farbfehlsichtigkeit (ΔE OK), APCA als Zusatzinfo.

### Migration

1. Paket mit Ebene 1; bestehende Werte auf Skalen gelegt, ohne visuelle
   Änderung.
2. Ebene 2 mit Alias-Brücke, Nutzungen migrieren, alte Variablen entfernen.
3. Storybook-Ansichten und Kontrast-Lint mit Baseline; neue Verstöße
   brechen CI.
4. Werte korrigieren, bis die Baseline leer ist.
5. Shiki über `syntax.*`, heller Codeblock, Inline-Code.

## Begründung

- **Absolute Werte** machen Kontrast prüfbar und Hex-Ausgaben für
  Nicht-Web-Konsumenten möglich.
- **DTCG** ist ein Austauschformat; Terrazzo, Style Dictionary, Figma und
  Tokens Studio lesen es. Ein Toolwechsel erfordert keine Datenmigration.
- **Terrazzo** bringt Kontrast- und Gamut-Lint sowie Modes mit; das Gate
  entsteht überwiegend aus Konfiguration, ergänzt um einen Lauf pro Mode.
- **Tailwind-Nummern** statt Adjektiven: allgemein bekannt, beliebig
  erweiterbar, keine Diskussion über „darker“ vs. „deeper“.
- **Ink auf Ebene 2** bündelt die Kontrastgarantie an einer Stelle;
  Shiki, Terminal und Website erben sie über Aliase.
- **Tree-sitter-Vokabular** für `syntax.*` erspart nvim später jede
  Übersetzung; die einzige Übersetzung ist die nach TextMate-Scopes.
- **CSS-Variablen im Shiki-Theme** lösen Theme-Wechsel, Morphing und
  Inline-Code mit einem Mechanismus.
- **Nur deckende Farben** halten das Schema portabel (Terminals können kaum
  Alpha) und die Kontrastprüfung deterministisch.

## Konsequenzen

- Hellere Flächen (`raised`, `emphasis`) tragen keine Akzentfarben als
  Text mehr; Callouts mit Inline-Code nutzen ein `full`-Surface.
- Die Website ändert sich in Phase 4 sichtbar.
- `color/derived.ts`, `colorVars.ts`, `colorProperties.ts`, `contrast.md`
  und der Workbench-Teil von `getTextMateColorSchema` entfallen.
- Generierte Dateien erscheinen in Diffs; GitHub klappt sie ein.
- ADR 0007 bleibt gültig; die Theme-Erzeugung wandert in das neue Paket.

## Umsetzung

Abweichungen bei der Umsetzung von Phase 5:

- Token-IDs von `syntax.*` ersetzen den Punkt im Capture-Namen durch `-`
  (`syntax.tag-attribute`, `syntax.diff-plus`), weil DTCG ein Token nicht
  zugleich als Gruppe erlaubt (`tag` und `tag.attribute`). Die CSS-Variable
  heißt dadurch ebenfalls `--color-syntax-tag-attribute`.
- `syntax.string-special` (Capture `string.special`) deckt Regex und
  Escape-Sequenzen ab.
- Das Shiki-Theme bleibt typstrukturell kompatibel zu `ThemeRegistration`,
  das Paket hängt nicht von `shiki` ab. `ui-components` re-exportiert es
  typisiert als `@samisdat/ui-components/utils/shikiTheme`.
- Der Scholion-Controller reicht die Variable des Token-Spans weiter statt
  der berechneten Farbe, damit Linien und Lemmas bei Theme-Wechsel und
  Morphing mitlaufen.
