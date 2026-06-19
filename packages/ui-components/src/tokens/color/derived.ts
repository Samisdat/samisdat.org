export const color = {
  "aubergine-deep": "oklch(from var(--primitive-aubergine) calc(l - 0.07) c h)",
  "aubergine-base": "var(--primitive-aubergine)",
  "aubergine-raised":
    "oklch(from var(--primitive-aubergine) calc(l + 0.15) calc(c * 1.2) h)",
  "aubergine-subtle":
    "oklch(from var(--primitive-aubergine) calc(l + 0.22) c h)",
  "aubergine-muted":
    "oklch(from var(--primitive-aubergine) calc(l + 0.35) calc(c * 0.8) h)",

  "ivory-bright": "oklch(from var(--primitive-ivory) calc(l + 0.05) c h)",
  "ivory-base": "var(--primitive-ivory)",
  "ivory-soft": "oklch(from var(--primitive-ivory) calc(l - 0.07) c h)",
  "ivory-subtle": "oklch(from var(--primitive-ivory) calc(l - 0.12) c h)",
  "ivory-muted": "oklch(from var(--primitive-ivory) calc(l - 0.20) c h)",
  "ivory-dim": "oklch(from var(--primitive-ivory) calc(l - 0.35) c h)",

  "red-on-dark": "var(--primitive-red)",
  "orange-on-dark": "var(--primitive-orange)",
  "yellow-on-dark": "var(--primitive-yellow)",
  "green-on-dark": "var(--primitive-green)",
  "teal-on-dark": "var(--primitive-teal)",
  "blue-on-dark": "var(--primitive-blue)",
  "purple-on-dark": "var(--primitive-purple)",
  "pink-on-dark":
    "oklch(from var(--primitive-pink) l calc(c * 1.4) calc(h - 15))",
  "cyan-on-dark": "var(--primitive-cyan)",

  "red-on-light":
    "oklch(from var(--primitive-red)    calc(l - 0.12) calc(c * 1.6) calc(h - 8))",
  "orange-on-light":
    "oklch(from var(--primitive-orange) calc(l - 0.15) calc(c * 1.4) calc(h - 5))",
  "yellow-on-light":
    "oklch(from var(--primitive-yellow) calc(l - 0.10) calc(c * 1.8) h)",
  "green-on-light":
    "oklch(from var(--primitive-green)  calc(l - 0.15) calc(c * 1.5) h)",
  "teal-on-light":
    "oklch(from var(--primitive-teal)   calc(l - 0.15) calc(c * 1.4) calc(h - 10))",
  "blue-on-light":
    "oklch(from var(--primitive-blue)   calc(l - 0.15) calc(c * 1.5) calc(h + 10))",
  "purple-on-light":
    "oklch(from var(--primitive-purple) calc(l - 0.15) calc(c * 1.5) h)",
  "pink-on-light":
    "oklch(from var(--primitive-pink)   calc(l - 0.08) calc(c * 1.5) h)",
  "cyan-on-light":
    "oklch(from var(--primitive-cyan)   calc(l - 0.15) calc(c * 1.4) calc(h - 10))",
} as const;

export type ColorToken = typeof color;
