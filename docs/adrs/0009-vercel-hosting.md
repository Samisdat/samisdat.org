# ADR 0009: Vercel als Hosting-Plattform

Datum: 2026-07-12 · Status: Akzeptiert

## Kontext

Das Blog braucht ein Hosting, das Next.js-Features (SSR, ISR, Edge
Functions, Image Optimization) nativ unterstützt. Alternativen waren
Self-Hosting (Docker/VPS), Netlify, oder Cloudflare Pages.

## Entscheidung

Wir deployen auf Vercel mit der Vercel CLI (`vercel` v54 im Root).

- `pnpm deploy:preview` — Preview Deployment (pro Branch/PR)
- `pnpm deploy` — Production Deployment

## Begründung

- **Native Next.js-Unterstützung**: Vercel ist der Hersteller von Next.js;
  neue Features (Turbopack Builds, Server Actions, PPR) funktionieren dort
  zuerst und am besten.
- **Preview Deployments**: Jeder Branch/PR bekommt eine eigene URL —
  nützlich zum Prüfen von Content-Änderungen vor Merge.
- **Zero Config**: Kein Dockerfile, kein Nginx-Setup, kein CDN-
  Konfigurieren.
- **GitHub-Flow-Kompatibilität**: Passt zu ADR 0001 — `main` wird
  automatisch deployed, Branches bekommen Previews.

## Konsequenzen

- Vercel CLI ist als Root-Dev-Dependency installiert.
- Build-Command muss Vercel-kompatibel sein (`pnpm build` baut panorama →
  website).
- Vendor Lock-in: Ein Wechsel zu Self-Hosting würde Next.js-spezifische
  Features (Image Optimization, Edge Middleware) erfordern, eigene Infra
  aufzusetzen.
- Kosten: Hobby-Plan ist kostenlos; bei Traffic-Wachstum fallen ggf.
  Kosten an.
