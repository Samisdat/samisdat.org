# Codesandboxes

Dieses Verzeichnis enthält die Sandbox-Beispiele die in Blog-Posts eingebunden werden.

## Struktur

```
codesandboxes/
└── {post-slug}/
    └── {sandbox-name}/
        ├── src/
        │   ├── App.tsx
        │   ├── index.tsx
        │   └── styles.css
        ├── public/
        │   └── index.html
        ├── package.json
        └── tsconfig.json
```

## Lokal entwickeln

Jede Sandbox ist eine eigenständige React-App mit `react-scripts` (Create React App):

```bash
# In eine Sandbox navigieren
cd codesandboxes/foo/example-1

# Dependencies installieren (einmalig)
npm install

# Dev Server starten
npm start

# Production Build
npm run build
```

Die App läuft dann auf http://localhost:3000 (oder einem anderen freien Port).

## Automatische Generierung

Beim Build (`npm run build`) werden automatisch alle Sandbox-Verzeichnisse erstellt,
falls sie noch nicht existieren. Das Template kommt aus `src/components/Sandbox/templates.ts`.

**Wichtig:** Die generierten Files sind bereits mit `npm install` lauffähig!

## In Blog-Posts verwenden

```mdx
<Sandbox name="example-1" />
<Sandbox
    name="example-2"
    template="vanilla"
/>
```

- `name`: Muss mit dem Verzeichnisnamen übereinstimmen
- `template`: Optional, `react-ts` (default) oder `vanilla`

## Troubleshooting

**Port already in use:**

```bash
PORT=3333 npm start
```

**TypeScript Errors:**
Check dass `tsconfig.json` im Sandbox-Verzeichnis die richtigen Compiler-Optionen hat.
