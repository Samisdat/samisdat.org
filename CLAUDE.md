# Dev server

- Fresh worktrees have no built `@samisdat/wtal-panorama` (`dist` is missing). Run `pnpm build:lib` once before the first `pnpm dev`, otherwise pages that import it return a 500.
- Start the server only after `devs --here` reports none for this worktree (see the global dev server rule).
