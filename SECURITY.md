# Security Policy

## Dependency Vulnerabilities

Dieses Dokument dokumentiert bekannte Security-Findings aus Dependabot-Scans und bewertet deren Risiko für dieses Projekt.

Stand: **2026-07-14**

---

## Zusammenfassung

| Severity | Status | Count |
|----------|--------|-------|
| Critical | ✅ Behoben | 4 |
| High | 📋 Dokumentiert | 0 im Haupt-Lock, ~80 in Sandbox-Lockfiles |
| Medium | 📋 Dokumentiert | 2 (js-yaml, postcss) |
| Low | 📋 Dokumentiert | 1 (esbuild) |

---

## Kritische Vulnerabilities (✅ Behoben)

### Sandboxes: happy-dom, shell-quote
**Scope:** `packages/website/codesandboxes/**/package-lock.json`  
**Status:** ✅ Behoben durch `npm audit fix`

Die 4 kritischen Alerts (happy-dom VM Escape, shell-quote newline injection) waren ausschließlich in den CodeSandbox-Demo-Lockfiles. Diese Dependencies werden **nicht im Website-Build verwendet** — nur der Source-Code der Sandboxes wird via Sandpack eingebunden (siehe `getSandpackFiles.ts`, Zeile 40: `package-lock.json` ist explizit ausgeschlossen).

**Fix:** `npm install && npm audit fix` in beiden Sandboxes (`animations/animation-compare`, `parallax/hills`) hat die kritischen Alerts auf 0 reduziert.

---

## Medium-Severity (📋 Akzeptiertes Restrisiko)

### 1. js-yaml@3.14.2 — Quadratic-complexity DoS
**Package:** `js-yaml@3.14.2`  
**Source:** Transitive Dependency von `gray-matter@4.0.3`  
**Used in:** MDX-Frontmatter-Parsing (`packages/website`)

**Vulnerability:**  
DoS durch komplexe YAML-Aliase mit quadratischer Parsing-Komplexität.

**Risk Assessment:**  
- **Exposure:** Nur eigene MDX-Dateien (keine User-Input)
- **Impact:** Potenziell langsames Parsen bei manipulierten Frontmatter-Daten
- **Likelihood:** Sehr gering (wir kontrollieren alle MDX-Quellen)

**Mitigation:**  
- gray-matter@4.0.3 ist die neueste Version und nutzt js-yaml@^3.13.1
- Ein pnpm-Override auf js-yaml@4.x würde Breaking Changes einführen (getestet, nicht erfolgreich)
- **Accepted:** Restrisiko akzeptiert, da kein externer Input

**Action Required:** Keine. Monitoring für gray-matter-Updates, die js-yaml@4+ nutzen.

---

### 2. postcss@8.4.31 — XSS via Unescaped `</style>`
**Package:** `postcss@8.4.31`  
**Source:** Transitive Dependency von `next@16.2.10`  
**Used in:** Build-Time CSS-Processing

**Vulnerability:**  
XSS durch unescaped `</style>`-Tags in CSS-Stringify-Output.

**Risk Assessment:**  
- **Exposure:** Build-Time only (PostCSS wird nicht zur Runtime verwendet)
- **Impact:** Theoretisch XSS, wenn generiertes CSS `</style>` enthält
- **Likelihood:** Sehr gering (Next.js kontrolliert CSS-Output, keine User-CSS-Inputs)

**Mitigation:**  
- next@16.2.10 ist die neueste Version
- Next.js nutzt PostCSS intern; wir haben keinen direkten Einfluss auf die Version
- **Accepted:** Restrisiko akzeptiert, da:
  1. Nur zur Build-Zeit verwendet
  2. Kein User-generiertes CSS
  3. Next.js hat eigene CSP-Sicherheitsmechanismen

**Action Required:** Monitoring für Next.js-Updates, die postcss@>=8.5.10 bundeln.

---

## Low-Severity (📋 Dokumentiert)

### esbuild — Arbitrary File Read (Windows Dev Server)
**Package:** `esbuild`  
**Scope:** Development-Dependency

**Vulnerability:**  
Arbitrary File Read beim Laufen des Dev-Servers auf Windows.

**Risk Assessment:**  
- **Exposure:** Nur lokal in Entwicklungsumgebung
- **Impact:** Dateizugriff auf Dev-Maschine
- **Likelihood:** Gering (erfordert lokalen Zugriff)

**Accepted:** Keine Aktion erforderlich (Dev-only, keine Production-Exposure).

---

## Sandbox High-Severity (📋 Nicht relevant für Production)

### ~80 High-Severity Alerts in CodeSandbox-Lockfiles
**Scope:** `packages/website/codesandboxes/**/package-lock.json`

**Packages:** minimatch, rollup, node-forge, lodash, picomatch, jsonpath, ws, form-data, serialize-javascript, u.a.

**Status:** Dokumentiert als **nicht sicherheitsrelevant** für Production, weil:
1. **Sandboxes werden zur Build-Zeit nicht ausgeführt** — nur Source-Code wird eingelesen
2. **package-lock.json wird explizit ausgeschlossen** (getSandpackFiles.ts)
3. **node_modules werden nicht deployed**
4. **Nur für lokale Sandbox-Entwicklung relevant** (wenn ein Entwickler `npm install && npm start` in einem Sandbox-Verzeichnis läuft)

**Recommended Action (Optional):**  
Für Entwickler, die Sandboxes lokal laufen lassen wollen:
```bash
cd packages/website/codesandboxes/{sandbox-dir}
npm audit fix --force  # Breaking Changes möglich
```

**Accepted:** Sandbox-Alerts werden nicht weiter behandelt, da:
- CRA (react-scripts@5.0.1) ist deprecated und erhält keine Security-Updates
- Migration zu Vite würde alle Alerts beheben, aber ist außerhalb des Scopes dieser Welle
- Production-Build ist nicht betroffen

---

## Vercel Node.js Runtime

**Current:** Node 20.x (deprecated, wird von Vercel gewarnt)  
**Target:** Node 24.x

**Configuration:**
- `engines.node` in allen package.json gesetzt: `>=24 <25`
- `vercel.json` konfiguriert mit `NODE_VERSION=24`
- **User Action Required:** Im Vercel-Dashboard muss Node 24 als Runtime ausgewählt werden (Settings → General → Node.js Version)

Nach dem Merge und Deploy: Vercel Preview-Deploy prüfen, ob Node-20-Warnung verschwunden ist.

---

## Automatische Checks

**Implementiert:**
- `.npmrc` mit `engine-strict=true` erzwingt Node/pnpm-Versionen bei `pnpm install`
- Dependabot scannt wöchentlich alle Lockfiles
- CI würde durch `dependency-review-action` (Job 3, Welle 9) neu eingeführte Vulnerabilities blocken

**Empfohlen (Future):**
- `pnpm audit` als Gate im CI (derzeit nur manual)
- Automatisches Alert-Management via GitHub Actions

---

## Contact

Security-relevante Findings bitte per Issue oder direkt an [bastian@pertz.eu](mailto:bastian@pertz.eu).
