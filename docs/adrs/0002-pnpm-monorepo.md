# ADR 0002: pnpm Monorepo

Datum: 2026-07-12 · Status: Akzeptiert

## Kontext

Das Projekt besteht aus mehreren zusammenhängenden Teilen: einem Next.js
Blog, einer UI-Komponenten-Library, einer publishable Panorama-Library und
einem Utilities-Package. Diese Teile teilen sich Abhängigkeiten (React,
TypeScript, Linaria) und entwickeln sich gemeinsam weiter.

Optionen waren: separate Repos mit npm-Links, ein Monorepo mit npm/yarn
Workspaces, oder pnpm Workspaces.

## Entscheidung

Wir verwenden ein pnpm Workspace-Monorepo mit folgender Struktur:

```
packages/
├── website/        (Next.js Blog)
├── ui-components/  (Shared Components + Storybook)
├── panorama/       (npm-publishable Library)
└── tools/          (Shared Utilities)
```

pnpm wird als Package Manager verwendet (aktuell v11.7, via `packageManager`-
Feld im Root `package.json` gelockt).

## Begründung

- **Strikte Dependency-Isolation**: pnpm's Content-Addressable Store und
  strikte `node_modules`-Struktur verhindern Phantom-Dependencies.
- **Workspace-Protokoll**: `workspace:*` erlaubt lokale Referenzen zwischen
  Packages ohne Publish-Roundtrip.
- **Performance**: pnpm ist bei Install und Store-Nutzung schneller als npm
  und yarn.
- **Determinismus**: `pnpm-lock.yaml` + `--frozen-lockfile` in CI garantiert
  reproduzierbare Builds.

## Konsequenzen

- Alle Packages liegen unter `packages/` und werden via
  `pnpm-workspace.yaml` registriert.
- Root-`package.json` enthält nur Workspace-Scripts und wenige
  Entwicklungs-Dependencies (Vercel CLI, Puppeteer).
- Neue Packages werden in `packages/` angelegt und automatisch erkannt.
- Contributor brauchen pnpm (nicht npm/yarn) — die `packageManager`-
  Deklaration erzwingt dies via Corepack.
