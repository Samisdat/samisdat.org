/**
 * Candidate values shown as extra rows under the ink chart in the snapshot (per mode).
 * Empty by default. Use for a draft that compares proposals with the current ink, e.g.
 * `dark: { ink: "ink.red", items: [{ label: "A", hex: "#ff7f67" }] }`.
 */
export const ALTERNATIVES: Record<"dark" | "light", { ink: string; items: { label: string; hex: string }[] } | undefined> = {
  dark: {
    ink: "ink.red",
    items: [
      { label: "L 0,750 · C 0,150", hex: "#fe8770" },
      { label: "L 0,755 · C 0,146", hex: "#fe8a73" },
      { label: "L 0,765 · C 0,140", hex: "#ff8f79" },
    ],
  },
  light: undefined,
};
