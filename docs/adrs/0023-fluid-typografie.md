# ADR 0023: Fluid Typografie mit einem gemeinsamen Progress-Wert

Datum: 2026-10-22 · Status: Akzeptiert

## Kontext

Die Schriftgrößen waren zwei Dinge zugleich: feste px-Werte in den Typografie-Presets
(`data.ts`) und handgerechnete `clamp(1.6rem, 1.2rem + 1.6vw, 2.1rem)`-Fallbacks in
`Heading`. Die `clamp()`-Werte sind Magic Numbers (Steigung und Achsenabschnitt müssen
je Stufe von Hand aus Min, Max und Viewport-Range zurückgerechnet werden), und die
Verhältnisse zwischen h1, h2 und h3 ergaben sich zufällig. Die Presets griffen nur auf
Posts, der Rest der Site hing an den Fallbacks.

## Entscheidung

- **Ein Progress-Wert `--t` (0..1)** über 18rem..64rem (360..1280px bei 20px Root):
  `clamp(0, tan(atan2(100vw - var(--vmin), var(--vmax) - var(--vmin))), 1)`.
  Der Trick `tan(atan2())` läuft in allen Browsern; nativ wäre es `progress()`. Wird
  `progress()` breit unterstützt, ersetzt es genau diese eine Zeile (`FLUID_ROOT_VARS`
  in `fluid.ts`).
- **Jede Größe ist `{ min, max }`** in px (Quelle) und wird als `rem` ausgegeben, damit
  Browser-Schriftgröße und 200 %-Zoom (WCAG 1.4.4) greifen. Fest ist `min === max`.
- **Ableitung pro Preset** (`deriveSizes`): Body und h1 behalten das aufgeschriebene
  Maß als Maximum, das Ratio ist `(h1/body)^(1/4)`, h2/h3 folgen der Skala. Die
  schmale Seite nutzt dasselbe Min:Max-Verhältnis der Ratios wie das PoC (1,2 : 1,333).
  Body fällt nicht unter 16px, Mono folgt dem Body, aber nicht unter 14px; liegt ein
  Maß schon unter seinem Boden, bleibt es fix.
- **Zwischen den Endpunkten wird pro Größe linear interpoliert.** Die geometrische
  Skala gilt exakt nur an Min und Max; dazwischen weicht sie um wenige Prozent ab
  (ca. 4 % bei h1 auf halber Breite).
- **Chrome-Seiten** bekommen die Größen des Default-Presets auf `<html>` (Layout);
  die `clamp()`-Fallbacks in `Heading` entfallen. Posts überschreiben sie auf ihrem
  Wrapper wie bisher.
- **Snapshots** werden auf `version: 2` gehoben (`size` → `{ min, max }`); bestehende
  Snapshots sind Fixwerte (`min = max`), alte Posts sehen unverändert aus.

## Konsequenzen

- h2/h3 weichen in allen Presets leicht von den bisherigen Werten ab (`current`: h2
  55px → ca. 46px), `current` ändert auf Handys den Body (16 statt 20px).
- Es gibt eine Typografie-Abstraktion (Preset) für Posts und Chrome.
- Storybook kennt das Layout nicht; `preview.css` setzt feste Stellvertreter für
  `--hz`/`--h2z`/`--h3z`.
