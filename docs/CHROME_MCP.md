# Chrome DevTools MCP

Ein Model Context Protocol (MCP) Server, der es Claude erlaubt, direkt mit Chrome DevTools zu interagieren und Webseiten zu inspizieren.

## Setup

### 1. Chrome mit DevTools Port starten

```bash
# macOS
open -a "Google Chrome" --args --remote-debugging-port=9222 http://localhost:3000

# Linux
google-chrome --remote-debugging-port=9222 http://localhost:3000

# Windows
"C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 http://localhost:3000
```

### 2. Dev Server starten

```bash
pnpm dev
```

Das MCP wird automatisch geladen und verbindet sich mit Chrome auf Port 9222.

## Verfügbare Tools

### `inspect_page`

Ruft Basis-Informationen über die aktuelle Seite ab.

**Output:**
- `title` - Seiten-Title
- `url` - Aktuelle URL

### `eval_js`

Führt JavaScript im Browser-Kontext aus und gibt das Ergebnis zurück.

**Parameter:**
- `code` (required) - JavaScript Code als String

**Beispiel:**
```
eval_js: document.querySelectorAll('h1').length
```

### `get_dom`

Gibt die komplette DOM-Struktur (HTML-Tree) der Seite aus.

**Output:** HTML-String der gesamten Seite

### `get_console_logs`

Ruft alle Console-Nachrichten der aktuellen Session ab (logs, warnings, errors).

**Output:**
```json
[
  {
    "type": "log|warning|error",
    "args": [...],
    "timestamp": "2026-06-10T..."
  }
]
```

### `get_network_logs`

Zeigt alle Network-Requests die die Seite gemacht hat.

**Output:**
```json
[
  {
    "method": "GET|POST|...",
    "url": "https://...",
    "headers": {...},
    "timestamp": "..."
  }
]
```

## Verwendungsbeispiele

### Seite inspizieren

```
"Schau dir die Seite http://localhost:3000 an und sag mir welche Überschriften es gibt"
```

Claude benutzt dann `eval_js` um die Überschriften zu extrahieren.

### DOM überprüfen

```
"Gib mir die HTML-Struktur der Komponente mit der ID 'main'"
```

Claude benutzt `get_dom` und sucht die relevante Komponente.

### JavaScript ausführen

```
"Führe window.location.href = '/blog/parallax' aus und schau dann auf die Seite"
```

Claude nutzt `eval_js` um die Navigation zu durchführen.

### Fehler debuggen

```
"Auf der Seite gibt es einen Fehler. Schau in den Console Logs nach und sag mir was falsch ist"
```

Claude schaut in `get_console_logs` und analysiert die Fehler.

## Technische Details

### MCP Server Datei

```
.claude/mcp/chrome-devtools.js
```

Der Server:
- Verbindet sich mit Chrome über Port 9222 (Chrome DevTools Protocol)
- Bietet Tools für DOM-Inspection, JS-Execution, und Log-Zugriff
- Läuft in Node.js und kommuniziert über stdio mit Claude

### Konfiguration

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "node",
      "args": [".claude/mcp/chrome-devtools.js"],
      "description": "Chrome DevTools Protocol server"
    }
  }
}
```

### Dependencies

- `chrome-remote-interface` - CDP Client Library
- Node.js 18+

## Troubleshooting

### "Not connected to Chrome"

Chrome läuft nicht mit dem Debugging-Port oder ist nicht erreichbar.

**Lösung:**
```bash
# Port prüfen
lsof -i :9222

# Chrome neu starten
open -a "Google Chrome" --args --remote-debugging-port=9222
```

### "No page target found"

Chrome läuft, aber hat noch keine Seite offen.

**Lösung:**
- Navigiere zu einer Seite im Chrome Fenster
- Oder öffne Chrome direkt mit einer URL:
  ```bash
  open -a "Google Chrome" --args --remote-debugging-port=9222 http://localhost:3000
  ```

### Module not found

`chrome-remote-interface` ist nicht installiert.

**Lösung:**
```bash
pnpm add chrome-remote-interface
```

## Performance

Das MCP lädt CSS und JavaScript vom Browser, was bei großen Seiten langsam sein kann. Bei Performance-Tests große Seiten in mehreren Requests inspizieren.

## Sicherheit

Das Chrome MCP hat vollen Zugriff auf den Browser-Kontext. **Nur auf lokalem Dev-Server verwenden**.

Nicht für Production einsetzen, da DevTools Port zu Sicherheitslücken führt.

## Limitierungen

- Nur **eine Seite** kann gleichzeitig inspiziert werden
- Navigation über `eval_js` dauert ein paar Sekunden (warten auf Page Load)
- Dateiuploads/Forms erfordern detaillierte JavaScript-Logik
- Screenshots funktionieren nicht direkt (nutze Puppeteer stattdessen für visuelle Tests)
