import { primitiveColors } from "../tokens/color/primitives";

// Generate CSS @property rules for primitive colors
export const colorProperties = Object.entries(primitiveColors)
  .map(([name, value]) => {
    return `@property --primitive-${name} {
  syntax: "<color>";
  inherits: true;
  initial-value: ${value};
}`;
  })
  .join("\n");
