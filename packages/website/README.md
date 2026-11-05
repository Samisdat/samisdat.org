          https://andrei-calazans.com/posts/expensive-get-constant-call-blocking-the-js-thread/
          https://www.joshwcomeau.com/blog/how-i-built-my-blog-v2/
          https://hicks.design/journal
          https://www.stefanjudis.com/today-i-learned/pathlength-makes-makes-svg-path-animations-easier-to-manage/

## Vorschau für unveröffentlichte Posts

Posts mit `published: false` sind in Produktion nicht erreichbar. Zum Verschicken gibt es einen signierten Link pro Post:

```bash
pnpm --filter @samisdat/website preview:link <slug>
# https://samisdat.org/preview/<slug>/<token>
```

- Der Token ist ein HMAC des Slugs mit `PREVIEW_SECRET`. Ein Link öffnet genau einen Post, nicht alle Entwürfe.
- `PREVIEW_SECRET` muss in Vercel (Production) gesetzt sein, lokal in der Umgebung oder in `packages/website/.env.local`. Ohne Secret antwortet `/preview/...` immer mit 404.
- Alle Links widerrufen: Secret in Vercel ändern und neu deployen.
- Die Vorschau wird pro Request gerendert, mit `noindex`, `no-referrer` und ohne Cache; sie taucht weder in Sitemap noch Feed auf.
