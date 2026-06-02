import { formatHex, parse } from "culori";
import { color } from "./color";

/**
 * Converts a color token from OKLCH to Hex format
 * @param colorValue - The OKLCH color string
 * @returns Hex color string or the original value if parsing fails
 */
function colorTokenToHex(colorValue: string): string {
  if (!colorValue || !colorValue.startsWith("oklch")) {
    return colorValue;
  }

  try {
    const parsed = parse(colorValue);
    if (!parsed) {
      return colorValue;
    }
    return formatHex(parsed);
  } catch {
    console.warn(`Failed to convert color "${colorValue}" to hex`);
    return colorValue;
  }
}

/**
 * Converts all color tokens to Hex format
 * @returns Object with all color values as Hex strings
 */
export function getColorHexMap(): Record<string, string> {
  const hexMap: Record<string, string> = {};

  for (const [key, value] of Object.entries(color)) {
    hexMap[key] = colorTokenToHex(value);
  }

  return hexMap;
}

// Export individual color as hex
export function colorToHex(colorToken: string): string {
  return colorTokenToHex(colorToken);
}
