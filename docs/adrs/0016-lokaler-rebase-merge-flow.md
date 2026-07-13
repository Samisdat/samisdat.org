# ADR 0016: Lokaler Rebase-Merge-Flow statt GitHub-UI-Merges

Datum: 2026-07-13 · Status: Akzeptiert

## Kontext

ADR 0001 legt GitHub Flow fest, gewünscht ist eine **lineare History**.
Gleichzeitig sollen alle Commits SSH-signiert sein und auf GitHub
„Verified" zeigen (die gesamte History wurde entsprechend aufbereitet).

Diese beiden Ziele kollidieren mit dem GitHub-UI-Button „Rebase and
merge": GitHub schreibt die Commits dabei serverseitig neu — **ohne
Signatur** (es gibt keine Einstellung, die das ändert) und mit der
primären Account-E-Mail als Committer. Folge waren 12 unverifizierte
Commits auf `main`, die nachträglich per History-Rewrite repariert werden
mussten. „Squash" und „Create a merge commit" signiert GitHub zwar selbst,
aber Squash verwirft Einzel-Commits und Merge-Commits brechen die
Linearität.

## Entscheidung

PRs werden **lokal** gemerged, per `scripts/merge-pr.sh <branch>`:

1. Branch auf frisches `main` rebasen — dabei signiert
   `commit.gpgsign=true` jeden Commit neu
2. Branch force-pushen (aktualisiert den PR)
3. `main` per Fast-Forward auf den Branch ziehen und pushen —
   GitHub markiert den PR automatisch als merged
4. Branch lokal und remote löschen

Die Merge-Buttons der GitHub-UI werden nicht verwendet.

## Konsequenzen

- Lineare History, jeder Commit einzeln erhalten und „Verified".
- Gemerged wird ausschließlich vom User aus dem Haupt-Checkout — das
  Script verweigert die Ausführung in Worktrees; Agenten erstellen nur
  PRs (Skill `pr`).
- Die Branch Protection auf `main` (kein Force-Push) bleibt bestehen;
  der Flow braucht sie nicht zu umgehen, weil `main` nur per
  Fast-Forward bewegt wird.
- Bewusster Verzicht auf GitHubs signierte Merge-Commits zugunsten der
  eigenen Signatur auf jedem Einzel-Commit.
