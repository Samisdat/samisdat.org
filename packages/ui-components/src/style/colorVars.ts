import { color } from "../tokens/color/derived";

export const colorVars = Object.entries(color)
  .map(
    ([mappedColor, value]) => `
--color-${mappedColor}: ${value};`,
  )
  .join("\n");
