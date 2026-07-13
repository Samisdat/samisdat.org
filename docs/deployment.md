# Deployment Setup

Dieses Dokument beschreibt die Deployment-Konfiguration für das Blog-Monorepo.

---

## Storybook (Chromatic)

Die Storybook-Dokumentation wird automatisch via **Chromatic** deployed:

- **Auf jedem PR**: Visual Regression Tests + Preview-Link
- **Auf `main`**: Automatisches Deployment (Änderungen werden auto-akzeptiert)

### Einrichtung (einmalig)

1. **Chromatic-Account anlegen**:
   - Gehe zu [chromatic.com](https://www.chromatic.com)
   - Sign in with GitHub
   
2. **Projekt erstellen**:
   - "Add Project" → Repository auswählen
   - Notiere das **Project Token** (beginnt mit `chpt_...`)

3. **GitHub Secret hinzufügen**:
   - In diesem Repo: Settings → Secrets and variables → Actions
   - New repository secret:
     - Name: `CHROMATIC_PROJECT_TOKEN`
     - Value: Das Token von Chromatic (z.B. `chpt_8bad2f6d1a883ec`)
   - ⚠️ **Wichtig**: Token NICHT in Code committen!

### Workflow

Nach dem Setup:

- Jeder Push zu `main` deployed automatisch zu Chromatic
- Jeder PR bekommt einen Chromatic-Check:
  - ✅ Keine visuellen Änderungen → auto-pass
  - ⚠️  Änderungen erkannt → Review auf Chromatic-Dashboard
  - Link zur Preview erscheint im PR-Kommentar

### Konfiguration

- **Workflow**: `.github/workflows/chromatic.yml`
- **Config**: `packages/ui-components/chromatic.config.json`

**Wichtige Config-Optionen**:
- `autoAcceptChanges: "main"` — Änderungen auf main werden automatisch akzeptiert
- `onlyChanged: true` — Nur Stories bauen, die sich geändert haben (schneller)
- `exitZeroOnChanges: true` — CI schlägt nicht fehl bei visuellen Änderungen

### Links

- [Chromatic Docs](https://www.chromatic.com/docs/)
- [Chromatic GitHub Action](https://github.com/chromaui/action)

---

## Website (Vercel)

Die Website (`packages/website`) wird via Vercel deployed:

- Root `package.json` enthält:
  - `deploy:preview` — Preview-Deployment
  - `deploy:prod` — Production-Deployment

Details siehe Vercel-Dashboard.

---

## Library (npm)

Das `panorama`-Package wird via GitHub Actions zu npm published:

- Workflow: `.github/workflows/npm-publish.yml`
- Trigger: Git-Tag mit Pattern `v*` (z.B. `v1.0.0`)

Details siehe [npm-publish.yml](.github/workflows/npm-publish.yml).
