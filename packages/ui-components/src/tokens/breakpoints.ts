// Shared responsive breakpoints. Imported into Linaria template literals and
// evaluated at build time, so these stay the single source of truth for the
// `medium` / `large` media queries used across layout components.
export const breakpoints = {
    narrow: '380px',
    medium: '768px',
    large: '1024px',
} as const;
