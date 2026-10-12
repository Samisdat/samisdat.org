import { formatHex } from "culori";

const component = (value: number | "none" | null) =>
  value === "none" || value === null ? 0 : value;

export const toHex = (value: { components: (number | "none" | null)[] }) => {
  const [l, c, h] = value.components.map(component);
  const hex = formatHex(`oklch(${l} ${c} ${h})`);
  if (!hex) throw new Error(`cannot convert oklch(${l} ${c} ${h}) to hex`);
  return hex;
};
