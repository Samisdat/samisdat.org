# LiveCodes als Sandpack-Ersatz: POC und Reife-Einschätzung

Stand: 2026-10-26 · LiveCodes App v49 (2026-05-08), SDK `livecodes@0.14.1` (MIT)

## Entscheidung: verworfen

**LiveCodes ersetzt Sandpack nicht.** Technisch ist es machbar (siehe unten), aber es löst das
eigentliche Problem nicht und bringt neue mit. Stattdessen bauen wir eine kleine eigene Komponente
(Mehrdatei-Tabs, alles außer den Import-Zeilen editierbar, Dependencies zur Build-Zeit gebündelt).

Gründe:

1. **Kein Multi-File-Modell.** Mehrdatei-React-Beispiele (`parallax/hills` hat sieben Module)
   müssen zu einer Riesendatei zusammengeklebt werden, die wir so nie schreiben würden (Befund 1).
   Das ist genau der Fall, für den wir Sandpack ersetzen wollen. Multi-File ist bei LiveCodes nur
   ein offener RFC.
2. **Falsche TypeScript-Fehler im Editor.** Im zusammengeklebten Script zeigt der eingebaute
   Language-Service rote Squiggles, obwohl der Code läuft. Das stört beim Lesen und Editieren.
3. **Hoher Betriebsaufwand für wenig Gewinn.** Echtes Self-Hosting braucht einen Build aus dem
   Quellcode und eine zweite HTTPS-Origin für die Sandbox, weil das Release-Artefakt auf GitHub
   Pages zeigt (Befund 2). Dazu kommen Sonderbehandlungen in Next (`skipTrailingSlashRedirect`,
   Proxy, Befund 2b).
4. **Datenschutz bleibt offen.** Zur Laufzeit gehen Requests an jsDelivr, esm.sh, die
   TypeScript-CDN, unpkg und Google Fonts (Befund 3). Jeder Besucher übermittelt damit IP und
   User-Agent an Dritte. Das ist bei Sandpack nicht besser, wird aber mit LiveCodes nicht gelöst.
5. **Reife.** Bus-Faktor 1 (~88 % der Commits), SDK durchgehend `0.x` mit Deprecations. Das wäre
   allein kein K.-o. (MIT, Self-Hosting verifiziert), spricht aber gegen eine Abhängigkeit, die
   uns nichts Entscheidendes abnimmt.

Wo LiveCodes passen würde: reine HTML/CSS/JS-Demos, weil es dafür drei native Editoren hat und
nichts inlinen muss. Das allein trägt die Abhängigkeit nicht, weil eine eigene Komponente beides
abdecken kann.

**Weiterer Weg:** Eigene Komponente mit CodeMirror 6 (Transaction-Filter sperrt Import-Zeilen),
sucrase für TSX im Browser, Sandbox-Iframe mit `sandbox="allow-scripts"` und Import-Map, Pakete
aus einem Vendor-Build unter `public/vendor/`. Damit entfallen Fremd-CDNs zur Laufzeit.
Grenzen: keine Typprüfung, keine neuen Dateien oder Libraries im Editor, Preview-State wird bei
jeder Änderung zurückgesetzt.

Der POC-Code (`LiveCodes.tsx`, `inlineModules.ts`, Lab-Seite, Testpost, Next-Anpassungen) wurde
bewusst **nicht** committet. Dieses Dokument hält die Ergebnisse fest.

### Falls die Entscheidung je neu aufgerollt wird

Dann gilt als Minimalvariante „go mit Einfrieren und Self-Hosting“:

1. App-Version und SDK auf `v49` / `0.14.x` pinnen und nur bewusst anheben.
2. App **aus dem Quellcode** mit `SELF_HOSTED=true`, `SANDBOX_HOST_NAME`, `SANDBOX_PORT` bauen
   und die statische Sandbox (`src/livecodes/html/sandbox/`, 12 KB) auf einer **eigenen zweiten
   Origin** ausliefern. Das Release-Artefakt reicht nicht (Befund 2). Der Build wurde im POC
   durchgeführt und läuft (Befund 2, „Verifikation“).
3. Posts mit mehreren Modulen brauchen den Inliner (`inlineModules.ts`) oder müssen auf ein
   Modul reduziert werden (Befund 1).

## Was im POC gebaut wurde (nicht committet)

- `packages/website/src/components/Sandbox/LiveCodes.tsx`: gleiche `SandboxProps` wie
  `Sandbox/index.tsx`, Sandpack unverändert. Nicht abbildbare Props sind als `_`-Parameter
  durchgereicht und ignoriert.
- `packages/website/src/components/Sandbox/inlineModules.ts`: flacht die `files`-Map in ein
  Script und ein Stylesheet.
- `packages/website/src/app/lab/livecodes/page.tsx`: `foo/example-1` und `parallax/hills`
  mit Sandpack und LiveCodes untereinander.
- Das App-Build liegt unter `public/livecodes-app/` (7,2 MB ohne `docs/` und `stories/`) und
  ist per `.gitignore` ausgeschlossen. Beschaffung: `gh release download v49 -R live-codes/livecodes -p 'livecodes-v49.tar.gz'`,
  `build/` nach `public/livecodes-app/` kopieren.

## Muss-Kriterien

| Kriterium | Ergebnis |
| --- | --- |
| `files`-Map (React+TS) mit Editor und Preview | **Teilweise.** Beide Beispiele laufen, aber nur über den Inliner. LiveCodes hat kein Multi-File-Modell. |
| npm-Dependencies in der Sandbox | **Ja.** Bare Imports (`react`, `react-dom/client`) werden zur Laufzeit über esm.sh aufgelöst; Versionen per `react@18`, eigene Import-Map über `config.imports`. |
| Dunkles Theming passend zum Blog | **Ja, nicht pixelgleich.** `theme: 'dark'`, `editorTheme: 'one-dark-pro'`. Sandpack nutzt `nightOwl`; ein passendes LiveCodes-Theme wurde nicht gesucht. Die App-Chrome-Farben (`themeColor`) wurden nicht angepasst. |
| Einbettung im App Router ohne Hydration-Probleme | **Ja.** `'use client'`, `createPlayground` nur im `useEffect`, Iframe wird im Client erzeugt. Keine Hydration-Warnung, keine React-Fehler in der Konsole. Eine Stolperfalle: das SDK verlangt eine **absolute** `appUrl` (relativer Pfad wirft „is not a valid URL"), und `public/` liefert kein Directory-Index aus, daher `…/livecodes-app/index.html`. |
| Self-Hosting ohne Laufzeitabhängigkeit von livecodes.io (K.-o.) | **Ja, verifiziert** mit `SELF_HOSTED`-Build und eigener Sandbox-Origin (Befund 2). Weiterhin Fremd-CDNs (Befund 3). |

## Befunde

### 1. Kein Multi-File-Modell

Die Config kennt `markup`, `style`, `script` (und `tests`), keine `files`-Map. Multi-File-Support
ist ein offener RFC (live-codes/livecodes#886, seit 2025-10-02, 3 Kommentare). `parallax/hills`
hat sieben Module; der Inliner führt sie zusammen (lokale Imports entfernen, `export` entfernen,
Bare-Imports mergen, `index.tsx` zuletzt). Er ist regexbasiert und deckt nur einfache
Named-Imports und top-level-Deklarationen ab. Konsequenzen: Der Leser sieht eine Datei statt der
`visibleFiles`-Tabs; Namenskollisionen zwischen Modulen werden nicht erkannt; `showTabs`,
`closableTabs`, `visibleFiles` und `activeFile` haben keine Entsprechung.

### 2. Die Sandbox-Origin ist beim Build festgelegt

Das Release-Artefakt `livecodes-v49.tar.gz` enthält die App, aber nicht die Sandbox. Im Bundle
steht fest `https://live-codes.github.io/livecodes-sandbox/dist` (auf `localhost` stattdessen
`http://127.0.0.1:8085`, Dateiendung `.html`). Quelle: `src/livecodes/services/sandbox.ts`
priorisiert `SELF_HOSTED=true` + `SANDBOX_HOST_NAME` (Build-Zeit), dann localhost, dann
GitHub/Cloudflare Pages. Result- und Compiler-Iframe laufen bewusst auf einer anderen Origin
als die App. Eine echte Self-Hosting-Variante braucht also einen eigenen Build und eine zweite
Origin mit HTTPS.

Im POC lief die Sandbox lokal auf `127.0.0.1:8085` (statischer Server mit CORS, Ordner aus dem
Tag `v49`). Das belegt, dass Editor und Preview ohne GitHub Pages funktionieren, ersetzt aber
nicht den `SELF_HOSTED`-Build, denn auf `localhost` gewinnt in v49 immer `127.0.0.1:8085`.

**Verifikation des `SELF_HOSTED`-Builds** (Quelle `v49`, Scratchpad außerhalb des Repos):

- Build: `npm ci --ignore-scripts`, dann
  `SELF_HOSTED=true SANDBOX_HOST_NAME=sandbox.localhost SANDBOX_PORT=8090 DOCS_BASE_URL=null npm run build:app`.
  Der Build ruft `git rev-parse HEAD` auf und scheitert in einem entpackten Tarball ohne `.git`;
  ein Wegwerf-`git init` mit einem Commit genügt. Ergebnis: 6,4 MB.
- Bundle: 13 Dateien enthalten `sandbox.localhost:8090`, 0 enthalten
  `live-codes.github.io/livecodes-sandbox` (das v49-Release-Artefakt zeigt dort hin).
- Laufzeit: App auf `http://app.localhost:8091`, Sandbox auf `https://sandbox.localhost:8090`
  (selbstsigniertes Zertifikat, `ignoreHTTPSErrors`), SDK-Embed mit einem React-TSX-Projekt.
  Die Preview rendert („selfhost ok“). Requests gingen an die eigene App, die eigene Sandbox,
  `cdn.jsdelivr.net`, `esm.sh` und `cdnjs.cloudflare.com`, **keiner** an `livecodes.io` oder
  `github.io`. Ein Abruf von `es-module-shims` über jsDelivr brach ab, die Preview lief trotzdem.
- Offen bleibt der Betrieb hinter echtem HTTPS mit gültigem Zertifikat auf einer realen Domain
  (Same-Site-/Cookie-Verhalten der zwei Origins wurde nicht geprüft).

Damit ist das K.-o.-Kriterium erfüllt: Kein Laufzeitzugriff auf `livecodes.io`, Self-Hosting mit
eigener App- und Sandbox-Origin funktioniert. Die verbleibende Abhängigkeit sind die Fremd-CDNs
aus Befund 3.

### 2b. „Edit on LiveCodes“ braucht die Verzeichnis-URL mit Slash

Das Logo im Embed öffnet `<appUrl-Verzeichnis>/#config=…` in einem neuen Tab. Die App leitet ihre
Asset-Basis aus dem Seitenpfad ab; ohne abschließenden Slash lädt sie `/livecodes/app….js` statt
`/livecodes-app/livecodes/…` und bleibt bei „Loading LiveCodes…“ hängen. Next entfernt den Slash
standardmäßig und `public/` liefert kein Directory-Index. Im POC lösen das
`skipTrailingSlashRedirect: true` in `next.config.ts` und `src/proxy.ts` (`/livecodes-app` → 307 auf
`/livecodes-app/`, dort Rewrite auf `index.html`). Nebenwirkung: Reguläre Routen sind jetzt mit und
ohne Slash erreichbar. Auf einer eigenen statischen Origin (Empfehlung oben) entfällt das Problem.
Im geöffneten Tab zeigt der Editor teils TypeScript-Fehler, solange die Typen von `react` noch nicht
nachgeladen sind.

### 3. Viel CDN-Zugriff zur Laufzeit

Netzwerk-Log der Lab-Seite (Playwright, ein Seitenaufruf, ohne Sandpack-Hosts): **null Requests
an `livecodes.io`**, aber Requests an

- `cdn.jsdelivr.net` / `data.jsdelivr.com`: Editor (`@live-codes/codemirror`), TypeScript-Compiler,
  `@live-codes/browser-compilers`, `es-module-shims`, Typen für `react`/`react-dom`
- `esm.sh`: die eigentlichen npm-Pakete in der Preview (`react`, `react-dom`, `scheduler`)
- `playgroundcdn.typescriptlang.org`: `lib.*.d.ts` (ca. 100 Dateien, einzelne 404 für Legacy-Libs)
- `unpkg.com`, `fonts.googleapis.com`: Standard-CSS-Reset und Font der LiveCodes-Standardvorlage

Das ist kein Bruch des K.-o.-Kriteriums wörtlich genommen, aber ein „Self-Hosting" im Sinne von
offlinefähig ist es nicht. Zum Vergleich: Sandpack lädt zur Laufzeit von `*.sandpack.codesandbox.io`,
`prod-packager-packages.codesandbox.io`, `data.jsdelivr.com`/`cdn.jsdelivr.net` und sendet
Telemetrie an `col.csbops.io` (im POC-Lauf ein Timeout-Fehler in der Konsole). Die Abhängigkeitsklasse
ist dieselbe, nur die Anbieter unterscheiden sich. Vollständiges Vendoring wurde nicht versucht.

## Reife-Analyse

Alle Zahlen via `gh api` am 2026-10-26.

| Messgröße | Wert |
| --- | --- |
| Erstellt / letzter Push | 2021-01-10 / 2026-10-24, nicht archiviert |
| Lizenz | MIT |
| Stars / Forks / offene Issues | 1522 / 272 / 25 (inkl. PRs) |
| npm-Downloads (Monat bis 2026-10-22) | 7079 |
| SDK-Versionen | 26 auf npm, alle `0.x`, erste 2022-09-08, aktuell 0.14.1 (2026-05-08) |

**Commit-Kadenz (Default-Branch)**: 2021: 870 · 2022: 801 · 2023: 893 · 2024: 1203 · 2025: 814 ·
2026 (bis Oktober): 746. Letzte 12 Monate pro Monat: 55, 25, 33, 27, 68, 96, 7, 72, 52, 141, 8, 142,
133 (Okt 2025 bis Okt 2026), also schwankend, aber ohne Abbruch. Seit über fünf Jahren konstant
im Bereich 800 bis 1200 Commits pro Jahr.

**Release-Rhythmus**: 75 Releases (App `vN` und `sdk-v…` zusammengezählt): 2021: 4, 2023: 25,
2024: 26, 2025: 15, 2026: 5. Das letzte Release (`v49`, `sdk-v0.14.1`) ist vom 2026-05-08, also
5,5 Monate alt, während `main` weiterläuft. Der Release-Takt ist deutlich langsamer geworden, die
Commit-Kadenz nicht.

**Contributor-Verteilung**: 33 Contributor, 5324 Commits. `hatemhosny` 4596 (86 %), `zyf722` 252,
`livecodes-ci[bot]` 146, `gigamaster` 98, `pullfrog[bot]` 86, danach unter 25. Ohne Bots bleibt es
bei rund 88 % für eine Person. Bus-Faktor 1.

**Issue-Reaktion** (80 jüngste Issues ohne PRs, reichend bis 2023-06-02; Bot-Kommentare
ausgeschlossen): erste menschliche Antwort Median 6,0 h, 75. Perzentil 36,8 h, 90. Perzentil
374,9 h; 5 von 80 ohne jeden Kommentar. Zeit bis Schließung: Median 4,2 Tage, 90. Perzentil
412,9 Tage (n = 59).

**SDK-Stabilität**: durchgehend `0.x`, es gibt Deprecations im SDK selbst (`lite`, `view` wurden in
`config.mode` / `config.view` verschoben und warnen in der Konsole). Der Self-Hosting-Skill im
npm-Paket nennt `library_version: 0.13.0`, das Paket ist 0.14.1; das SDK-Paket enthält nur den
Loader (484 KB), die App ist ein separates Artefakt. SDK und App sind lose über eine
Versions-URL gekoppelt (`v48.livecodes.io` o. ä. als „permanent URL" in der Doku), was beim
Einfrieren hilft.

**Hosting-Modell**: reiner Static-Hosting-Betrieb (GitHub Pages, Netlify, Cloudflare, Docker).
Share-Service (dpaste.com) und Broadcast sind Zusatzdienste, die der Blog nicht braucht.

### Bewertung

- Für „funktioniert in drei Jahren": Der Code ist MIT, die App ist reines Static-Hosting, ein
  gepinnter Build bleibt lauffähig, solange die CDNs (jsDelivr, esm.sh, TypeScript-CDN) bestehen.
  Dieses Risiko trägt Sandpack gleichermaßen.
- Gegen: Bus-Faktor 1 (~88 %), SDK `0.x` mit Deprecations, Multi-File nur als RFC. Fällt der
  Maintainer weg, friert man auf v49 ein und pflegt den Fork nicht weiter; das ist bei
  Self-Hosting und MIT zumutbar, aber nur, wenn die CDN-Abhängigkeiten bewusst akzeptiert
  oder gevendort werden.

## Nice-to-have

- **SSR-Preview**: nicht möglich. LiveCodes ist ein reines Client-Iframe; vor dem Laden sieht der
  Leser nur den Platzhalter („Loading LiveCodes…"). Sandpack hat dasselbe Problem.
- **CodeSandbox-Export**: nicht geprüft, in der mitgelieferten Import/Export-Doku wird CodeSandbox
  nicht erwähnt. Wird der Button gebraucht, wäre er eine Eigenbau-Aufgabe.

## Offen / nicht verifiziert

- Betrieb des `SELF_HOSTED`-Builds auf einer realen Domain mit gültigem HTTPS-Zertifikat.
- Betrieb ohne jede externe CDN-Verbindung (Vendoring von `@live-codes/browser-compilers`,
  Editor-Assets, Import-Map auf eigene React-Kopien).
- Mobile/Touch, Ladezeit gegenüber Sandpack, Verhalten bei mehreren Embeds pro Seite (jedes
  Embed lädt seine eigene App- und Sandbox-Instanz).
- Theme-Angleich an `nightOwl`.
