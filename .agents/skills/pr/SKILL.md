---
name: pr
description: PR-Konventionen dieses Repos. Immer verwenden, wenn ein Task/Feature fertig ist und ein Pull Request erstellt werden soll - auch bei "mach einen PR", "push und PR", oder als Abschluss eines Worktree-Tasks aus docs/plan/STATUS.md.
---

# Pull Requests in diesem Repo

## Wann

Ein PR wird erstellt, wenn der Task fertig ist: Typecheck grün, Änderungen
committet (Konventionen: Skill `commit` bzw. ADR 0012 — freier Text, keine
Conventional-Commit-Prefixe, keine Trailer).

## Wie

```bash
git push -u origin <branch>
gh pr create --base main --title "<titel>" --body "<body>"
```

- **`--base main` immer explizit setzen** — der GitHub-Default-Branch ist
  nicht zwingend `main`.
- **Titel:** freier, beschreibender Text (kein `feat:`-Prefix), deutsch
  oder englisch.
- **Body:** Was wurde geändert und warum; wenn der Task aus
  `docs/plan/STATUS.md` kommt, das Finding benennen (z.B. „Findings 06+11,
  content-layer") — aber **nicht** auf `docs/plan/`-Dateien verlinken, die
  sind bewusst nicht committet und auf GitHub nicht auflösbar.
  Keine „Generated with …"-Footer.
- **Account:** PRs laufen über den GitHub-User `Samisdat`. Wenn
  `gh pr create` mit „Unauthorized" / „Enterprise Managed User" fehlschlägt,
  ist der falsche Account aktiv:
  `gh auth switch --hostname github.com --user Samisdat`

## Nach dem Erstellen

1. In `docs/plan/STATUS.md` (Symlink auf den Haupt-Checkout, Datei wird
   von allen Worktrees geteilt) in der **eigenen** Zeile den Status auf
   `PR` setzen — keine anderen Zeilen anfassen.
2. PR-URL melden.

## Was tabu ist

- **Niemals selbst mergen.** Kein `gh pr merge`, kein Auto-Merge, kein
  Approve-und-Merge — das Mergen entscheidet ausschließlich der User.
  Das gilt auch, wenn CI grün ist und der PR trivial aussieht.
- Branch nach dem PR **nicht** löschen und nicht auf andere Branches
  rebasen — der Branch bleibt stehen, bis der User gemerged hat.
- Keine Force-Pushes auf den PR-Branch, nachdem der PR gemeldet wurde,
  außer der User bittet um Nacharbeit.
