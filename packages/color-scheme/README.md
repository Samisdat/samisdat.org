# @samisdat/color-scheme

Gemeinsames Farbschema für Website, Shiki und später Terminal/Editor. Entscheidungen: [ADR 0019](../../docs/adrs/0019-color-scheme.md).

Quelle der Wahrheit sind absolute OKLCH-Werte im W3C-DTCG-Format (`tokens/*.tokens.json`). [Terrazzo](https://terrazzo.app) lintet und erzeugt daraus die committeten Artefakte in `generated/`.

## Ebenen

| Ebene | Inhalt | Status |
|---|---|---|
| 1 · Wert | Skalen `50–950` (50 = hell) für `aubergine`, `ivory`, `red`, `orange`, `yellow`, `green`, `teal`, `cyan`, `blue`, `periwinkle`, `purple`, `pink` | vorhanden (`tokens/primitives.tokens.json`) |
| 2 · Bedeutung | `surface`, `text`, `ink.<hue>`, `ink.comment`, `status` (weitere Rollen folgen) | vorhanden (`tokens/dark.tokens.json`, `tokens/light.tokens.json`) |
| 3 · Einsatzort | `syntax.*`, später `terminal.*` | `syntax.*` vorhanden (in `tokens/dark.tokens.json`, `tokens/light.tokens.json`) |

Ebene 1 wird nie zu einer CSS-Variable. Im Web gelangt sie als typisierter Import ins CSS:

```ts
import { ivory } from "@samisdat/color-scheme/primitives";

const Box = styled.div`
  background: ${ivory[200]};
`;
```

Importe immer über die Subpfade `@samisdat/color-scheme/primitives`, `/semantic`, `/shiki`, `/contrast`, `/apca`. Einen Sammel-Export gibt es bewusst nicht: wyw-in-js (Linaria) kennt für eine reine Re-Export-Datei keinen Abhängigkeitsgraphen und bricht den Build mit `UnknownDependencyGraphResetError` ab.

Welcher alte Name (`ivory-soft`, `red-on-light` …) auf welcher Stufe gelandet ist, steht im `$description` der jeweiligen Stufe.

## Farbe hinzufügen oder ändern

1. Wert in `tokens/primitives.tokens.json` ändern. Token-IDs: `color.<hue>.<step>`. Wert als `{"colorSpace": "oklch", "components": [L, C, H]}` mit L in 0–1.
2. Neue Hue zusätzlich in `HUES` in `scripts/shared.ts` eintragen.
3. `pnpm lint:tokens` im Repo-Root ausführen; das baut `generated/` neu. Geänderte Dateien in `generated/` mit committen.

Regeln (werden gelintet): Werte liegen in sRGB (`core/max-gamut`), L fällt von 50 nach 950 strikt, benachbarte Stufen unterscheiden sich um mindestens ΔL 0,02, jede Hue hat alle elf Stufen. Die Hue bleibt über die Skala konstant; Abweichungen stehen begründet im `$description`.

Für eine neue Hue schlägt `pnpm --filter @samisdat/color-scheme generate:scale` eine Skala vor (gemeinsame L-Kurve, Chroma zu den Enden hin abnehmend). Das Skript gehört nicht zum Build; die ausgeschriebenen Werte werden committet und von Hand nachgezogen. Achtung: `generate:scale --write` überschreibt die Token-Datei.

## Skripte

Im Package (`pnpm --filter @samisdat/color-scheme <script>`):

| Skript | Zweck |
|---|---|
| `build` | `tz build`: Lint plus `generated/` neu erzeugen |
| `lint` | `tz check` (Terrazzo-Regeln), `scripts/lint-scale.ts`, `lint:contrast`, `scripts/lint-distinct.ts`, `scripts/lint-cvd.ts` und `scripts/lint-apca.ts` |
| `lint:contrast` | Kontrast-Lint pro Mode plus Baseline-Konsistenz (siehe unten) |
| `contrast:baseline` | `contrast-baseline.json` aus den aktuellen Werten neu erzeugen |
| `dev` | `tz build --watch` |
| `generate:scale` | Skalenvorschlag ausgeben (`--write [datei]`, `--migration`) |

Im Repo-Root: `pnpm lint:tokens` (build, lint und Prüfung, dass `generated/` aktuell ist; läuft in CI), `pnpm dev:tokens` (Watch).

## Kontrast (WCAG 2.2 AA)

Die Prüfmatrix wird aus den Token-Dateien abgeleitet (`src/contrast.ts`, Export `@samisdat/color-scheme/contrast`), pro Mode, nicht von Hand gepflegt:

- `text.*` und `ink.*` auf jedem Surface mit `textTier: "full"`: ≥ 4,5:1
- `text.default` und `text.emphasis` auf Surfaces mit `textTier: "neutral-only"`: ≥ 4,5:1
- `status.*` sind Aliase auf `ink.*` und werden nicht doppelt geprüft (`danger` → `ink.red`, `warning` → `ink.orange`, `success` → `ink.green`, `info` → `ink.blue`, in beiden Modes; `ink.yellow` taugt im Light Mode nicht als Warnfarbe, er wirkt olivbraun)
- Tokens mit `$extensions["org.samisdat.a11y"].exempt` (Begründung als String) sind ausgenommen
  (z. B. `surface.muted`: nur Rahmen und Fortschrittsbalken, kein Text)
- Jeder `syntax.*`-Vordergrund (alle außer `syntax.background`) auf `syntax.background` UND auf `surface.default`, ≥ 4,5:1: Codeblock und Inline-Code im Fließtext. `syntax.background` trägt `textTier: "full"`.
- Platzhalter für `border.*` (≥ 3) steht als Kommentar in `src/contrast.ts`; kommt mit den Tokens

Pair-IDs haben die Form `dark:text.muted/surface.default`.

**Lint** (`lint:contrast`, Teil von `lint` und damit von `pnpm lint:tokens`): Terrazzos `a11y/min-contrast` sieht nur den Default-Mode. Deshalb lädt `terrazzo.contrast.config.ts` Primitives plus genau eine Mode-Datei und läuft zweimal (`MODE=dark|light`) über Matrix minus Baseline. Danach prüft `scripts/lint-contrast.ts`, dass jeder Baseline-Eintrag noch in der Matrix existiert und noch fehlschlägt. Terrazzo nennt Paare nur mit Index (`Pair 6 failed`); Reihenfolge ist die der Matrix.

**Baseline** (`contrast-baseline.json`): bekannte Verstöße mit ihrem Verhältnis. Seit Phase 4 ist sie leer; ein neuer Verstoß ist zu beheben, nicht einzutragen. Der Mechanismus bleibt für bewusste, begründete Ausnahmen. Workflow:

1. Wert korrigieren (`tokens/*.tokens.json`), `pnpm lint:tokens`.
2. Meldet der Lint „now passes, remove from baseline“: `pnpm --filter @samisdat/color-scheme contrast:baseline` ausführen und die kleinere Datei committen.
3. Die Datei nie von Hand vergrößern; ein neuer Verstoß ist zu beheben, nicht einzutragen.

**Unterscheidbarkeit der Inks** (`scripts/lint-distinct.ts`, Teil von `lint`): Kontrast zur Fläche allein trennt die Farbtöne nicht; im Light Mode liegen alle Inks bei ähnlichem L. Deshalb nutzt der Light Mode Lightness als zweite Achse (L 0,33–0,42, die Inks sitzen auf den Stufen 700–900, Hue teils gegenüber der Skala verschoben; steht im `$description` der Stufe). Der Lint prüft pro Mode paarweise die Distanz aller `ink.*` im OKLab (Euklidisch, ΔE OK, `culori` `differenceEuclidean('oklab')`) auf ≥ 0,08, verglichen ohne Rundung (der Rohwert zählt), und nennt fehlschlagende Paare mit Namen und Werten. Dark Mode: kleinste Distanz 0,0820 (orange ~ yellow), Light Mode: 0,0820 (green ~ teal). Die Werte sind auf eine Marge von 0,002 über der Schwelle abgestimmt (Ziel ≥ 0,082); neue Inks brauchen entsprechend Luft. `ink.comment` ist Teil der Inks und erfüllt die Schwelle in beiden Modes.

**Farbfehlsichtigkeit** (`scripts/lint-cvd.ts`, Teil von `lint`): Unter Farbfehlsichtigkeit fallen Ink-Paare zusammen, die für normales Sehen klar getrennt sind. Der Lint simuliert pro Mode Protanopie, Deuteranopie und Tritanopie (`culori` `filterDeficiencyProt(1)`, `filterDeficiencyDeuter(1)`, `filterDeficiencyTrit(1)`; Machado 2009, Schweregrad 1) und verlangt ΔE OK ≥ 0,04 (OKLab, Euklidisch)

- für jedes Paar aus allen `ink.*` (inkl. `ink.comment`)
- zwischen jedem `ink.*` und `text.default` / `text.secondary`

Fehlschlagende Paare erscheinen mit Simulationstyp, Originalwert und simuliertem Hex. Schwelle 0,04 ist niedriger als die 0,08 ohne Simulation, weil die Simulation Farbraum nimmt; vorher lag das Minimum bei 0,016 (dark) bzw. 0,019 (light). Verglichen wird der Rohwert, ohne Rundung. Aktuelle Minima (Ziel ≥ 0,041): dark 0,0414 (Protanopie, cyan ~ text.secondary), 0,0410 (Deuteranopie, blue ~ pink), 0,0411 (Tritanopie, purple ~ text.secondary); light 0,0411 (Protanopie, orange ~ yellow), 0,0410 (Deuteranopie, teal ~ text.secondary), 0,0410 (Tritanopie, orange ~ pink).

**Kommentare** (zweiter Teil von `lint-distinct.ts`): `syntax.comment` muss sich von jedem anderen Syntax-Vordergrund (alle `syntax.*` außer `syntax.background`) um ΔE OK ≥ 0,08 unterscheiden, pro Mode. So bleibt ein Kommentar auch gegen textbasierte Syntaxfarben (`variable`, `operator`, `punctuation`) eindeutig. Kleinste Distanz (Rohwert, ohne Rundung): Dark 0,0820 (zu `tag-attribute`), Light 0,0903 (zu `tag-attribute`).

**Storybook** (`pnpm storybook`, Gruppe „Color Scheme“): *Contrast Grid* (Vordergründe × Surfaces pro Mode, Pflichtpaare umrandet, übrige abgedunkelt, Baseline markiert, ausgenommene Surfaces als „exempt“ mit Begründung als Tooltip), *Palette* (Skalen mit L/C-Kurve, Ebene 2 mit Alias und Wert) und *Syntax Preview* (Codeblock und Inline-Code in hell/dunkel; das Contrast Grid hat zusätzlich je Mode einen Abschnitt „Syntax“). Die Daten kommen aus `generated/` und dem Kontrast-Modul, nicht aus berechnetem CSS.

## APCA (zweites Gate)

WCAG 2 überschätzt hellen Text auf dunklem Grund: Die Dark-Mode-Inks erreichten 5,2:1 und mehr, kamen aber nur auf APCA Lc 36–51 (Polaritätsschwäche des WCAG-2-Verhältnisses). Deshalb gilt neben WCAG ein zweites Gate (`src/apca.ts`, Export `@samisdat/color-scheme/apca`, `scripts/lint-apca.ts`, Teil von `lint`; Berechnung mit `apca-w3` 0.1.9):

| Vordergrund | Hintergrund | Schwelle |  Wirkung |
|---|---|---|---|
| jedes `ink.*`, jeder `syntax.*`-Vordergrund | `syntax.background` und `surface.default` | \|Lc\| ≥ 60 | Fehler |
| `text.default` | `syntax.background` und `surface.default` | \|Lc\| ≥ 75 | nur Warnung (dark auf `surface.default`: 74) |

Verglichen wird der Betrag (Polarität egal) ohne Rundung: Lc 59,7 besteht die Schwelle 60 nicht. Der Lint druckt die vollständige Lc-Tabelle pro Mode mit einer Nachkommastelle. Die Werte sind auf Lc ≥ 60,5 abgestimmt, damit sie nicht auf der Schwelle sitzen (Ausnahme: dark `ink.red`).

**Ausnahme**: `$extensions["org.samisdat.a11y"].apcaMin` (Zahl) und `apcaReason` (deutsche Begründung) am Ebene-2-Token. `syntax.*` und `status.*`, die auf ein solches Token zeigen, erben die Ausnahme (`keyword`, `diff-minus`, `status.danger` …). Aktuell eine Ausnahme:

- dark `ink.red`: `apcaMin` 40. Bewusst kräftiges Rot für `keyword`; Entscheidung gegen einen Lachs-Ton, Lc ≈ 44.

Im Storybook zeigt das Contrast Grid in jeder Zelle `WCAG · Lc` (z. B. „5.52 · Lc 42.7“) und markiert Zellen unter dem jeweiligen APCA-Minimum.

## Ink-Werte

Level-2-Token → Stufe → Wert; WCAG / Lc jeweils auf `syntax.background` und `surface.default`.

Dark:

| Token | Stufe | OKLCH | `syntax.background` | `surface.default` |
|---|---|---|---|---|
| `ink.red` | `red.500` | `oklch(0.68 0.208 25)` | 6,24 · Lc 43,8 | 5,52 · Lc 42,7 |
| `ink.orange` | `orange.400` | `oklch(0.775 0.119 69)` | 9,53 · Lc 61,6 | 8,42 · Lc 60,5 |
| `ink.yellow` | `yellow.300` | `oklch(0.832 0.162 85.7)` | 11,69 · Lc 72,6 | 10,34 · Lc 71,5 |
| `ink.green` | `green.400` | `oklch(0.746 0.172 158.1)` | 9,43 · Lc 61,6 | 8,34 · Lc 60,5 |
| `ink.teal` | `teal.400` | `oklch(0.793 0.132 202.6)` | 10,86 · Lc 68,9 | 9,61 · Lc 67,8 |
| `ink.cyan` | `cyan.400` | `oklch(0.782 0.048 198.4)` | 10,16 · Lc 64,7 | 8,98 · Lc 63,6 |
| `ink.blue` | `blue.400` | `oklch(0.767 0.125 248)` | 9,53 · Lc 61,6 | 8,43 · Lc 60,5 |
| `ink.purple` | `purple.400` | `oklch(0.777 0.078 303.2)` | 9,56 · Lc 61,6 | 8,45 · Lc 60,5 |
| `ink.pink` | `pink.300` | `oklch(0.807 0.189 326.9)` | 10,02 · Lc 64,4 | 8,86 · Lc 63,3 |
| `ink.comment` | `periwinkle.300` | `oklch(0.838 0.08 262.6)` | 12,02 · Lc 74,0 | 10,63 · Lc 72,9 |

Light:

| Token | Stufe | OKLCH | `syntax.background` | `surface.default` |
|---|---|---|---|---|
| `ink.red` | `red.800` | `oklch(0.416 0.155 12.5)` | 6,86 · Lc 69,7 | 5,84 · Lc 60,5 |
| `ink.orange` | `orange.800` | `oklch(0.404 0.102 53.4)` | 6,88 · Lc 70,9 | 5,86 · Lc 61,8 |
| `ink.yellow` | `yellow.800` | `oklch(0.33 0.069 75.8)` | 9,04 · Lc 77,7 | 7,70 · Lc 68,5 |
| `ink.green` | `green.800` | `oklch(0.377 0.084 139.9)` | 7,18 · Lc 72,3 | 6,12 · Lc 63,2 |
| `ink.teal` | `teal.800` | `oklch(0.407 0.041 204.9)` | 6,43 · Lc 69,7 | 5,48 · Lc 60,6 |
| `ink.cyan` | `cyan.900` | `oklch(0.326 0.054 204.2)` | 8,89 · Lc 77,1 | 7,57 · Lc 67,9 |
| `ink.blue` | `blue.700` | `oklch(0.422 0.237 269.5)` | 6,79 · Lc 69,7 | 5,78 · Lc 60,5 |
| `ink.purple` | `purple.800` | `oklch(0.37 0.192 305)` | 8,49 · Lc 74,3 | 7,23 · Lc 65,2 |
| `ink.pink` | `pink.800` | `oklch(0.392 0.168 342.4)` | 7,66 · Lc 71,9 | 6,52 · Lc 62,8 |
| `ink.comment` | `periwinkle.700` | `oklch(0.422 0.138 287.2)` | 6,48 · Lc 69,7 | 5,52 · Lc 60,5 |

Hue-, Chroma- und L-Abweichungen von der Skala stehen im `$description` der jeweiligen Stufe. Die Werte sind auf eine kleine Marge über den Schwellen von Unterscheidbarkeit (ΔE OK 0,08 → Ziel 0,082), Farbfehlsichtigkeit (0,04 → 0,041) und APCA (60 → 60,5) abgestimmt, die Gates selbst vergleichen exakt; eine Änderung an einem Ink verschiebt meist mehrere Lints gleichzeitig.

## Syntax (Ebene 3)

`syntax.*` folgt dem Vokabular der Neovim-Tree-sitter-Captures. Werte sind ausschließlich Aliase auf Ebene 2 (`ink.*`, `text.*`, `surface.*`), pro Mode in `tokens/<mode>.tokens.json`. Das ist dieselbe Datei wie Ebene 2, weil die Aliase dort aufgelöst werden und die Mode-Dateien ohnehin vollständig sein müssen; eigene Dateien brächten nur einen zusätzlichen Resolver-Eintrag. Alle Aliase sind in beiden Modes gleich, nur `syntax.background` unterscheidet sich.

Token-ID: Capture mit `-` statt `.` (`tag.attribute` → `syntax.tag-attribute`), weil DTCG kein Token zugleich als Gruppe erlaubt (`tag` und `tag.attribute`). CSS-Variable: `--color-syntax-tag-attribute`. `fontStyle` steht in `$extensions["org.samisdat.syntax"].fontStyle` (bisher nur `comment`: `italic`).

**Kommentarregel**: Kommentare haben eine eigene, farbige Ink-Rolle `ink.comment` (Hue `periwinkle`, Blauviolett, Hue 285) und liegen nie auf einer `text.*`-Farbe. Warmgraue Kommentare waren von `punctuation` kaum zu trennen (ΔE OK 0,037 dark / 0,064 light). `ink.comment` = dark `color.periwinkle.300` (`oklch(0.838 0.08 262.6)`: 12,02:1 auf `syntax.background`, 10,63:1 auf `surface.default`), light `color.periwinkle.700` (`oklch(0.422 0.138 287.2)`: 6,48:1 / 5,52:1). `punctuation` zeigt dafür auf `text.secondary` (wie `operator`).

| Capture | Alias | Gedacht für |
|---|---|---|
| `foreground` | `text.default` | Grundfarbe |
| `background` | dark `surface.emphasis`, light `surface.raised` | Codeblock; folgt dem Theme, dark dunkler und light heller als die Seite |
| `comment` | `ink.comment` (italic) | Kommentare; eigene Farbe, siehe unten |
| `keyword` | `ink.red` | `const`, `import`, `return`, Storage |
| `string` | `ink.orange` | Strings, Anführungszeichen, Template-Strings |
| `string.special` | `ink.cyan` | Regex, Escape-Sequenzen |
| `number` | `ink.green` | Zahlen, CSS-Einheiten |
| `constant` | `ink.green` | `true`, `null`, `this`, Konstanten |
| `function` | `ink.blue` | Funktions- und Methodennamen |
| `type` | `ink.cyan` | Typen, Klassen, Namespaces |
| `variable` | `text.default` | Variablen |
| `parameter` | `ink.yellow` | Parameter |
| `property` | `ink.teal` | Properties, Objekt-Keys, JSON-/CSS-Properties |
| `tag` | `ink.pink` | Tag-Namen samt `<` `>` |
| `tag.attribute` | `ink.purple` | Attribute |
| `operator` | `text.secondary` | Operatoren, `=>` |
| `punctuation` | `text.secondary` | Klammern, Trenner |
| `diff.plus` / `diff.minus` | `ink.green` / `ink.red` | Diff-Zeilen (Vordergrund, kein Alpha) |

Zuordnungsprinzip: Im Light Mode sind Gelb, Cyan, Lila, Rosa und Grün absichtlich dunkler (schwerer), Rot, Orange, Türkis und Blau heller. Da der Alias in beiden Modes gleich ist, liegen die schweren Inks auf seltenen Kategorien (`number`, `constant`, `tag.attribute`, `parameter`, `type`), die helleren auf häufigen (`keyword`, `string`, `function`, `property`). Geteilte Inks (`number`/`constant`, `type`/`string.special`) liegen auf Kategorien, die selten nebeneinander stehen.

**Capture hinzufügen**: Eintrag in `src/textmate-scopes.ts` (Capture plus TextMate-Scopes; dort ist die einzige Übersetzung Tree-sitter → TextMate), `syntax.<name>` in beiden Mode-Dateien, dann `pnpm lint:tokens`. Der Build bricht ab, wenn Tabelle und Token-Dateien auseinanderlaufen.

**Ausgaben**:

- `generated/shiki-theme.ts` (Export `@samisdat/color-scheme/shiki`, `shikiTheme`): ein Theme für beide Modes, alle Farben (`fg`, `bg`, `editor.*`, `tokenColors`) sind `var(--color-syntax-…)`. Der Browser löst sie über das aktive Theme auf, Morphing und Inline-Code funktionieren mit demselben Mechanismus. Kein leeres `settings: []` einfügen: es überschreibt `tokenColors`.
- `generated/shiki/dark.json`, `generated/shiki/light.json` (Export `@samisdat/color-scheme/shiki/*`): dasselbe Theme mit aufgelösten Hex-Werten pro Mode, für Konsumenten ohne CSS (nvim, Terminal).
- `syntax.*` steht außerdem in `generated/semantic.ts`; `ui-components` rendert daraus `--color-syntax-*` wie alle Ebene-2-Variablen.

Inline-Code im Fließtext: `` `code{:tsx}` `` (rehype-pretty-code) nutzt dasselbe Theme und damit dieselben Variablen. Scholion-Lemmas (`.ref-target`) übernehmen die Variable des zugehörigen Tokens im Codeblock.

## Generierte Dateien

- `generated/primitives.ts`: Ebene 1 als `oklch(…)`-Strings (`ivory[200]`, `type Hue`, `type Step`, `palette`).
- `generated/semantic.ts`: Ebene 2 als aufgelöste `oklch(…)`-Strings pro Mode (`semantic.dark["surface.default"]`, `type SemanticToken`, `type Mode`). Ebene 1 kommt darin nicht vor.
- `generated/shiki-theme.ts`, `generated/shiki/*.json`: siehe „Syntax“.
- `generated/index.ts`: Export `.` des Packages, re-exportiert beide Module.
- `generated/tokens.js`, `generated/tokens.d.ts`: Terrazzo-JS-Plugin, normalisierte Tokens pro Resolver-Permutation.

Nicht von Hand bearbeiten.
