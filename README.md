# Blog Monorepo

Dieses Projekt ist ein pnpm Workspace mit 4 Packages:

- `packages/panorama` — npm Library (gebaut mit tsup, npm-publishable)
- `packages/website` — Next.js Blog
- `packages/ui-components` — Storybook UI Dokumentation
- `packages/tools` — Shared utilities (React hooks, helpers)

---

## Struktur

```
.
├── packages/
│   ├── panorama/        (Library, npm-publishable)
│   ├── website/         (Next.js App, blog)
│   ├── ui-components/   (Storybook)
│   └── tools/           (Shared utilities)
├── pnpm-workspace.yaml
├── package.json         (Root, Scripts)
└── README.md            (diese Datei)
```

---

## Setup

```bash
# Dependencies installieren
pnpm install

# Library bauen (vor erstem dev empfohlen)
pnpm build:lib
```

**Deployment**: Siehe [docs/deployment.md](./docs/deployment.md) für Chromatic (Storybook), Vercel (Website) und npm (Library).

---

## Root Scripts

```bash
# Panorama Library bauen
pnpm build:lib

# Website dev (mit Turbopack)
pnpm dev

# Alles bauen: panorama → website
pnpm build

# Storybook dev
pnpm storybook

# Storybook bauen
pnpm build-storybook

# Beide parallel: library + website
pnpm dev:all
```

---

## npm vs pnpm Befehlsreferenz

| Aufgabe                     | npm                              | pnpm                                |
| --------------------------- | -------------------------------- | ----------------------------------- |
| **Installation**            | `npm install`                    | `pnpm install`                      |
|                             | `npm ci`                         | `pnpm install --frozen-lockfile`    |
| **Packages hinzufügen**     | `npm install lodash`             | `pnpm add lodash`                   |
|                             | `npm install -D vitest`          | `pnpm add -D vitest`                |
|                             | `npm install -P react` (peer)    | `pnpm add -P react`                 |
| **Packages entfernen**      | `npm uninstall lodash`           | `pnpm remove lodash`                |
| **Aktualisieren**           | `npm update`                     | `pnpm update`                       |
|                             | `npm update lodash --latest`     | `pnpm update lodash --latest`       |
| **One-off Commands**        | `npx storybook@latest upgrade`   | `pnpm dlx storybook@latest upgrade` |
| **Audit**                   | `npm audit`                      | `pnpm audit`                        |
|                             | `npm audit fix`                  | `pnpm audit --fix`                  |
| **Scripts laufen**          | `npm run build`                  | `pnpm build`                        |
| **Monorepo: ein Package**   | `npm run build -w packages/blog` | `pnpm --filter blog build`          |
| **Monorepo: alle Packages** | `npm run build --workspaces`     | `pnpm -r build`                     |
| **List/Info**               | `npm list lodash`                | `pnpm list lodash`                  |
|                             | `npm view lodash`                | `pnpm info lodash`                  |
| **Cache löschen**           | `npm cache clean --force`        | `pnpm store prune`                  |
| **Global installl**         | `npm install -g typescript`      | `pnpm add -g typescript`            |

---

## Häufige Workflows

### Neue Package-Dependency hinzufügen

```bash
# In packages/website eine Dependency hinzufügen
cd packages/website
pnpm add lodash

# Oder vom Root aus mit --filter
pnpm --filter blog add lodash

# Dann vom Root install (optional, aber empfohlen)
pnpm install
```

### Ein Package upgraden (z.B. Storybook)

```bash
# Option A: Storybook's eigenes Upgrade-Skript
cd packages/ui-components
pnpm dlx storybook@latest upgrade

# Option B: Manuell updaten
pnpm update @storybook/* --latest
pnpm install

# Dann testen
pnpm build-storybook
```

### Audit in einem Package

```bash
# Im Package selbst
cd packages/ui-components
pnpm audit
pnpm audit --fix

# Oder mit --filter
pnpm --filter @samisdat/ui-components audit --fix
pnpm install  # vom Root nach Änderungen
```

### Alle Packages bauen

```bash
pnpm build        # panorama + website (standardmäßig)
pnpm -r build     # alle Packages mit build-Script
```

### Nur ein Package bauen

```bash
pnpm --filter blog build
pnpm --filter @samisdat/wtal-panorama build:lib
```

---

## pnpm dlx — Was ist das?

`dlx` = **d**ownload and e**x**ecute (pnpm-Entsprechung zu `npx`)

Lädt ein Package herunter, führt einen Command aus, und löscht es dann wieder. Praktisch für:

- **One-off Commands** (einmalige Befehle)
- **Tools die nicht installt bleiben sollen**
- **Immer die neuste Version ohne Update**

```bash
# Storybook upgraden (benutzt Storybooks Upgrade-Logik)
pnpm dlx storybook@latest upgrade

# TypeScript lokal runnen
pnpm dlx typescript --version

# Create a new Next.js app
pnpm dlx create-next-app@latest
```

---

## Dependency Ranges

In `package.json`:

| Syntax   | Bedeutung                              | pnpm              |
| -------- | -------------------------------------- | ----------------- |
| `^1.2.3` | `>=1.2.3 <2.0.0` (minor+patch updates) | Standard          |
| `~1.2.3` | `>=1.2.3 <1.3.0` (nur patch updates)   | Strikt            |
| `1.2.3`  | Exakte Version                         | Keine Updates     |
| `*`      | Beliebige Version                      | Nicht empfohlen   |
| `latest` | Neueste Version                        | mit `pnpm update` |

pnpm used **lockfile** (`pnpm-lock.yaml`):

- Alle Versions sind **pinned**
- `pnpm install` ist **deterministisch** (gleiche Versions immer)
- `pnpm install --frozen-lockfile` schlägt fehl wenn Lockfile veraltet ist (gut für CI)

---

## Troubleshooting

### `pnpm install` schlägt fehl

```bash
# Lokale pnpm-cache löschen
pnpm store prune

# Lockfile neu generieren
rm pnpm-lock.yaml
pnpm install
```

### Ein Package hat falschen Node

```bash
# Check Node Version
node --version

# pnpm nutzt System Node, also Node Update oder nvm benutzen
nvm use 20  # oder deine Version
pnpm install
```

### Dependency-Konflikt zwischen Packages

```bash
# Lockfile prüfen (sollte keine Duplikate geben)
pnpm ls lodash

# Ggfs. in root package.json auf gemeinsame Version einigen
# oder in pnpm-workspace.yaml overrides nutzen
```

---

## Links

- [pnpm Docs](https://pnpm.io)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Storybook Upgrade Guide](https://storybook.js.org/docs/releases/upgrading)
- [Next.js Docs](https://nextjs.org/docs)
