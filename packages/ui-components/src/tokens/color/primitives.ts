import { hue } from "../hue";

export const primitiveColors = {
  aubergine: `oklch(22% 0.05 ${hue.aubergine})`,
  ivory: `oklch(84.97% 0.037 ${hue.ivory})`,
  red: "oklch(64% 0.22 10)",
  orange: "oklch(73% 0.16 60)",
  yellow: "oklch(83% 0.16 85)",
  green: "oklch(68% 0.17 155)",
  teal: "oklch(78% 0.11 190)",
  blue: "oklch(62% 0.19 265)",
  purple: "oklch(60% 0.22 305)",
  pink: "oklch(75% 0.13 355)",
  cyan: "oklch(65% 0.15 200)",
};

export type PrimitiveColorToken = typeof primitiveColors;
