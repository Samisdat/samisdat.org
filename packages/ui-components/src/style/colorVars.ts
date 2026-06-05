import { color } from "../tokens/color/derived";

export const colorVars = Object.keys(color)
  .map(
    (mappedColor) => `
--color-${mappedColor}: ${color[mappedColor]};`,
  )
  .join("\n");
