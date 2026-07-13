# ADR 0007: Shiki für Syntax Highlighting

Datum: 2026-07-12 · Status: Akzeptiert

## Kontext

Code-Blöcke in Blog-Posts brauchen Syntax Highlighting. Die gängigen
Optionen sind:

- **Prism.js**: Client-side, leichtgewichtig, aber begrenzte Sprach-
  Unterstützung und eigenes Token-Format.
- **Highlight.js**: Client-side, breitere Sprachunterstützung, aber
  großes Bundle.
- **Shiki**: Nutzt TextMate-Grammatiken (dieselben wie VS Code), rendert
  zur Build-Zeit, kein Client-JS.

## Entscheidung

Wir verwenden Shiki (v3) via `rehype-pretty-code` als Teil der MDX-
Pipeline. Zusätzlich wird `react-shiki` in der UI-Components-Library für
dynamische Code-Darstellung verwendet.

## Begründung

- **VS-Code-Qualität**: TextMate-Grammatiken liefern präziseres Highlighting
  als Prism/Highlight.js.
- **Zero Client-JS**: In der MDX-Pipeline wird HTML mit Inline-Styles zur
  Build-Zeit generiert — kein JavaScript-Bundle für Highlighting.
- **Theme-Flexibilität**: Shiki-Themes entsprechen VS-Code-Themes; das
  Token-System der UI-Components kann eigene Color-Schemas daraus ableiten.
- **Breite Sprachunterstützung**: Alle VS-Code-Sprachen sind verfügbar,
  ohne manuelles Laden von Plugins.

## Konsequenzen

- Build-Zeit steigt leicht bei vielen Code-Blöcken (TextMate-Parsing ist
  aufwändiger als Prism).
- Shiki-Themes werden zentral konfiguriert und mit dem Blog-Farbschema
  abgestimmt (`getTextMateColorSchema`-Utility in ui-components).
- Bei Shiki-Major-Updates muss `rehype-pretty-code`-Kompatibilität geprüft
  werden.
