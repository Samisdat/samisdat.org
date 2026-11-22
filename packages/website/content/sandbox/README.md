# Sandbox

Local-only experiments. Every `*.mdx` file here is a page at `/sandbox/<slug>` while running `pnpm dev`.

- Same MDX pipeline, components and frontmatter as posts (`title` and `date` are required, `published` is ignored).
- Production builds contain no sandbox pages: the routes return 404, and nothing shows up in the home page, sitemap or feed.
- Slugs are lowercase alphanumerics with hyphens.
