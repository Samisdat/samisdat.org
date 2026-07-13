# ADR 0018: Storybook-Deployment via Chromatic

Datum: 2026-07-13 · Status: Akzeptiert (umgesetzt in PR #21)

## Kontext

Storybook ist die einzige Komponenten-Dokumentation und das visuelle
Testwerkzeug des Repos (ADR 0008). Es wurde im CI-Gate zwar gebaut, das
Artefakt aber nirgends deployed — die Doku war nur lokal erreichbar.
Optionen waren ein statisches Hosting des Builds (z.B. zweites
Vercel-Projekt) oder Chromatic, dessen Addon bereits installiert war.

## Entscheidung

Storybook wird über **Chromatic** deployed
(`.github/workflows/chromatic.yml`):

- Jeder PR bekommt Visual-Regression-Tests plus Preview-Link.
- Pushes auf `main` deployen automatisch; Änderungen gelten dort als
  akzeptierte Baseline (`autoAcceptChanges: main`).
- Details: `docs/deployment.md`.

Damit gibt es Hosting **und** visuelle Regression in einem Dienst, statt
nur statisches Hosting.

## Konsequenzen

- Benötigt `CHROMATIC_PROJECT_TOKEN` als Actions-Secret.
  **Dependabot-getriggerte Läufe bekommen keine Actions-Secrets** — der
  Job wird für `github.actor == 'dependabot[bot]'` übersprungen
  (Bumps brauchen keine visuelle Regression).
- Chromatic-Freigaben (Baseline-Änderungen auf PRs) sind ein manueller
  Review-Schritt des Users.
- Kostenlos im Free-Tier; bei Limit-Themen wäre der Fallback ein
  statisches Hosting des `build-storybook`-Artefakts.
