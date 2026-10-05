import { readFileSync, realpathSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import type { StorybookConfig } from "@storybook/react-vite";
import wyw from "@wyw-in-js/vite";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Package dirs of all workspace packages this package depends on.
 *
 * Vite only watches its root (this package) and files it has loaded itself.
 * Modules that wyw-in-js evaluates at build time (tokens interpolated into
 * styled/css templates) are stripped from the transformed output, so Vite
 * never loads them and never watches them. Edits to those files then emit no
 * change event, and wyw-in-js' handleHotUpdate (which would re-transform the
 * dependent component) never runs.
 *
 * The whole package dir is watched, not just `src`: color-scheme exports
 * from `generated/` (rebuilt by `tz build --watch`). Vite's watcher already
 * ignores node_modules and .git.
 */
const workspacePackageDirs = (): string[] => {
  const pkg = JSON.parse(
    readFileSync(join(packageRoot, "package.json"), "utf8"),
  ) as Record<string, Record<string, string> | undefined>;
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };

  return Object.entries(deps)
    .filter(([, version]) => version.startsWith("workspace:"))
    .map(([name]) => realpathSync(join(packageRoot, "node_modules", name)));
};

// `vite` is not a direct dependency of this package, so the plugin is typed
// structurally instead of importing `Plugin` from "vite".
const watchWorkspaceSources = () => ({
  name: "samisdat:watch-workspace-sources",
  apply: "serve" as const,
  configureServer(server: { watcher: { add(paths: string[]): unknown } }) {
    server.watcher.add(workspacePackageDirs());
  },
});

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
    "@storybook/addon-themes",
  ],
  framework: "@storybook/react-vite",
  async viteFinal(config) {
    // Pre-include all component deps to prevent Vite from re-optimizing
    // (and renaming chunk files) during story navigation. Deps that are not
    // direct deps of this package are resolved through the workspace package
    // that owns them (Vite's nested "a > b" syntax).
    config.optimizeDeps = config.optimizeDeps || {};
    config.optimizeDeps.include = [
      ...(config.optimizeDeps.include || []),
      "react",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "react-dom",
      "@linaria/react",
      "culori",
      "@samisdat/ui-components > @linaria/core",
      "@samisdat/ui-components > react-shiki",
      "@samisdat/ui-components > @fortawesome/react-fontawesome",
      "@samisdat/ui-components > @fortawesome/free-regular-svg-icons",
      "@samisdat/ui-components > @fortawesome/free-solid-svg-icons",
      "@samisdat/ui-components > @fortawesome/fontawesome-svg-core",
    ];

    config.plugins = config.plugins || [];
    config.plugins.push(
      wyw({
        include: ["**/*.{ts,tsx,js,jsx}"],
        // color-scheme is generated plain data; nothing for Linaria to extract.
        exclude: [
          "**/node_modules/**",
          "**/.cache/**",
          "**/color-scheme/generated/**",
        ],
        babelOptions: {
          presets: ["@babel/preset-typescript", "@babel/preset-react"],
        },
      }),
      watchWorkspaceSources(),
    );

    return config;
  },
};
export default config;
