# ADR 0006: MDX für Blog-Content

Datum: 2026-07-12 · Status: Akzeptiert

## Kontext

Blog-Posts brauchen mehr als reines Markdown: interaktive Code-Beispiele
(Sandpack), Custom-Komponenten (Panorama-Einbettung) und programmierbare
Layouts. Alternativen waren ein Headless CMS (Contentful, Sanity), reines
Markdown mit Custom-Renderer, oder MDX.

## Entscheidung

Blog-Posts werden als MDX-Dateien im Repository geschrieben und zur
Build-Zeit mit `@mdx-js/mdx` und einer Pipeline aus remark/rehype-Plugins
verarbeitet.

Plugin-Pipeline:
- `remark-frontmatter` + `remark-mdx-frontmatter` — Metadaten (Titel,
  Datum, Tags) als Frontmatter
- `remark-gfm` — GitHub Flavored Markdown (Tabellen, Strikethrough)
- `remark-breaks` — Zeilenumbrüche als `<br>`
- `rehype-slug` + `rehype-autolink-headings` — Anchor-Links für Headings
- `rehype-pretty-code` + Shiki — Syntax Highlighting zur Build-Zeit
- `rehype-accessible-emojis` — Barrierefreie Emoji-Darstellung

## Begründung

- **Content im Repo**: Posts leben neben dem Code, werden versioniert und
  sind ohne externe Services verfügbar.
- **Komponenten in Content**: MDX erlaubt React-Komponenten direkt in
  Posts — z.B. `<Sandpack>` für editierbare Code-Beispiele.
- **Build-Zeit-Rendering**: Kein Client-JS für die Markdown-Transformation;
  Posts werden als statisches HTML ausgeliefert.
- **Kein Vendor Lock-in**: Kein CMS-Vertrag, keine API-Kosten, kein
  externer Build-Trigger.

## Konsequenzen

- Neue Posts werden als `.mdx`-Dateien angelegt (vermutlich unter
  `src/app/blog/`).
- Custom-Komponenten müssen im MDX-Scope registriert werden.
- Die Plugin-Pipeline muss bei MDX-Major-Updates geprüft werden (remark/
  rehype Unified-Ecosystem).
- Nicht-technische Autoren bräuchten Einarbeitung in MDX-Syntax — bei
  einem Ein-Personen-Blog kein Problem.
