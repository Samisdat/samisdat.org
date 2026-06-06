export type Theme = {
  colorScheme: "dark" | "light";
  tokens: Record<string, string>;
};

export const darkTheme: Theme = {
  colorScheme: "dark",
  tokens: {
    "color-background": "var(--color-aubergine-base)",
    "color-foreground": "var(--color-ivory-base)",
    "color-pink": "var(--color-pink-on-dark)",
    "color-teal": "var(--color-teal-on-dark)",
    "color-green": "var(--color-green-on-dark)",
    "color-yellow": "var(--color-yellow-on-dark)",
    "color-red": "var(--color-red-on-dark)",
    "color-blue": "var(--color-blue-on-dark)",
    "color-orange": "var(--color-orange-on-dark)",
    "color-cyan": "var(--color-cyan-on-dark)",
    "color-purple": "var(--color-purple-on-dark)",
  },
};

export const lightTheme: Theme = {
  colorScheme: "light",
  tokens: {
    "color-background": "var(--color-ivory-base)",
    "color-foreground": "var(--color-aubergine-base)",
    "color-pink": "var(--color-pink-on-light)",
    "color-teal": "var(--color-teal-on-light)",
    "color-green": "var(--color-green-on-light)",
    "color-yellow": "var(--color-yellow-on-light)",
    "color-red": "var(--color-red-on-light)",
    "color-blue": "var(--color-blue-on-light)",
    "color-orange": "var(--color-orange-on-light)",
    "color-cyan": "var(--color-cyan-on-light)",
    "color-purple": "var(--color-purple-on-light)",
  },
};

export const themedColors = [
  "background",
  "foreground",
  "teal",
  "green",
  "yellow",
  "red",
  "blue",
  "orange",
  "pink",
  "cyan",
  "purple",
];

export const toCSS = ({ colorScheme, tokens }: Theme) => `
  color-scheme: ${colorScheme};
  ${Object.entries(tokens)
    .map(([k, v]) => `--${k}: ${v};`)
    .join("\n")}
`;
