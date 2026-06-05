import { color } from "../tokens/color/derived";

// Generate CSS class rules for color display
export const colorClassNames = Object.entries(color)
  .map(([name, value]) => {
    return `div.color.${name} {
  background-color: ${value};
}`;
  })
  .join("\n");
