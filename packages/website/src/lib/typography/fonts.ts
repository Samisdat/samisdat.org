// next/font needs statically analysable calls with literal options, so every font is declared
// here by hand. Files come from the @fontsource(-variable)/* packages (pinned by the lockfile), all SIL OFL.
// Only the latin subset is used. Variable fonts keep the axes the presets use (wght, plus opsz where
// the family has it).
//
// preload: only the fonts of the default preset ("inter") are preloaded. @font-face rules of all
// the others exist on the page too, but the browser fetches a file only once a glyph uses it.
//
// adjustFontFallback: next can only derive metrics for Arial / Times New Roman. Monospace and
// script faces have no matching system face, so they run without size-adjust.
// Option values must be written out as literals (no shared constants), the font loader checks that.

export * from './fonts-default';
export * from './fonts-current';
export * from './fonts-more-a';
export * from './fonts-more-b';
export * from './fonts-more-c';
