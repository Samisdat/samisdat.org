export type Theme = {
  colorScheme: "dark" | "light";
  tokens: Record<string, string>;
};

export const darkTheme: Theme = {
  colorScheme: "dark",
  tokens: {
    "color-background": "var(--color-aubergine-base)",
    "color-background-emphasis": "var(--color-aubergine-deep)",
    "color-background-secondary": "var(--color-aubergine-raised)",
    "color-background-subtle": "var(--color-aubergine-subtle)",
    "color-background-muted": "var(--color-aubergine-muted)",

    "color-foreground": "var(--color-ivory-base)",
    "color-foreground-emphasis": "var(--color-ivory-bright)",
    "color-foreground-secondary": "var(--color-ivory-soft)",
    "color-foreground-subtle": "var(--color-ivory-muted)",
    "color-foreground-muted": "var(--color-ivory-dim)",

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
    "color-background-emphasis": "var(--color-ivory-dim)",
    "color-background-secondary": "var(--color-ivory-bright)",
    "color-background-subtle": "var(--color-ivory-subtle)",
    "color-background-muted": "var(--color-ivory-muted)",

    "color-foreground": "var(--color-aubergine-base)",
    "color-foreground-emphasis": "var(--color-ivory-bright)",
    "color-foreground-secondary": "var(--color-ivory-soft)",
    "color-foreground-subtle": "var(--color-ivory-muted)",
    "color-foreground-muted": "var(--color-ivory-dim)",

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
  "background-deep",
  "background-raised",
  "background-subtle",
  "background-muted",
  "foreground",
  "foreground-bright",
  "foreground-soft",
  "foreground-muted",
  "foreground-dim",
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

export const getDarkTheme = () => `
  color-scheme: dark;
  ${Object.entries(darkTheme.tokens)
    .map(([k, v]) => `--${k}: ${v};`)
    .join("\n")}
`;

export const getLightTheme = () => `
  color-scheme: light;
  ${Object.keys(lightTheme.tokens)
    .map((k) => {
      const a = darkTheme.tokens[k];
      const b = lightTheme.tokens[k];
      // Token bewegt sich nicht -> kein color-mix
      if (!a || a === b) return `--${k}: ${b};`;
      return `--${k}: color-mix(in oklab, ${a}, ${b} calc(var(--theme-progress) * 100%));`;
    })
    .join("\n")}
`;
