# ADR 0001: GitHub Flow als Branching-Strategie

Datum: 2026-07-12 · Status: Akzeptiert

## Kontext

Das Repo hat historisch Git Flow verwendet — die alte History (2015–2016)
enthält `develop`- und `release/*`-Branches (z.B. `Merge branch
'release/0.2.0'`), und ein `develop`-Branch existiert bis heute. Für ein
privat betriebenes Blog mit einer Person ist dieser Prozess Overhead ohne
Nutzen: Es gibt keine parallelen Release-Stände, keine Hotfix-Pflege alter
Versionen und kein Team, das einen Integrationsbranch braucht.

Mit der Zusammenführung der alten und neuen History ist `main` gerade als
durchgehende Hauptlinie neu aufgesetzt worden. Das ist der richtige
Zeitpunkt, den Arbeitsprozess festzulegen.

## Entscheidung

Wir nutzen [GitHub Flow](https://docs.github.com/en/get-started/using-github/github-flow):

1. `main` ist die einzige langlebige Linie und jederzeit deploybar.
2. Jede Arbeit passiert auf kurzlebigen Branches, die von `main` abzweigen
   und einen beschreibenden Namen tragen (z.B. `feature/import-pano`).
3. Änderungen gehen per Pull Request zurück nach `main`.
4. Nach dem Merge wird der Branch gelöscht.
5. Deploys erfolgen von `main`.

## Konsequenzen

- Kein `develop`, keine `release/*`- oder Hotfix-Branches mehr; die
  bestehenden Alt-Branches (`develop`, `feature/nextjs`, …) werden nicht
  weitergeführt und nach und nach aufgeräumt.
- `main` muss grün bleiben — was nicht deploybar ist, bleibt auf seinem
  Branch.
- Branches bleiben klein und kurzlebig; langlaufende Umbauten werden in
  mergebare Schritte zerlegt.
- Der GitHub-Default-Branch muss von `master` auf `main` umgestellt werden.
