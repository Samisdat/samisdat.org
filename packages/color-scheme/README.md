# @samisdat/color-scheme

Gemeinsames Farbschema für Website, Shiki und später Terminal/Editor. Entscheidungen: [ADR 0019](../../docs/adrs/0019-color-scheme.md).

Quelle der Wahrheit sind absolute OKLCH-Werte im W3C-DTCG-Format (`tokens/*.tokens.json`). [Terrazzo](https://terrazzo.app) lintet und erzeugt daraus die committeten Artefakte in `generated/`.

## Ebenen

| Ebene | Inhalt | Status |
|---|---|---|
| 1 · Wert | Skalen `50–950` (50 = hell) für `aubergine`, `ivory`, `red`, `orange`, `yellow`, `green`, `teal`, `cyan`, `blue`, `purple`, `pink` | vorhanden (`tokens/primitives.tokens.json`) |
| 2 · Bedeutung | `surface`, `text`, `ink.<hue>`, `status` (weitere Rollen folgen) | vorhanden (`tokens/dark.tokens.json`, `tokens/light.tokens.json`) |
| 3 · Einsatzort | `syntax.*`, später `terminal.*` | Phase 5 |

Ebene 1 wird nie zu einer CSS-Variable. Im Web gelangt sie als typisierter Import ins CSS:

```ts
import { ivory } from "@samisdat/color-scheme";

const Box = styled.div`
  background: ${ivory[200]};
`;
```

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
| `lint` | `tz check` (Terrazzo-Regeln), `scripts/lint-scale.ts` und `lint:contrast` |
| `lint:contrast` | Kontrast-Lint pro Mode plus Baseline-Konsistenz (siehe unten) |
| `contrast:baseline` | `contrast-baseline.json` aus den aktuellen Werten neu erzeugen |
| `dev` | `tz build --watch` |
| `generate:scale` | Skalenvorschlag ausgeben (`--write [datei]`, `--migration`) |

Im Repo-Root: `pnpm lint:tokens` (build, lint und Prüfung, dass `generated/` aktuell ist; läuft in CI), `pnpm dev:tokens` (Watch).

## Kontrast (WCAG 2.2 AA)

Die Prüfmatrix wird aus den Token-Dateien abgeleitet (`src/contrast.ts`, Export `@samisdat/color-scheme/contrast`), pro Mode, nicht von Hand gepflegt:

- `text.*` und `ink.*` auf jedem Surface mit `textTier: "full"`: ≥ 4,5:1
- `text.default` und `text.emphasis` auf Surfaces mit `textTier: "neutral-only"`: ≥ 4,5:1
- `status.*` sind Aliase auf `ink.*` und werden nicht doppelt geprüft
- Tokens mit `$extensions["org.samisdat.a11y"].exempt` (Begründung als String) sind ausgenommen
- Platzhalter für `border.*` (≥ 3) und `syntax.*` stehen als Kommentar in `src/contrast.ts`; sie kommen mit den jeweiligen Tokens

Pair-IDs haben die Form `dark:text.muted/surface.default`.

**Lint** (`lint:contrast`, Teil von `lint` und damit von `pnpm lint:tokens`): Terrazzos `a11y/min-contrast` sieht nur den Default-Mode. Deshalb lädt `terrazzo.contrast.config.ts` Primitives plus genau eine Mode-Datei und läuft zweimal (`MODE=dark|light`) über Matrix minus Baseline. Danach prüft `scripts/lint-contrast.ts`, dass jeder Baseline-Eintrag noch in der Matrix existiert und noch fehlschlägt. Terrazzo nennt Paare nur mit Index (`Pair 6 failed`); Reihenfolge ist die der Matrix.

**Baseline** (`contrast-baseline.json`): bekannte Verstöße mit ihrem Verhältnis. Sie dürfen nicht neu entstehen, die Liste darf nur schrumpfen. Workflow:

1. Wert korrigieren (`tokens/*.tokens.json`), `pnpm lint:tokens`.
2. Meldet der Lint „now passes, remove from baseline“: `pnpm --filter @samisdat/color-scheme contrast:baseline` ausführen und die kleinere Datei committen.
3. Die Datei nie von Hand vergrößern; ein neuer Verstoß ist zu beheben, nicht einzutragen.

**Storybook** (`pnpm storybook`, Gruppe „Color Scheme“): *Contrast Grid* (Vordergründe × Surfaces pro Mode, Pflichtpaare umrandet, übrige abgedunkelt, Baseline markiert), *Palette* (Skalen mit L/C-Kurve, Ebene 2 mit Alias und Wert) und *Syntax Preview* (Codeblock und Inline-Code in hell/dunkel). Die Daten kommen aus `generated/` und dem Kontrast-Modul, nicht aus berechnetem CSS.

## Generierte Dateien

- `generated/primitives.ts`: Ebene 1 als `oklch(…)`-Strings (`ivory[200]`, `type Hue`, `type Step`, `palette`).
- `generated/semantic.ts`: Ebene 2 als aufgelöste `oklch(…)`-Strings pro Mode (`semantic.dark["surface.default"]`, `type SemanticToken`, `type Mode`). Ebene 1 kommt darin nicht vor.
- `generated/index.ts`: Export `.` des Packages, re-exportiert beide Module.
- `generated/tokens.js`, `generated/tokens.d.ts`: Terrazzo-JS-Plugin, normalisierte Tokens pro Resolver-Permutation.

Nicht von Hand bearbeiten.
