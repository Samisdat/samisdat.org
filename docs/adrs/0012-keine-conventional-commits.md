# ADR 0012: Keine Conventional Commits

Datum: 2026-07-12 · Status: Akzeptiert

## Kontext

Conventional Commits (`feat:`, `fix:`, `chore:`, …) sind ein verbreitetes
Format, das automatisierte Changelogs und semantisches Versionieren
ermöglicht. Für ein privates Ein-Personen-Blog ohne automatisierte
Release-Pipelines, die auf Commit-Prefixes angewiesen sind, ist das
Format unnötiger Overhead.

## Entscheidung

Commit-Messages werden als freier Text geschrieben — klar, kurz und
beschreibend, aber ohne erzwungenes Prefix-Schema.

Gut:

- `node version aus .nvmrc lesen`
- `panorama: repository-feld für provenance fixen`
- `workflow für npm publish`

Nicht nötig:

- `fix: use .nvmrc for node version in workflow`
- `chore(ci): add npm publish workflow`

## Begründung

- Kein Tool konsumiert die Prefixe — es gibt kein `semantic-release`,
  kein automatisches Changelog, keine Commit-Lint-CI.
- Die Git-History soll für einen Menschen lesbar sein, nicht für einen
  Parser.
- Prefixe wie `chore:` oder `ci:` tragen keinen Informationsgehalt, der
  nicht schon aus dem Diff ersichtlich wäre.

## Konsequenzen

- Kein `commitlint`, kein `husky`-Hook für Commit-Format.
- Commit-Messages sollen trotzdem aussagekräftig sein — was wurde geändert
  und warum (wenn nicht offensichtlich).
- Für die Panorama-Library (npm-publishable) wird die Version manuell in
  `package.json` gebumpt; kein automatisches Versionieren aus Commits.

## Nachtrag 2026-10-16: Autorenschaft und Trailer

Bastian steht für jeden Commit in diesem Repo gerade, auch für Commits,
die ein Agent oder Tool für ihn erstellt. Deshalb gilt zusätzlich:

- Autor und Committer jedes Commits sind `samisdat <bastian@pertz.eu>`.
- Commit-Messages enthalten keine Git-Trailer jeglicher Art (kein
  `Co-Authored-By`, kein `Claude-Session`, kein `Signed-off-by` o. ä.).
- PR-Beschreibungen enthalten keine „Generated with …"-Footer und keine
  Session-Links.

Diese Regel hat Vorrang vor Attributions-Vorgaben von Tools oder
Agenten-Systemen.
