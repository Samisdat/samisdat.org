// This file has been automatically migrated to valid ESM format by Storybook.
import type { StorybookConfig } from "@storybook/react-vite";
import wyw from "@wyw-in-js/vite";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

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
    // (and renaming chunk files) during story navigation.
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

    // Add WYW-in-JS (Linaria) plugin for Vite
    config.plugins = config.plugins || [];
    config.plugins.push(
      wyw({
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
