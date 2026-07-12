# ADR 0012: npm-Publishing über GitHub Actions mit Trusted Publishing

Datum: 2026-07-12 · Status: Akzeptiert

## Kontext

`@samisdat/wtal-panorama` (`packages/panorama`) ist als npm-Package angelegt
(`private: false`, tsup-Build, `files`/`exports` konfiguriert) und wurde
bisher manuell publiziert — auf npm liegt `0.0.1`, lokal steht
`package.json` auf `0.0.3`. Es gibt keinen CI-Prozess; manuelles Publizieren
ist fehleranfällig (vergessener Build, falscher Stand) und bräuchte für
Automatisierung ein langlebiges npm-Token als GitHub-Secret — ein
Angriffsziel, das regelmäßig rotiert werden müsste.

npm bietet mit [Trusted Publishing](https://docs.npmjs.com/trusted-publishers)
OIDC-basiertes Publizieren direkt aus GitHub Actions: kein Token, kurzlebige
Credentials pro Workflow-Lauf, automatische Provenance-Attestierung
(sichtbares „Built and signed on GitHub Actions" auf der npm-Seite).

## Entscheidung

1. Publiziert wird **ausschließlich über GitHub Actions** — kein lokales
   `npm publish` mehr.
2. Authentifizierung per **Trusted Publishing (OIDC)**, kein `NPM_TOKEN`.
3. Release-Strategie:
   - **`main` ist Release**: Push auf `main` publiziert die Version aus
     `package.json` als `latest` (nur wenn diese Version noch nicht auf der
     Registry liegt).
   - **Alles andere ist Canary**: Pushes auf andere Branches publizieren
     eine Prerelease-Version (`X.Y.Z-canary.…`) unter dem dist-tag
     `canary`. `latest` bleibt davon unberührt.
4. Es werden fertige Actions eingesetzt (`actions/checkout`,
   `pnpm/action-setup`, `actions/setup-node`); die Publish-Logik selbst ist
   npm-CLI-Bordmittel.

## Konsequenzen

- Der Workflow braucht `permissions: id-token: write`; das npm CLI im
  Runner muss ≥ 11.5.1 sein (OIDC-Support).
- Der Trusted Publisher wird auf npmjs.com an **genau einen
  Workflow-Dateinamen** gebunden — Release- und Canary-Pfad leben deshalb
  in einer Workflow-Datei.
- Das `repository`-Feld der `package.json` muss auf dieses Monorepo zeigen
  (inkl. `directory`), sonst schlägt die Provenance-Prüfung fehl — es
  zeigt aktuell noch auf `Samisdat/wtal-panorama` und muss korrigiert
  werden.
- Versions-Bumps für Releases passieren manuell in der `package.json` per
  PR (GitHub Flow, ADR 0001). Changesets wäre die Alternative mit fertiger
  Action, ist für ein Ein-Personen-Repo aber Prozess-Overhead.
- Nach der Umstellung kann der Publishing-Access des Packages auf
  „Trusted Publisher only" beschränkt werden — Tokens werden dann von der
  Registry abgelehnt.

Der konkrete Umsetzungsplan steht in `docs/plan/NPM.md` (temporär, ADR 0013).
