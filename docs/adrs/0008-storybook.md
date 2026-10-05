# ADR 0008: Storybook für UI-Komponenten

Datum: 2026-07-12 · Status: Akzeptiert

## Kontext

Die UI-Komponenten (`@samisdat/ui-components`) werden unabhängig vom Blog
entwickelt und sollen isoliert sichtbar, testbar und dokumentiert sein.

## Entscheidung

Wir verwenden Storybook 10 (`@storybook/react-vite`) im Package
`packages/ui-components` als Entwicklungs- und Dokumentationstool.

Konfiguration:
- Vite als Builder (mit `@wyw-in-js/vite` für Linaria-Support)
- `@storybook/addon-a11y` für Barrierefreiheits-Checks
- `@storybook/addon-themes` für Dark/Light-Theme-Switching
- `@storybook/addon-vitest` für In-Browser Component Tests
- Playwright + Vitest für visuelle Tests

## Begründung

- **Isolation**: Komponenten werden losgelöst vom Blog-Kontext entwickelt —
  Abhängigkeiten und Props werden explizit.
- **Dokumentation**: Stories dienen als lebende Dokumentation des
  Komponenten-APIs.
- **Visuelles Testing**: Zusammen mit Playwright können Regression-Tests
  auf Komponenten-Ebene laufen.
- **Theme-Entwicklung**: Addon-Themes erlaubt schnelles Switching zwischen
  Dark/Light-Mode während der Entwicklung.

## Konsequenzen

- Jede UI-Komponente sollte mindestens eine Story haben.
- Storybook läuft auf Port 6006 (`pnpm storybook` vom Root).
- Storybook-Build kann als statische Seite deployed werden (z.B. für
  Reviews).
- Storybook-Dependencies (Addons, Builder) sind auf das ui-components-
  Package beschränkt.

## Bekannte Einschränkungen (Stand 2026-10-05)

**Vite muss auf 7.x gepinnt bleiben** (`pnpm-workspace.yaml` → `overrides.vite: ^7.x`).

`@storybook/builder-vite@10.6` deklariert eine `^8`-Peer-Range, aber Vites
Dependency-Optimizer läuft unter Vite 8.3 nicht an: die Pre-Bundle-Phase
startet nie (kein `esbuild`/Scan-Output; `DEBUG=vite:deps` zeigt null Zeilen).
Alle optimierten Deps wie `storybook_internal_preview_runtime.js` werden nicht
gebaut — Requests hängen ewig, jede Story bleibt im Spinner. Unter Vite 7
funktioniert alles. Override entfernen, sobald Storybook Vite 8 offiziell
unterstützt.

**`storybook/test` statt `@storybook/test`**: Ab Storybook 10 sind Test-
Utilities in das Hauptpaket (`storybook/test`) gewandert. Das veraltete
`@storybook/test@8`-Paket ist inkompatibel und darf nicht installiert sein.
