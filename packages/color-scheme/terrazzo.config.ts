import { defineConfig } from "@terrazzo/cli";
import js from "@terrazzo/plugin-js";
import tsModule from "./plugins/plugin-ts-module";

export default defineConfig({
  tokens: ["./tokens/theme.resolver.json"],
  outDir: "./generated/",
  // Keep source order (hue by hue) in the generated modules.
  alphabetize: false,
  plugins: [js({ filename: "tokens.js" }), tsModule()],
  lint: {
    rules: {
      "core/valid-color": "error",
      "core/colorspace": ["error", { colorSpace: "oklch" }],
      "core/max-gamut": ["error", { gamut: "srgb" }],
    },
  },
});
