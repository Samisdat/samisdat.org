import type { ThemeRegistration } from "shiki";
import { shikiTheme as generated } from "@samisdat/color-scheme/shiki";
export { styledGrammarLangs } from "../styledGrammar";

// One theme for both modes: colours are `var(--color-syntax-*)`, resolved by
// the active theme in the browser. Generated in @samisdat/color-scheme from the
// level 3 `syntax.*` tokens; do not add colours here.
export const shikiTheme: ThemeRegistration = generated;
