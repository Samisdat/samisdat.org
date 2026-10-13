# @samisdat/color-scheme

Gemeinsames Farbschema für Website, Shiki und später Terminal/Editor. Entscheidungen: [ADR 0019](../../docs/adrs/0019-color-scheme.md).

Quelle der Wahrheit sind absolute OKLCH-Werte im W3C-DTCG-Format (`tokens/*.tokens.json`). [Terrazzo](https://terrazzo.app) lintet und erzeugt daraus die committeten Artefakte in `generated/`.

## Ebenen

| Ebene | Inhalt | Status |
|---|---|---|
| 1 · Wert | Skalen `50–950` (50 = hell) für `aubergine`, `ivory`, `linen`, `red`, `orange`, `yellow`, `green`, `teal`, `cyan`, `blue`, `periwinkle`, `purple`, `pink` | vorhanden (`tokens/primitives.tokens.json`) |
| 2 · Bedeutung | `surface`, `text`, `ink.<hue>`, `ink.lapis`, `status` (weitere Rollen folgen) | vorhanden (`tokens/dark.tokens.json`, `tokens/light.tokens.json`) |
| 3 · Einsatzort | `syntax.*`, später `terminal.*` | `syntax.*` vorhanden (in `tokens/dark.tokens.json`, `tokens/light.tokens.json`) |

Ebene 1 wird nie zu einer CSS-Variable. Im Web gelangt sie als typisierter Import ins CSS:

```ts
import { ivory } from "@samisdat/color-scheme/primitives";

const Box = styled.div`
  background: ${ivory[200]};
`;
```

Importe immer über die Subpfade `@samisdat/color-scheme/primitives`, `/semantic`, `/shiki`, `/contrast`. Einen Sammel-Export gibt es bewusst nicht: wyw-in-js (Linaria) kennt für eine reine Re-Export-Datei keinen Abhängigkeitsgraphen und bricht den Build mit `UnknownDependencyGraphResetError` ab.

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
| `lint` | `tz check` (Terrazzo-Regeln), `scripts/lint-scale.ts`, `lint:contrast`, `scripts/lint-distinct.ts`, `scripts/lint-cvd.ts`, `scripts/lint-fill.ts` |
| `lint:contrast` | Kontrast-Lint pro Mode plus Baseline-Konsistenz (siehe unten) |
| `contrast:baseline` | `contrast-baseline.json` aus den aktuellen Werten neu erzeugen |
| `names:inks` | Namensdistanz der Inks nach c3 (Heer & Stone) pro Mode ausgeben, nur Anzeige (siehe „Farbnamen“) |
| `compare:themes` | Syntaxfarben gegen bekannte Shiki-Themes messen und ranken, Bericht nach `reports/theme-compare/index.html` (gitignored; Methode und Grenzen in `scripts/theme-compare/README.md`) |
| `snapshot <id>` | Aktuellen Stand für einen Blogpost einfrieren: misst alles aus den Tokens und schreibt `packages/website/content/snapshots/<id>.json` (siehe „Snapshot für Blogposts“) |
| `dev` | `tz build --watch` |
| `generate:scale` | Skalenvorschlag ausgeben (`--write [datei]`, `--migration`) |

Im Repo-Root: `pnpm lint:tokens` (build, lint und Prüfung, dass `generated/` aktuell ist; läuft in CI), `pnpm dev:tokens` (Watch).

## Kontrast (WCAG 2.2 AA)

Die Prüfmatrix wird aus den Token-Dateien abgeleitet (`src/contrast.ts`, Export `@samisdat/color-scheme/contrast`), pro Mode, nicht von Hand gepflegt:

- `text.*` und `ink.*` auf jedem Surface mit `textTier: "full"`: ≥ 4,5:1
- `text.default` und `text.emphasis` auf Surfaces mit `textTier: "neutral-only"`: ≥ 4,5:1
- `text.default`, `text.emphasis`, jedes `ink.*` und jedes `syntax.*` auf Surfaces mit `textTier: "ink"`: ≥ 4,5:1. Das sind im Dark Mode `surface.raised`, `highlight` und `selection` (alle `#45385b`). Es gibt keine surface-spezifischen Inks: AAA auf diesen Flächen ergäbe Pastelltöne, die die Distinct-Lints nicht bestehen. `ink.ruby` hat dort mit 4,52:1 nur eine knappe Marge. Im Light Mode trägt nur `highlight` (`periwinkle.100`, L 0,93) `ink`, damit syntaxgefärbter Text in der Cursor-Zeile AA hält; `selection` (Visual, Suche) bleibt `neutral-only` und ist bewusst kräftig.
- `status.*` sind Aliase auf `ink.*` und werden nicht doppelt geprüft (`danger` → `ink.ruby`, `warning` → `ink.copper`, `success` → `ink.jade`, `info` → `ink.sapphire`, in beiden Modes; `ink.gold` taugt im Light Mode nicht als Warnfarbe, er wirkt olivbraun)
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

**Unterscheidbarkeit der Inks** (`scripts/lint-distinct.ts`, Teil von `lint`): Kontrast zur Fläche allein trennt die Farbtöne nicht. Der Lint prüft pro Mode paarweise die Distanz aller `ink.*` im OKLab (Euklidisch, ΔE OK, `culori` `differenceEuclidean('oklab')`), verglichen ohne Rundung (der Rohwert zählt), und nennt fehlschlagende Paare mit Namen und Werten. Schwellen pro Mode in `scripts/thresholds.ts`: **Dark ≥ 0,08, Light ≥ 0,05**. Light ist niedriger, weil Inks auf hellem Grund bei AA (4,5:1) nur ein schmales Helligkeitsband haben (L ≲ 0,52); die Inks sitzen auf Stufe 700 der Hue-Skalen, Hue gegenüber der Skala teils verschoben (steht im `$description` der Stufe). Die 0,05 liegen am schwächeren Ende der mit `compare:themes` gemessenen Light-Themes (kleinste Akzent-Distanz dort 0,053–0,099). Aktuelle Minima: Dark 0,0820 (copper ~ gold), Light 0,0699 (copper ~ gold). Dark ist auf eine Marge von 0,002 über der Schwelle abgestimmt (Ziel ≥ 0,082); neue Inks brauchen entsprechend Luft. `ink.lapis` ist Teil der Inks und erfüllt die Schwelle in beiden Modes.

**Farbfehlsichtigkeit** (`scripts/lint-cvd.ts`, Teil von `lint`): Unter Farbfehlsichtigkeit fallen Ink-Paare zusammen, die für normales Sehen klar getrennt sind. Der Lint simuliert pro Mode Protanopie, Deuteranopie und Tritanopie (`culori` `filterDeficiencyProt(1)`, `filterDeficiencyDeuter(1)`, `filterDeficiencyTrit(1)`; Machado 2009, Schweregrad 1) und verlangt ΔE OK ≥ 0,04 im Dark und ≥ 0,02 im Light (OKLab, Euklidisch; `scripts/thresholds.ts`)

- für jedes Paar aus allen `ink.*` (inkl. `ink.lapis`)
- zwischen jedem `ink.*` und `text.default` / `text.secondary`

Fehlschlagende Paare erscheinen mit Simulationstyp, Originalwert und simuliertem Hex. Schwelle 0,04 ist niedriger als die 0,08 ohne Simulation, weil die Simulation Farbraum nimmt; vorher lag das Minimum bei 0,016 (dark) bzw. 0,019 (light). Verglichen wird der Rohwert, ohne Rundung. Aktuelle Minima: dark 0,0414 (Protanopie, steel ~ text.secondary), 0,0410 (Deuteranopie, sapphire ~ rose), 0,0411 (Tritanopie, amethyst ~ text.secondary); light 0,0318 (Protanopie, copper ~ jade), 0,0388 (Deuteranopie, turquoise ~ steel), 0,0308 (Tritanopie, turquoise ~ sapphire). Die Light-Schwelle 0,02 liegt über dem Minimum von Solarized, Catppuccin und Rosé Pine (0,010–0,014), unter dem von Kanagawa (0,049).

**Kommentare** (zweiter Teil von `lint-distinct.ts`): `syntax.comment` muss sich von jedem anderen Syntax-Vordergrund (alle `syntax.*` außer `syntax.background`) um ΔE OK ≥ 0,08 unterscheiden, pro Mode. So bleibt ein Kommentar auch gegen textbasierte Syntaxfarben (`variable`, `operator`, `punctuation`) eindeutig. Kleinste Distanz (Rohwert, ohne Rundung): Dark 0,0820 (zu `tag-attribute`), Light 0,0903 (zu `tag-attribute`).

**Storybook** (`pnpm storybook`, Gruppe „Color Scheme“): *Contrast Grid* (Vordergründe × Surfaces pro Mode, Pflichtpaare umrandet, übrige abgedunkelt, Baseline markiert, ausgenommene Surfaces als „exempt“ mit Begründung als Tooltip), *Palette* (Skalen mit L/C-Kurve, Ebene 2 mit Alias und Wert) und *Syntax Preview* (Codeblock und Inline-Code in hell/dunkel; das Contrast Grid hat zusätzlich je Mode einen Abschnitt „Syntax“). Die Daten kommen aus `generated/` und dem Kontrast-Modul, nicht aus berechnetem CSS.

## Ink-Namen

`ink.*` heißt nach Materialien, nicht nach Farbtönen: `ruby`, `copper`, `gold`, `jade`, `turquoise`, `steel`, `sapphire`, `amethyst`, `rose`, `lapis` (früher `red`, `orange`, `yellow`, `green`, `teal`, `cyan`, `blue`, `purple`, `pink`, `comment`). Grund: Dieselbe Rolle ist im Dark hell und bunt, im Light dunkel; bei AAA auf hellem Grund wird Orange braun und Gelb olivbraun. Ein Name wie `orange` stimmt dann nur in einem Mode, `copper` in beiden. Die Skalen in Ebene 1 heißen weiter nach Farbton (`red.400`); nur Ebene 2 trägt die Materialnamen.

## Ink-Werte

Level-2-Token → Stufe → Wert; WCAG-Verhältnis jeweils auf `syntax.background` und `surface.default`.

Dark:

| Token | Stufe | OKLCH | `syntax.background` | `surface.default` |
|---|---|---|---|---|
| `ink.ruby` | `red.400` | `oklch(0.738 0.16 32)` | 8,01 | 7,10 |
| `ink.copper` | `orange.400` | `oklch(0.775 0.119 69)` | 9,53 | 8,42 |
| `ink.gold` | `yellow.300` | `oklch(0.832 0.162 85.7)` | 11,69 | 10,34 |
| `ink.jade` | `green.400` | `oklch(0.746 0.172 158.1)` | 9,43 | 8,34 |
| `ink.turquoise` | `teal.400` | `oklch(0.793 0.132 202.6)` | 10,86 | 9,61 |
| `ink.steel` | `cyan.400` | `oklch(0.782 0.048 198.4)` | 10,16 | 8,98 |
| `ink.sapphire` | `blue.400` | `oklch(0.767 0.125 248)` | 9,53 | 8,43 |
| `ink.amethyst` | `purple.400` | `oklch(0.777 0.078 303.2)` | 9,56 | 8,45 |
| `ink.rose` | `pink.300` | `oklch(0.807 0.189 326.9)` | 10,02 | 8,86 |
| `ink.lapis` | `periwinkle.300` | `oklch(0.838 0.08 262.6)` | 12,02 | 10,63 |

Light:

| Token | Stufe | OKLCH | `syntax.background` | `surface.default` |
|---|---|---|---|---|
| `ink.ruby` | `red.700` | `oklch(0.520 0.197 32)` | 5,48 | 4,93 |
| `ink.copper` | `orange.700` | `oklch(0.480 0.050 76.4)` | 5,93 | 5,33 |
| `ink.gold` | `yellow.700` | `oklch(0.519 0.108 77.2)` | 5,07 | 4,56 |
| `ink.jade` | `green.700` | `oklch(0.483 0.131 150.1)` | 5,48 | 4,92 |
| `ink.turquoise` | `teal.700` | `oklch(0.507 0.085 193.7)` | 5,03 | 4,52 |
| `ink.steel` | `cyan.700` | `oklch(0.464 0.028 199.6)` | 6,23 | 5,60 |
| `ink.sapphire` | `blue.700` | `oklch(0.492 0.096 240.6)` | 5,52 | 4,96 |
| `ink.amethyst` | `purple.700` | `oklch(0.514 0.155 299.1)` | 5,46 | 4,91 |
| `ink.rose` | `pink.700` | `oklch(0.530 0.245 326.9)` | 5,49 | 4,93 |
| `ink.lapis` | `periwinkle.700` | `oklch(0.494 0.239 262.6)` | 5,94 | 5,34 |

Hue-, Chroma- und L-Abweichungen von der Skala stehen im `$description` der jeweiligen Stufe. Dark ist auf eine kleine Marge über den Schwellen von Unterscheidbarkeit (ΔE OK 0,08 → Ziel 0,082) und Farbfehlsichtigkeit (0,04 → 0,041) abgestimmt, Light hat eigene, niedrigere Schwellen (siehe oben) und liegt ebenfalls knapp darüber. Die Gates selbst vergleichen exakt; eine Änderung an einem Ink verschiebt meist mehrere Lints gleichzeitig.

## Füllungen (`highlight`, `selection`)

`highlight` (nvim CursorLine, Dateibaum-Zeile, Picker-Auswahl) und `selection` (Visual, Suche) sind deckende Füllungen. Die Kontrastmatrix prüft nur Text darauf; eine lesbare Füllung, die fast so aussieht wie der Grund, fällt dort nicht auf (Light Mode hatte ΔE OK 0,06 gegen den Editor-Grund, die Zeile wirkte wie ein Loch). `scripts/lint-fill.ts` (Teil von `lint`) verlangt ΔE OK gegen `syntax.background` und `surface.default` (Schwellen in `scripts/thresholds.ts`: Dark 0,10 für beide, Light `highlight` 0,045 und `selection` 0,10) und `selection` mindestens so stark wie `highlight`, damit eine Auswahl in der Cursor-Zeile sichtbar bleibt. Dark: 0,220 / 0,150, Light: `highlight` 0,054 / 0,050 (`periwinkle.100`), `selection` 0,205 / 0,175 (`purple.400`). Light `highlight` ist so hell, weil jeder Ink darauf ≥ 4,5:1 halten muss; eine solche Füllung kommt dem Grund auf etwa ΔE 0,05 nahe, mehr gibt der Kontrast nicht her (gemessen, Gate 0,045).

## Farbnamen (nur Anzeige)

ΔE OK und die CVD-Simulation messen, wie weit zwei Inks wahrnehmungsmäßig auseinanderliegen, nicht, ob man sie auch *anders nennt*. Dafür gibt es `pnpm --filter @samisdat/color-scheme names:inks` (`scripts/name-distance.ts`): Farbnamen-Modell **c3** (Heer & Stone, CHI 2012; Daten: XKCD-Farbumfrage, 153 Namen auf einem CIELAB-Raster mit 8325 Zellen). Jeder Ink wird auf die nächste Modellzelle abgebildet (Abstand dazu ΔE 0,8–3,7, also im Raster); die Namensdistanz zweier Inks ist die Hellinger-Distanz ihrer Namensverteilungen (0 identisch, 1 ohne gemeinsamen Namen), wie `c3.color.hellinger` in der Originalbibliothek. Das Modell liegt unverändert in `vendor/c3/` (BSD-3-Clause, Stanford; Quelle, Commit und Lizenz in `vendor/c3/README.md`).

Stand: Dark 4, Light 3 von 45 Ink-Paaren teilen sich den wahrscheinlichsten Namen. Kleinste Namensdistanz Dark 0,260 (`ink.sapphire` ~ `ink.lapis`), Light 0,372 (`ink.copper` ~ `ink.gold`).

- Dark: `teal`, `cyan` und `blue` heißen alle vorwiegend „blue" (Distanz 0,38–0,52), `orange` und `yellow` „orange". `ink.lapis` wird „lightblue" genannt und liegt nah an `ink.sapphire`.
- Light: Bei AA liegen die Inks bei L 0,46–0,53. `ink.copper` und `ink.gold` heißen beide „brown“ (73 % / 71 %, Distanz 0,372); Gelb gibt es auf hellem Grund bei 4,5:1 nicht (c3 nennt Gelbtöne erst ab etwa L 0,70 noch „yellow“, dort liegt der Kontrast unter 2,5:1). `ink.sapphire` und `ink.lapis` sind „blue“, `ink.amethyst` und `ink.rose` „purple“. Deshalb heißen die Inks nach Materialien (siehe „Ink-Namen“).

**Entscheidung: kein Lint.** (1) Die Schwelle wäre willkürlich, c3 liefert keinen anerkannten Grenzwert; die Hellinger-Distanz hat keine Einheit wie ΔE. (2) Im Light Mode ist die Namensverschiebung eine Folge der dunklen Inks, die für Kontrast (WCAG) nötig sind; ein Gate würde Hue-Verschiebungen erzwingen, die gegen die bereits knapp abgestimmten ΔE-, CVD- und Kontrastgrenzen arbeiten (Marge 0,002). (3) Code-Farben werden über Position und Kontext gelesen, nicht über ihren Namen; die Namen helfen beim Besprechen („der blaue Ink"), nicht beim Lesen. (4) Das Modell stammt aus einer englischsprachigen Online-Umfrage von 2010 auf unkalibrierten Bildschirmen. Die Ausgabe ist ein Hinweis beim Ändern von Inks, kein Befund. Wenn ein Paar später in der Praxis verwechselt wird, ist ein Lint auf einzelne Paare (nicht auf alle) der nächste Schritt.

## Snapshot für Blogposts

Die Komponenten `ColorSchemeSnapshot` und `Snapshot*` (`packages/ui-components/src/ColorSchemeSnapshot`) zeigen das Schema in einem Post. Sie rechnen nichts und lesen weder Tokens noch CSS-Variablen der Seite, sondern nur eine JSON-Datei. So bleibt ein alter Post unverändert, wenn sich das Schema später ändert.

1. `pnpm build` (die Shiki-Themes werden aus `generated/` gelesen), dann `pnpm --filter @samisdat/color-scheme snapshot <id>`, z. B. `2026-10`.
2. Die Datei `content/snapshots/<id>.json` wird committet und danach nicht mehr geändert. Für ein Update einen neuen Snapshot mit neuer ID anlegen.
3. Im Post: `<ColorSchemeSnapshot id="2026-10">` als Rahmen, darin beliebige Bausteine (`SnapshotInks`, `SnapshotMatrix`, `SnapshotCode`, `SnapshotModes`, `SnapshotCvd`, `SnapshotDistinct`, `SnapshotScales`, `SnapshotExceptions`, `SnapshotEditor`) mit Text dazwischen. Beispiel: `content/posts/colorscheme-snapshot.mdx`.

Der Rahmen zeigt ID, Datum und Git-Hash (ein `+` heißt: zum Zeitpunkt lag Uncommittetes in diesem Paket) und hat einen eigenen Dunkel/Hell-Schalter. Er startet mit dem Seiten-Theme. Das Format steht in `scripts/snapshot/types.ts`; ändert es sich inkompatibel, wird `version` erhöht und die Komponenten müssen beide Versionen lesen.

Alle Werte kommen aus Skripten: WCAG-Kontrast aus `src/contrast.ts`/culori, Farbabstand und Farbfehlsichtigkeit mit culori, Farbnamen aus dem c3-Modell. Der Code im Beispiel steht in `scripts/snapshot/code-sample.ts`.

## Syntax (Ebene 3)

`syntax.*` folgt dem Vokabular der Neovim-Tree-sitter-Captures. Werte sind ausschließlich Aliase auf Ebene 2 (`ink.*`, `text.*`, `surface.*`), pro Mode in `tokens/<mode>.tokens.json`. Das ist dieselbe Datei wie Ebene 2, weil die Aliase dort aufgelöst werden und die Mode-Dateien ohnehin vollständig sein müssen; eigene Dateien brächten nur einen zusätzlichen Resolver-Eintrag. Alle Aliase sind in beiden Modes gleich, nur `syntax.background` unterscheidet sich.

Token-ID: Capture mit `-` statt `.` (`tag.attribute` → `syntax.tag-attribute`), weil DTCG kein Token zugleich als Gruppe erlaubt (`tag` und `tag.attribute`). CSS-Variable: `--color-syntax-tag-attribute`. `fontStyle` steht in `$extensions["org.samisdat.syntax"].fontStyle` (bisher nur `comment`: `italic`).

**Kommentarregel**: Kommentare haben eine eigene, farbige Ink-Rolle `ink.lapis` (Hue `periwinkle`, Blauviolett, Hue 285) und liegen nie auf einer `text.*`-Farbe. Warmgraue Kommentare waren von `punctuation` kaum zu trennen (ΔE OK 0,037 dark / 0,064 light). `ink.lapis` = dark `color.periwinkle.300` (`oklch(0.838 0.08 262.6)`: 12,02:1 auf `syntax.background`, 10,63:1 auf `surface.default`), light `color.periwinkle.700` (`oklch(0.422 0.138 287.2)`: 6,48:1 / 5,52:1). `punctuation` zeigt dafür auf `text.secondary` (wie `operator`).

| Capture | Alias | Gedacht für |
|---|---|---|
| `foreground` | `text.default` | Grundfarbe |
| `background` | dark `surface.emphasis`, light `surface.raised` | Codeblock; folgt dem Theme, dark dunkler und light heller als die Seite |
| `comment` | `ink.lapis` (italic) | Kommentare; eigene Farbe, siehe unten |
| `keyword` | `ink.ruby` | `const`, `import`, `return`, Storage |
| `string` | `ink.copper` | Strings, Anführungszeichen, Template-Strings |
| `string.special` | `ink.steel` | Regex, Escape-Sequenzen |
| `number` | `ink.jade` | Zahlen, CSS-Einheiten |
| `constant` | `ink.jade` | `true`, `null`, `this`, Konstanten |
| `function` | `ink.sapphire` | Funktions- und Methodennamen |
| `type` | `ink.steel` | Typen, Klassen, Namespaces |
| `variable` | `text.default` | Variablen |
| `parameter` | `ink.gold` | Parameter |
| `property` | `ink.turquoise` | Properties, Objekt-Keys, JSON-/CSS-Properties |
| `tag` | `ink.rose` | Tag-Namen samt `<` `>` |
| `tag.attribute` | `ink.amethyst` | Attribute |
| `operator` | `text.secondary` | Operatoren, `=>` |
| `punctuation` | `text.secondary` | Klammern, Trenner |
| `diff.plus` / `diff.minus` | `ink.jade` / `ink.ruby` | Diff-Zeilen (Vordergrund, kein Alpha) |

Zuordnungsprinzip: Im Light Mode sind Gelb, Cyan, Lila, Rosa und Grün absichtlich dunkler (schwerer), Rot, Orange, Türkis und Blau heller. Da der Alias in beiden Modes gleich ist, liegen die schweren Inks auf seltenen Kategorien (`number`, `constant`, `tag.attribute`, `parameter`, `type`), die helleren auf häufigen (`keyword`, `string`, `function`, `property`). Geteilte Inks (`number`/`constant`, `type`/`string.special`) liegen auf Kategorien, die selten nebeneinander stehen.

**Capture hinzufügen**: Eintrag in `src/textmate-scopes.ts` (Capture plus TextMate-Scopes; dort ist die einzige Übersetzung Tree-sitter → TextMate), `syntax.<name>` in beiden Mode-Dateien, dann `pnpm lint:tokens`. Der Build bricht ab, wenn Tabelle und Token-Dateien auseinanderlaufen.

**Ausgaben**:

- `generated/shiki-theme.ts` (Export `@samisdat/color-scheme/shiki`, `shikiTheme`): ein Theme für beide Modes, alle Farben (`fg`, `bg`, `editor.*`, `tokenColors`) sind `var(--color-syntax-…)`. Der Browser löst sie über das aktive Theme auf, Morphing und Inline-Code funktionieren mit demselben Mechanismus. Kein leeres `settings: []` einfügen: es überschreibt `tokenColors`.
- `generated/shiki/dark.json`, `generated/shiki/light.json` (Export `@samisdat/color-scheme/shiki/*`): dasselbe Theme mit aufgelösten Hex-Werten pro Mode, für Konsumenten ohne CSS (nvim, Terminal).
- `generated/herdr/theme.toml`: `[theme.custom.dark]`-Block für [herdr](https://herdr.dev) (nur Dark). herdr kennt keinen Include: Block in die `config.toml` kopieren, `herdr server reload-config`. Mapping der Slots auf Tokens in `plugins/plugin-herdr.ts`.
- `generated/ghostty/samisdat`: Ghostty-Theme (nur Dark; `palette 0–15` aus `terminal.ansi*`, dazu Hintergrund, Vordergrund, Cursor, Selection). Nach `~/.config/ghostty/themes/samisdat` verlinken, `theme = samisdat` setzen.
- `generated/claude-code/samisdat.json`: Custom Theme für die Claude Code CLI (`base: dark`, Overrides in Hex; Shimmer-Tokens erbt das Preset). Nach `~/.claude/themes/samisdat.json` verlinken, in `/theme` `custom:samisdat` wählen. Mapping in `plugins/plugin-claude-code.ts`.
- `generated/pi/samisdat.json`: pi-Theme (nur Dark; alle 51 Pflichtfarben plus `thinkingMax`, Werte als OKLCH, das pi selbst in sRGB mappt). Nach `~/.pi/agent/themes/samisdat.json` verlinken, in den pi-Einstellungen `samisdat` wählen. `thinking*` ist eine Rampe von `border.muted` über Blau, Türkis, Grün, Gelb, Orange bis Pink. Mapping in `plugins/plugin-pi.ts`.
- `generated/artifact/`: Farben für Claude-Artifacts (claude.ai kennt keinen Theme-Mechanismus). `samisdat.css` setzt die Tokens als `--color-*` (gleiche Namen wie die Website, ohne Ebene 1 und `terminal.*`): Dark auf `:root` als Default, Light auf `:root[data-theme="light"]`; kein Morphing. `instructions.md` ist der kompakte Text für die Custom Instructions in claude.ai: Regeln plus 20 Rollen als Hex (dark / light); der Build bricht ab, wenn er 3000 Zeichen überschreitet (Annahme, das Limit von claude.ai ist nicht verifiziert). `SKILL.md` ist der Claude-Code-Skill `samisdat-artifacts` mit dem vollständigen Zwei-Mode-CSS; Ordner nach `~/.claude/skills/samisdat-artifacts/` legen.
  - **Light steuern**: Standard ist Dark. Light gilt nur auf Anfrage („hell“, „light“, Druck, PDF); Claude setzt dann `data-theme="light"` auf `<html>`. PDFs ohne CSS (reportlab) nutzen die Light-Hex-Werte aus `instructions.md`.
  - **Karten**: `surface.raised` ist `neutral-only`; darauf stehen nur `text.default`, `-emphasis`, `-secondary`. Akzenttexte (`ink.*`) nur auf `surface.default` oder `syntax.background`.
- Kontrast der neuen Paare, die die Rollenmatrix nicht abdeckt (z. B. `text.secondary` auf `surface.raised`, in beiden Modes für die Artifact-Karten): `scripts/lint-llm-themes.ts`, Teil von `lint`, ≥ 4,5:1.
- `syntax.*` steht außerdem in `generated/semantic.ts`; `ui-components` rendert daraus `--color-syntax-*` wie alle Ebene-2-Variablen.

Inline-Code im Fließtext: `` `code{:tsx}` `` (rehype-pretty-code) nutzt dasselbe Theme und damit dieselben Variablen. Scholion-Lemmas (`.ref-target`) übernehmen die Variable des zugehörigen Tokens im Codeblock.

## Generierte Dateien

- `generated/primitives.ts`: Ebene 1 als `oklch(…)`-Strings (`ivory[200]`, `type Hue`, `type Step`, `palette`).
- `generated/semantic.ts`: Ebene 2 als aufgelöste `oklch(…)`-Strings pro Mode (`semantic.dark["surface.default"]`, `type SemanticToken`, `type Mode`). Ebene 1 kommt darin nicht vor.
- `generated/shiki-theme.ts`, `generated/shiki/*.json`: siehe „Syntax“.
- `generated/index.ts`: Export `.` des Packages, re-exportiert beide Module.
- `generated/tokens.js`, `generated/tokens.d.ts`: Terrazzo-JS-Plugin, normalisierte Tokens pro Resolver-Permutation.

Nicht von Hand bearbeiten.
