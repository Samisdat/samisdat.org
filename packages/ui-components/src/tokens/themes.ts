export type Theme = {
  colorScheme: "dark" | "light";
  tokens: Record<string, string>;
};

export const darkTheme: Theme = {
  colorScheme: "dark",
  tokens: {
    "color-bg": "var(--color-aubergine-base)",
    "color-fg": "var(--color-ivory-base)",
    "color-accent": "var(--color-pink-on-dark)",
    "color-accent-alt": "var(--color-teal-on-dark)",
    "color-success": "var(--color-green-on-dark)",
    "color-warning": "var(--color-yellow-on-dark)",
    "color-danger": "var(--color-red-on-dark)",
    "color-info": "var(--color-blue-on-dark)",
    "color-orange": "var(--color-orange-on-dark)",
    "color-pink": "var(--color-pink-on-dark)",
    "color-cyan": "var(--color-cyan-on-dark)",
  },
};

export const lightTheme: Theme = {
  colorScheme: "light",
  tokens: {
    "color-bg": "var(--color-ivory-base)",
    "color-fg": "var(--color-aubergine-base)",
    "color-accent": "var(--color-pink-on-light)",
    "color-accent-alt": "var(--color-teal-on-light)",
    "color-success": "var(--color-green-on-light)",
    "color-warning": "var(--color-yellow-on-light)",
    "color-danger": "var(--color-red-on-light)",
    "color-info": "var(--color-blue-on-light)",
    "color-orange": "var(--color-orange-on-light)",
    "color-pink": "var(--color-pink-on-light)",
    "color-cyan": "var(--color-cyan-on-light)",
  },
};

export const themedColors = [
  "bg",
  "fg",
  "accent",
  "accent-alt",
  "success",
  "warning",
  "danger",
  "info",
  "orange",
  "pink",
  "cyan",
];

export const toCSS = ({ colorScheme, tokens }: Theme) => `
  color-scheme: ${colorScheme};
  ${Object.entries(tokens)
    .map(([k, v]) => `--${k}: ${v};`)
    .join("\n")}
`;
