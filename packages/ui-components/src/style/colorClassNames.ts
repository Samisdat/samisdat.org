import { themedColors } from "../tokens/themes";

export const colorClassNames = themedColors
  .map((name) => {
    return `div.color.${name} {
  background-color: var(--color-${name});
  color: contrast-color(var(--color-${name}))
}`;
  })
  .join("\n");
