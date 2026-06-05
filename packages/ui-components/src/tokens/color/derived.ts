export const color = {
  // Primary token colors (used in globalstyle.ts)
  aubergine: `var(--primitive-aubergine)`,
  ivory: `var(--primitive-ivory)`,

  "aubergine-shade": "oklch(from var(--color-aubergine) calc(l - 0.07) c h)",
  "aubergine-tint":
    "oklch(from var(--color-aubergine) calc(l + 0.08) calc(c * 1.2) h)",
  "aubergine-light":
    "oklch(from var(--color-aubergine) calc(l + 0.15) calc(c * 1.2) h)",
  "aubergine-subtle":
    "oklch(from var(--color-aubergine) calc(l + 0.22) calc(c * 1) h)",
  "aubergine-muted":
    "oklch(from var(--color-aubergine) calc(l + 0.35) calc(c * 0.8) h)",
  "aubergine-wash":
    "oklch(from var(--color-aubergine) calc(l + 0.5)  calc(c * 0.6) h)",

  /* accents  */
  red: "var(--primitive-red)",
  orange: "var(--primitive-orange)",
  yellow: "var(--primitive-yellow)",
  green: "var(--primitive-green)",
  teal: "var(--primitive-teal)",
  blue: "var(--primitive-blue)",
  purple: "var(--primitive-purple)",
  pink: "var(--primitive-pink)",
  cyan: "var(--primitive-cyan)",
} as const;

export type ColorToken = typeof color;
