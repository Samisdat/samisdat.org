# ADR 0003: Next.js mit Turbopack

Datum: 2026-07-12 · Status: Akzeptiert

## Kontext

Das Blog braucht ein Framework, das Static Site Generation für
Content-Seiten, serverseitiges Rendering wo nötig, und eine gute
Entwicklererfahrung bietet. Vorher lief das Blog auf einer älteren
Next.js-Version mit Pages Router.

## Entscheidung

Wir verwenden Next.js 16 mit App Router und Turbopack als Bundler für
Development (`next dev --turbopack`) und Build (`next build --turbopack`).

## Begründung

- **App Router**: React Server Components, verschachtelte Layouts und
  Streaming passen gut zu einem Content-lastigen Blog.
- **Turbopack**: Deutlich schnellere Dev-Server-Startzeiten und HMR im
  Vergleich zu Webpack. Seit Next.js 15 stable für Dev, seit 16 auch für
  Production Builds nutzbar.
- **Vercel-Integration**: Next.js + Vercel bietet Zero-Config Deploys,
  Preview Deployments pro Branch, und optimierte Edge-Auslieferung.
- **Ecosystem**: MDX-Support, Image Optimization, Font Optimization sind
  built-in oder gut integriert.

## Konsequenzen

- Kein eigenes Webpack-Config nötig — Turbopack-Kompatibilität muss bei
  Plugin-Auswahl beachtet werden.
- Linaria-Integration läuft über `next-with-linaria` (Wrapper um Next.js
  Config).
- Seiten und Layouts folgen den App-Router-Konventionen (`page.tsx`,
  `layout.tsx`, Route Groups).
- Bei Breaking Changes in Next.js Major Versions muss geprüft werden, ob
  Linaria/MDX-Plugins kompatibel bleiben.
