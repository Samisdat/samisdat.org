# ADR 0010: TypeScript

Datum: 2026-07-12 · Status: Akzeptiert

## Kontext

Das Projekt umfasst mehrere Packages mit geteilten Interfaces (Props,
Tokens, Utilities). Ohne Typsystem entstehen bei Refactorings leicht
Fehler an Package-Grenzen.

## Entscheidung

Alle Packages verwenden TypeScript (aktuell v5.9). Jedes Package hat eine
eigene `tsconfig.json`, die eine gemeinsame Basis erweitert.

## Begründung

- **Refactoring-Sicherheit**: Änderungen an Komponenten-Props oder Utility-
  Signaturen werden sofort an allen Aufrufstellen sichtbar.
- **IDE-Support**: Autocomplete, Inline-Docs und Go-to-Definition über
  Package-Grenzen hinweg.
- **Selbst-Dokumentation**: Types dokumentieren Komponenten-APIs besser als
  Kommentare.
- **Ecosystem-Standard**: Next.js, React, Storybook und alle verwendeten
  Libraries liefern TypeScript-Typen.

## Konsequenzen

- Kein JavaScript — alle Source-Dateien sind `.ts` oder `.tsx`.
- Type-Checking läuft als Teil des Build-Prozesses und in der IDE.
- Workspace-Packages exportieren Types direkt aus Source-Dateien (kein
  separater Build nötig für Type-Resolution innerhalb des Monorepos).
- Die Panorama-Library generiert `.d.ts`-Dateien via tsup für externe
  Konsumenten.
