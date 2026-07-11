// This file has been automatically migrated to valid ESM format by Storybook.
import type { StorybookConfig } from "@storybook/react-vite";
import wyw from "@wyw-in-js/vite";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function isStaleCacheEnoent(err: unknown): boolean {
  return (
    err instanceof Error &&
    "code" in err &&
    (err as NodeJS.ErrnoException).code === "ENOENT" &&
    !!err.message?.includes(".cache")
  );
}

/**
 * Wraps the wyw-in-js Vite plugin to recover from ENOENT errors caused by
 * stale Vite pre-bundled dependency cache references. When navigating between
 * stories, Vite may re-optimize deps (generating new chunk hashes), which
 * invalidates paths stored in wyw-in-js's TransformCacheCollection.
 *
 * Skipping the transform in that case would ship untransformed `styled` code
 * to the browser ("Using the styled tag in runtime is not supported") — and
 * because the stale entries stay in the plugin's internal caches, every
 * subsequent transform fails the same way until the server is restarted.
 * Instead, recreate the plugin (fresh caches) and retry the transform once;
 * if that still fails, let the error surface.
 */
function safeWyw(options: Parameters<typeof wyw>[0]) {
  type WywPlugin = ReturnType<typeof wyw> & {
    buildEnd: (this: unknown) => void;
    configResolved: (config: unknown) => void;
    configureServer: (server: unknown) => void;
    load: (this: unknown, id: string) => unknown;
    resolveId: (this: unknown, id: string) => unknown;
    handleHotUpdate: (ctx: unknown) => unknown;
    transform: (this: unknown, code: string, id: string) => Promise<unknown>;
  };

  let inner = wyw(options) as WywPlugin;
  let resolvedConfig: unknown;
  let devServer: unknown;

  const recreate = () => {
    inner = wyw(options) as WywPlugin;
    // Replay the lifecycle hooks the dev server already fired on the old
    // instance so the fresh one is fully initialized.
    if (resolvedConfig !== undefined) inner.configResolved(resolvedConfig);
    if (devServer !== undefined) inner.configureServer(devServer);
  };

  return {
    name: "wyw-in-js",
    enforce: "post",
    buildEnd() {
      inner.buildEnd.call(this);
    },
    configResolved(config: unknown) {
      resolvedConfig = config;
      inner.configResolved(config);
    },
    configureServer(server: unknown) {
      devServer = server;
      inner.configureServer(server);
    },
    load(id: string) {
      return inner.load.call(this, id);
    },
    resolveId(id: string) {
      return inner.resolveId.call(this, id);
    },
    handleHotUpdate(ctx: unknown) {
      return inner.handleHotUpdate(ctx);
    },
    async transform(code: string, id: string) {
      try {
        return await inner.transform.call(this, code, id);
      } catch (err: unknown) {
        if (!isStaleCacheEnoent(err)) throw err;
        recreate();
        return inner.transform.call(this, code, id);
      }
    },
  } as ReturnType<typeof wyw>;
}

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
    "@storybook/addon-themes",
  ],
  framework: "@storybook/react-vite",
  staticDirs: ["../public"],
  async viteFinal(config) {
    // Resolve @/* alias to website/src
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "../website/src"),
    };

    // Pre-include all component deps to prevent Vite from re-optimizing
    // (and renaming chunk files) during story navigation. This is the root
    // cause of wyw-in-js ENOENT errors on stale cache paths.
    config.optimizeDeps = config.optimizeDeps || {};
    config.optimizeDeps.include = [
      ...(config.optimizeDeps.include || []),
      "@linaria/react",
      "@linaria/core",
      "react",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "react-dom",
      "react-shiki",
      "culori",
      "@fortawesome/react-fontawesome",
      "@fortawesome/free-regular-svg-icons",
      "@fortawesome/free-solid-svg-icons",
      "@fortawesome/fontawesome-svg-core",
    ];

    // Add WYW-in-JS (Linaria) plugin for Vite, wrapped with ENOENT guard
    config.plugins = config.plugins || [];
    config.plugins.push(
      safeWyw({
        include: ["**/*.{ts,tsx,js,jsx}"],
        exclude: ["**/node_modules/**", "**/.cache/**"],
        babelOptions: {
          presets: ["@babel/preset-typescript", "@babel/preset-react"],
        },
      }),
    );

    // Enable HMR for monorepo workspace files
    config.server = config.server || {};
    config.server.middlewareMode = false;

    return config;
  },
};
export default config;
