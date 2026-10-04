# @samisdat/color-scheme

Gemeinsames Farbschema für Website, Shiki und später Terminal/Editor. Entscheidungen: [ADR 0019](../../docs/adrs/0019-color-scheme.md).

Quelle der Wahrheit sind absolute OKLCH-Werte im W3C-DTCG-Format (`tokens/*.tokens.json`). [Terrazzo](https://terrazzo.app) lintet und erzeugt daraus die committeten Artefakte in `generated/`.

## Ebenen

| Ebene | Inhalt | Status |
|---|---|---|
| 1 · Wert | Skalen `50–950` (50 = hell) für `aubergine`, `ivory`, `red`, `orange`, `yellow`, `green`, `teal`, `cyan`, `blue`, `purple`, `pink` | vorhanden (`tokens/primitives.tokens.json`) |
| 2 · Bedeutung | `surface`, `text`, `border`, `ink.<hue>`, `status` | Phase 2 |
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
| `lint` | `tz check` (Terrazzo-Regeln) und `scripts/lint-scale.ts` |
| `dev` | `tz build --watch` |
| `generate:scale` | Skalenvorschlag ausgeben (`--write [datei]`, `--migration`) |

Im Repo-Root: `pnpm lint:tokens` (build, lint und Prüfung, dass `generated/` aktuell ist; läuft in CI), `pnpm dev:tokens` (Watch).

## Generierte Dateien

- `generated/primitives.ts`: Ebene 1 als `oklch(…)`-Strings (`ivory[200]`, `type Hue`, `type Step`, `palette`). Das ist der Export `.` des Packages.
- `generated/tokens.js`, `generated/tokens.d.ts`: Terrazzo-JS-Plugin, normalisierte Tokens pro Resolver-Permutation.

Nicht von Hand bearbeiten.
