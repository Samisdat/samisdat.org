import { hue } from "./hue";

export const color = {
  // Primary token colors (used in globalstyle.ts)
  aubergine: `oklch(22% 0.05 ${hue.aubergine})`,
  ivory: `oklch(84.97% 0.037 ${hue.ivory})`,
  
  // Darkest bg
  darkestBg: `oklch(3% 0.01 ${hue.aubergine})`,
  darkestBgAlpha4a: `oklch(3% 0.01 ${hue.aubergine})`,
  
  // Dark bg
  darkBg: `oklch(8% 0.03 ${hue.aubergine})`,
  
  // Neutral bg
  neutralBg: `oklch(25% 0.03 ${hue.aubergine})`,
  neutralBgAlpha66: `oklch(25% 0.03 ${hue.aubergine})`,
  
  // Foreground colors
  white: `oklch(100% 0 0)`,
  lightestFg: `oklch(98% 0.01 ${hue.ivory})`,
  lightFg: `oklch(92% 0.02 ${hue.ivory})`,
  lightFgAlpha14: `oklch(92% 0.02 ${hue.ivory})`,
  lightFgAlpha1a: `oklch(92% 0.02 ${hue.ivory})`,
  lightFgAlpha21: `oklch(92% 0.02 ${hue.ivory})`,
  lightFgAlpha45: `oklch(92% 0.02 ${hue.ivory})`,
  neutralFg: `oklch(67% 0.02 ${hue.aubergine})`,
  neutralFgAlpha8a: `oklch(67% 0.02 ${hue.aubergine})`,
  mutedFg: `oklch(55% 0.02 ${hue.aubergine})`,
  dimFg: `oklch(40% 0.02 ${hue.aubergine})`,
  darkFg: `oklch(32% 0.02 ${hue.aubergine})`,
  
  // Purple
  purple: `oklch(53% 0.24 ${hue.aubergine})`,
  purpleAlpha33: `oklch(53% 0.24 ${hue.aubergine})`,
  purpleAlpha45: `oklch(53% 0.24 ${hue.aubergine})`,
  purpleAlpha54: `oklch(53% 0.24 ${hue.aubergine})`,
  purpleAlpha66: `oklch(53% 0.24 ${hue.aubergine})`,
  purpleAlphaAb: `oklch(53% 0.24 ${hue.aubergine})`,
  darkPurple: `oklch(40% 0.20 ${hue.aubergine})`,
  darkPurpleAlpha45: `oklch(40% 0.20 ${hue.aubergine})`,
  darkPurpleAlphaAb: `oklch(40% 0.20 ${hue.aubergine})`,
  darkPurpleAlphaDe: `oklch(40% 0.20 ${hue.aubergine})`,
  purpleBadge: `oklch(18% 0.03 ${hue.aubergine})`,
  
  // Blue
  blue: `oklch(56% 0.16 256)`,
  blueAlpha1f: `oklch(56% 0.16 256)`,
  blueAlpha26: `oklch(56% 0.16 256)`,
  blueAlpha33: `oklch(56% 0.16 256)`,
  blueAlpha40: `oklch(56% 0.16 256)`,
  blueAlpha45: `oklch(56% 0.16 256)`,
  blueAlpha4c: `oklch(56% 0.16 256)`,
  blueAlpha54: `oklch(56% 0.16 256)`,
  darkBlue: `oklch(35% 0.14 256)`,
  darkBlueAlpha5c: `oklch(35% 0.14 256)`,
  
  // Cyan/Teal
  cyan: `oklch(65% 0.15 200)`,
  cyanAlpha26: `oklch(65% 0.15 200)`,
  cyanAlpha40: `oklch(65% 0.15 200)`,
  teal: `oklch(70% 0.13 192)`,
  tealAlpha1f: `oklch(70% 0.13 192)`,
  lightCyan: `oklch(78% 0.10 195)`,
  darkTeal: `oklch(42% 0.10 200)`,
  darkTealAlpha45: `oklch(42% 0.10 200)`,
  brightCyan: `oklch(82% 0.18 215)`,
  
  // Green
  green: `oklch(55% 0.18 142)`,
  greenAlpha1f: `oklch(55% 0.18 142)`,
  greenAlpha26: `oklch(55% 0.18 142)`,
  greenAlpha40: `oklch(55% 0.18 142)`,
  greenAlpha66: `oklch(55% 0.18 142)`,
  darkGreen: `oklch(38% 0.13 142)`,
  
  // Yellow/Orange
  yellow: `oklch(80% 0.15 88)`,
  yellowAlpha1f: `oklch(80% 0.15 88)`,
  orange: `oklch(63% 0.20 48)`,
  orangeAlpha87: `oklch(63% 0.20 48)`,
  orangeAlphaB0: `oklch(63% 0.20 48)`,
  orangeAlphaCc: `oklch(63% 0.20 48)`,
  darkOrange: `oklch(45% 0.15 48)`,
  
  // Red/Pink
  red: `oklch(58% 0.23 25)`,
  redAlpha21: `oklch(58% 0.23 25)`,
  redAlpha40: `oklch(58% 0.23 25)`,
  darkRed: `oklch(38% 0.18 25)`,
  pink: `oklch(68% 0.18 8)`,
  darkPink: `oklch(52% 0.15 8)`,
  
  // Special backgrounds
  redBg: `oklch(18% 0.08 25)`,
  orangeBg: `oklch(20% 0.10 48)`,
  shadowBlack: `oklch(0% 0 0)`,
} as const;

export type ColorToken = typeof color;
