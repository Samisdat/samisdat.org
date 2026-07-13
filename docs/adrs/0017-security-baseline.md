# ADR 0017: Security-Baseline auf „privates Blog"-Niveau

Datum: 2026-07-13 · Status: Akzeptiert

## Kontext

Das Repo ist öffentlich, publiziert ein npm-Package
(`@samisdat/wtal-panorama`, Trusted Publishing mit Provenance, ADR 0014)
und deployt via Vercel. Die GitHub-Security-Features waren bis auf
Dependabot-Alerts komplett deaktiviert; Workflows liefen mit
Default-Permission **write**. Die History reicht bis 2015 zurück und
wurde nie auf versehentlich committete Secrets geprüft.

Maßstab ist ein **privates Ein-Personen-Blog**: Schutz gegen die realen
Risiken (verwundbare Dependencies, geleakte Secrets, übergriffige
Workflow-Rechte, kompromittierte Actions), ohne Prozess-Theater, das nur
in Teams Sinn ergibt.

## Entscheidung

### Aktiviert wird (GitHub-Features, kostenlos für öffentliche Repos)

1. **Dependabot Security Updates** — Auto-PRs bei verwundbaren
   Dependencies (Alerts sind bereits aktiv).
2. **Dependabot Version Updates** (`.github/dependabot.yml`) — wöchentlich,
   gruppiert (minor/patch zusammen), für `npm` **und** `github-actions`.
3. **Secret Scanning + Push Protection** — erkennt geleakte Tokens,
   blockiert neue schon beim Push.
4. **CodeQL** (Default Setup, JavaScript/TypeScript).
5. **Private Vulnerability Reporting** — Meldeweg über den Security-Tab.
6. **Workflow-Permissions:** Repo-Default auf **read-only**,
   „Actions dürfen PRs approven" aus; jeder Workflow deklariert seine
   Rechte explizit (`ci.yml` bekommt `permissions: contents: read`).

### Einmal-Aktionen

7. **Secret-Scan über die komplette History** (gitleaks, alle ~1100
   Commits inkl. der 2015er-Ära) — Funde werden rotiert, nicht nur
   gelöscht.
8. **npm Publishing Access** des Packages auf „Trusted Publisher only"
   beschränken — Tokens werden dann von der Registry abgelehnt.
9. **`SECURITY.md`** mit Kontaktweg (GitHub-/npm-Konvention; wie
   `README.md` eine Ausnahme der UPPERCASE-Regel, ADR 0013 wird ergänzt).

### Bewusst NICHT (für dieses Level unangemessen)

- **CODEOWNERS / Required Reviews** — es gibt genau eine Person.
- **Required Status Checks auf `main`** — würde den lokalen
  Rebase-Merge-Flow (ADR 0016) blockieren, weil der Fast-Forward-Push
  nicht auf CI wartet; CI läuft auf jedem PR und main-Push, das reicht.
- **SHA-Pinning aller Actions** — Versions-Tags (`@v4`) plus
  Dependabot-Updates für Actions sind für dieses Risikoprofil genug.
- **Signed Tags / Tag Protection, Artifact-Attestation über die
  npm-Provenance hinaus** — kein Konsument, der es prüfen würde.

## Konsequenzen

- Dependabot erzeugt PRs; die laufen durch das CI-Gate und werden wie
  alle PRs vom User per `scripts/merge-pr.sh` gemerged (ADR 0016).
- Push Protection kann False Positives blockieren — Bypass ist bewusst
  ein manueller Einzelfall-Schritt.
- Umsetzungsplan: `docs/plan/SECURITY.md` (temporär, ADR 0013).
