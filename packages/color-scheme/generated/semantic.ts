/**
 * Generated – do not edit.
 * Source: tokens/*.tokens.json, built by `pnpm --filter @samisdat/color-scheme build`.
 */

export const semantic = {
  dark: {
    "surface.default": "oklch(0.22 0.05 300)",
    "surface.emphasis": "oklch(0.15 0.05 300)",
    "surface.raised": "oklch(0.37 0.06 300)",
    "surface.subtle": "oklch(0.44 0.05 300)",
    "surface.muted": "oklch(0.57 0.04 300)",
    "text.default": "oklch(0.8497 0.037 30)",
    "text.emphasis": "oklch(0.8997 0.037 30)",
    "text.secondary": "oklch(0.7797 0.037 30)",
    "text.subtle": "oklch(0.6497 0.037 30)",
    "text.muted": "oklch(0.6129 0.037 30)",
    "ink.red": "oklch(0.64 0.22 10)",
    "ink.orange": "oklch(0.73 0.16 60)",
    "ink.yellow": "oklch(0.83 0.16 85)",
    "ink.green": "oklch(0.6806 0.1689 154.78)",
    "ink.teal": "oklch(0.78 0.11 190)",
    "ink.cyan": "oklch(0.659 0.112 201.2)",
    "ink.blue": "oklch(0.62 0.19 265)",
    "ink.purple": "oklch(0.6346 0.22 305)",
    "ink.pink": "oklch(0.72 0.28 330)",
    "status.danger": "oklch(0.64 0.22 10)",
    "status.warning": "oklch(0.73 0.16 60)",
    "status.success": "oklch(0.6806 0.1689 154.78)",
    "status.info": "oklch(0.62 0.19 265)",
  },
  light: {
    "surface.default": "oklch(0.8497 0.037 30)",
    "surface.emphasis": "oklch(0.6129 0.037 30)",
    "surface.raised": "oklch(0.8997 0.037 30)",
    "surface.subtle": "oklch(0.7297 0.037 30)",
    "surface.muted": "oklch(0.6497 0.037 30)",
    "text.default": "oklch(0.22 0.05 300)",
    "text.emphasis": "oklch(0.15 0.05 300)",
    "text.secondary": "oklch(0.37 0.06 300)",
    "text.subtle": "oklch(0.44 0.05 300)",
    "text.muted": "oklch(0.456 0.037 30)",
    "ink.red": "oklch(0.465 0.185 12)",
    "ink.orange": "oklch(0.455 0.112 55)",
    "ink.yellow": "oklch(0.37 0.075 88)",
    "ink.green": "oklch(0.395 0.114 147)",
    "ink.teal": "oklch(0.44 0.078 182)",
    "ink.cyan": "oklch(0.36 0.064 218)",
    "ink.blue": "oklch(0.465 0.24 268)",
    "ink.purple": "oklch(0.37 0.192 305)",
    "ink.pink": "oklch(0.4 0.17 345)",
    "status.danger": "oklch(0.465 0.185 12)",
    "status.warning": "oklch(0.455 0.112 55)",
    "status.success": "oklch(0.395 0.114 147)",
    "status.info": "oklch(0.465 0.24 268)",
  },
} as const;

export const modes = ["dark", "light"] as const;

export type Mode = (typeof modes)[number];
export type SemanticToken = keyof (typeof semantic)["dark"];
