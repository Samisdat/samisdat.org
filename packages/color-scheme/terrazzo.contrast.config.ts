/**
 * Lint-only config for the contrast check.
 *
 * Terrazzo's `a11y/min-contrast` only evaluates the default mode of a
 * resolver. So this config loads the primitives plus ONE mode file directly
 * (no resolver) and is run once per mode: `MODE=dark|light tz check -c …`.
 * Pairs are the contrast matrix minus the known baseline.
 */
import { defineConfig } from "@terrazzo/cli";
import { modes, type Mode } from "./src/contrast";
import { enforcedPairs } from "./src/baseline";

const mode = process.env.MODE as Mode | undefined;
if (!mode || !modes.includes(mode)) {
  throw new Error(`MODE must be one of ${modes.join(", ")} (got "${mode}")`);
}

export default defineConfig({
  tokens: ["./tokens/primitives.tokens.json", `./tokens/${mode}.tokens.json`],
  outDir: "./.contrast-out/",
  plugins: [],
  lint: {
    rules: {
      "a11y/min-contrast": [
        "error",
        {
          level: "AA",
          pairs: enforcedPairs(mode).map(({ foreground, background }) => ({
            foreground,
            background,
          })),
        },
      ],
    },
  },
});
