import next from "eslint-config-next";
import prettierConfig from "eslint-config-prettier";

const eslintConfig = [
  ...next,
  prettierConfig,

  // Global ignores
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "*.config.js",
      "*.config.ts",
      "*.config.mjs",
    ],
  },
];

export default eslintConfig;
