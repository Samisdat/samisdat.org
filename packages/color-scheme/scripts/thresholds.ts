/**
 * Distinguishability thresholds per mode (ΔE OK, OKLab, Euclidean).
 *
 * Dark keeps 0.08 / 0.04. Light is lower because inks on a light ground have a
 * narrow lightness band (AA already needs L <= ~0.52); the values sit at the
 * weaker end of the light themes measured by `compare:themes` (min accent ΔE
 * 0.053-0.099, min CVD 0.010-0.049). See README, "Unterscheidbarkeit der Inks".
 */
import type { Mode } from "../src/contrast";

export const MIN_INK_DELTA_E: Record<Mode, number> = { dark: 0.08, light: 0.05 };
export const MIN_CVD_DELTA_E: Record<Mode, number> = { dark: 0.04, light: 0.02 };

/**
 * Fill distinguishability (ΔE OK to `syntax.background` and `surface.default`).
 * Light `highlight` is lighter than the other fills: it carries `textTier: ink`
 * (every ink >= 4.5:1), and a fill that light cannot get further from the grounds
 * than ~0.05 (gate 0.045). `selection` stays strong, it is transient.
 */
export const MIN_FILL_DELTA_E: Record<Mode, { highlight: number; selection: number }> = {
  dark: { highlight: 0.1, selection: 0.1 },
  light: { highlight: 0.045, selection: 0.1 },
};

/**
 * nvim fills (dark only): `nvim.cursorline` and `nvim.visual` against the two
 * grounds like the other fills, and against each other. `between` matches the
 * dark ink gate; blue.900 vs purple.900 differ mostly in hue (0.086).
 */
export const MIN_NVIM_FILL_DELTA_E = { ground: 0.1, between: 0.08 };
