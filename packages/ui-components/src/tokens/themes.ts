import { semantic, type Mode } from "@samisdat/color-scheme/semantic";

export type Theme = {
  colorScheme: Mode;
  tokens: Record<string, string>;
};

// Token id `surface.default` -> CSS variable name `color-surface-default`.
const toVarName = (id: string) => `color-${id.replaceAll(".", "-")}`;

const createTheme = (colorScheme: Mode): Theme => ({
  colorScheme,
  tokens: Object.fromEntries(
    Object.entries(semantic[colorScheme]).map(([id, value]) => [
      toVarName(id),
      value,
    ]),
  ),
});

export const darkTheme = createTheme("dark");
export const lightTheme = createTheme("light");

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
