# ADR 0011: Panorama als publishable npm Library

Datum: 2026-07-12 · Status: Akzeptiert

## Kontext

Das Wuppertal-Panorama mit astronomisch korrekten Sonnen- und Mond-
Animationen ist ein eigenständiges Feature, das auch außerhalb dieses Blogs
nutzbar sein soll (z.B. als Widget auf anderen Seiten oder als Open-Source-
Projekt).

## Entscheidung

Das Panorama lebt als eigenständiges Package (`@samisdat/wtal-panorama`)
im Monorepo und wird als npm-Library gebaut und publiziert.

Build-Setup:
- **tsup** als Bundler (schnell, zero-config für Libraries)
- Dual-Output: ESM (`.js`) + CommonJS (`.cjs`)
- TypeScript-Deklarationen (`.d.ts`) werden mitgeneriert
- React und React-DOM als Peer-Dependencies (nicht gebundelt)
- CSS wird als separates File exportiert (`./style.css`)

## Begründung

- **Wiederverwendbarkeit**: Andere Projekte können die Library per
  `npm install @samisdat/wtal-panorama` einbinden.
- **Klare Dependency-Grenze**: Das Blog konsumiert die Library wie jedes
  andere npm-Package (via `workspace:*` lokal).
- **Unabhängiger Release-Zyklus**: Die Library kann unabhängig vom Blog
  versioniert und publiziert werden.
- **tsup**: Minimal-Config Bundling mit Tree-Shaking, deutlich einfacher
  als Rollup/Webpack für eine React-Library.

## Konsequenzen

- Library-Source liegt unter `packages/panorama/src/`, der Blog konsumiert
  nur den Build-Output (`dist/`).
- Im Monorepo-Dev (`pnpm dev:all`) läuft tsup im Watch-Mode parallel zum
  Next.js-Dev-Server.
- `astronomy-engine` ist die einzige Runtime-Dependency — hält das Bundle
  klein.
- Vor einem npm-Publish muss `pnpm build:lib` laufen (`prepublish`-Script).
- Das Package ist aktuell `"private": false` — ein `npm publish` ist
  jederzeit möglich.
