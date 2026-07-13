# ADR 0005: Linaria als Zero-Runtime CSS-in-JS

Datum: 2026-07-12 · Status: Akzeptiert

## Kontext

Für das Styling der UI-Komponenten und des Blogs standen mehrere Ansätze
zur Wahl:

- **Tailwind CSS**: Utility-First, aber generiert generische Optik und
  erschwert semantische Token-Systeme.
- **CSS Modules**: Scoped CSS, aber kein JS-Zugriff auf Tokens/Variablen
  zur Build-Zeit.
- **styled-components / Emotion**: Runtime-CSS-in-JS mit JS-Bundle-Overhead.
- **Linaria (wyw-in-js)**: CSS-in-JS Syntax, aber Zero-Runtime — CSS wird
  zur Build-Zeit extrahiert.

## Entscheidung

Wir verwenden Linaria (`@linaria/core`, `@linaria/react`) mit dem
`wyw-in-js`-Babel-Preset. Die Next.js-Integration läuft über
`next-with-linaria`.

## Begründung

- **Zero Runtime**: Kein JavaScript-Overhead für Styles im Client Bundle.
  CSS wird statisch extrahiert wie bei CSS Modules.
- **Volle JS-Power**: Tokens, Farb-Berechnungen und Themes können als
  TypeScript-Werte definiert und in Styles verwendet werden (zur Build-
  Zeit evaluiert).
- **Co-Location**: Styles leben direkt neben den Komponenten in `.tsx`-
  Dateien — kein Kontext-Switch zu separaten `.css`-Dateien.
- **Theming**: Dark/Light-Themes werden über CSS Custom Properties abgebildet,
  die aus dem Token-System generiert werden.

## Konsequenzen

- Build-Pipeline braucht das `wyw-in-js`-Babel-Plugin (via
  `next-with-linaria` für Next.js, `@wyw-in-js/vite` für Storybook).
- Styles dürfen nur statisch evaluierbare Ausdrücke enthalten — kein Zugriff
  auf Props oder State zur Laufzeit (dafür: CSS Variables + `style`-Prop).
- `wyw-in-js.config.js` im Root konfiguriert globale Linaria-Einstellungen.
- Bei Next.js/Turbopack-Upgrades muss die `next-with-linaria`-Kompatibilität
  geprüft werden.
