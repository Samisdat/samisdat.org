---
name: commit
description: Commit-Konventionen dieses Repos. Immer verwenden, bevor in diesem Repo ein Commit erstellt wird - auch bei "commite das", "mach einen commit", beim Abschluss von Features oder beim Vorbereiten eines PRs. Gilt für den Haupt-Checkout und alle Worktrees.
---

# Commits in diesem Repo

Maßgeblich ist
[ADR 0012: Keine Conventional Commits](../../../docs/adrs/0012-keine-conventional-commits.md)
— bei Unsicherheit dort nachlesen (`docs/adrs/0012-keine-conventional-commits.md`
vom Repo-Root). Kurzfassung und ergänzende Regeln:

## Message-Stil

Freier, beschreibender Text — **kein** `feat:`/`fix:`/`chore:`-Prefix.
Die History soll für Menschen lesbar sein, kein Tool parst Prefixe.

Gut:

- `node version aus .nvmrc lesen`
- `panorama: repository-feld für provenance fixen`
- `workflow für npm publish`

Nicht erwünscht:

- `fix: use .nvmrc for node version in workflow`
- `chore(ci): add npm publish workflow`

Ein optionales `bereich:`-Prefix (wie `panorama:` oben) ist ok, wenn es
Kontext gibt — es ist ein Scope, kein Typ. Deutsch oder Englisch, beides
kommt in der History vor; die Message soll sagen, *was* geändert wurde,
und das *warum* nur, wenn es nicht aus dem Diff ersichtlich ist.

## Trailer

Keine `Co-Authored-By`- oder „Generated with …"-Trailer. Die Messages
bleiben plain.

## Signierung

Commits werden automatisch SSH-signiert (repo-lokal konfiguriert:
`commit.gpgsign=true`, Key `~/.ssh/id_ed25519.pub`). Nichts zu tun —
aber nicht mit `--no-gpg-sign` umgehen, jeder Commit soll auf GitHub
„Verified" sein.

## Was nie committet wird

- `UPPERCASE.md`-Dateien und `docs/plan/` — temporäre Arbeitsdokumente
  (ADR 0013); sie sind über `.gitignore` bzw. `.git/info/exclude`
  ausgeschlossen. Nicht mit `git add -f` umgehen.
- Debug-Reste (`console.log`, auskommentierter Code) — vor dem Commit
  entfernen.

## Zuschnitt

Kleine, thematische Commits — ein Gedanke pro Commit. Features gehen per
Branch + PR nach `main` (ADR 0001), der Branch wird nach dem Merge
gelöscht.
