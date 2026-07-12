# ADR 0013: UPPERCASE.md-Dateien sind temporär

Datum: 2026-07-12 · Status: Akzeptiert

## Kontext

Arbeitsnotizen, Pläne und Prozess-Dokumente entstehen hier gewohnheitsmäßig
als Markdown-Dateien mit komplett großgeschriebenem Namen
(`MERGE_LEGACY_HISTORY.md`, `TESTING_STRATEGY.md`, `CHROME_MCP.md`, …). Sie beschreiben einen Arbeitsstand oder einen
Plan — nicht den Ist-Zustand des Codes. Sobald die Arbeit erledigt ist,
veralten sie und wurden zuletzt ohnehin gelöscht (`rm markdowns`). Solche
Dateien gehören nicht in die History; dauerhafte Entscheidungen gehören in
ADRs (`docs/adrs/`, kleingeschrieben und nummeriert).

## Entscheidung

Markdown-Dateien, deren Name komplett aus Großbuchstaben (plus `_`/Ziffern)
besteht, gelten als **temporäre Arbeitsdokumente**: Sie leben nur lokal,
werden nicht committet und stehen in der `.gitignore`.

Ausnahmen (bleiben getrackt):

- `README.md` — GitHub-/npm-Konvention, Teil des Package-Inhalts
- `CLAUDE.md` — Tooling-Konfiguration, falls sie angelegt wird
- `SKILL.md` — Skill-Definitionen unter `.claude/skills/` sind dauerhafte
  Konfiguration, keine Arbeitsnotizen

## Konsequenzen

- `.gitignore` erhält `[A-Z]*[A-Z].md` mit Negationen für die Ausnahmen.
- Pläne wie `docs/plan/NPM.md` sind bewusst unversioniert; was davon
  Bestand hat, wandert in eine ADR oder in reguläre Doku.
- Bereits getrackte Altbestände (z.B. `MONOREPO.md`) bleiben von der
  `.gitignore` unberührt, bis sie aktiv entfernt werden.
