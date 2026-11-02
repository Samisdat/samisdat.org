/**
 * Candidate values shown as extra rows under the ink chart in the snapshot (per mode).
 * Empty by default. Use for a draft that compares proposals with the current ink, e.g.
 * `dark: { ink: "ink.ruby", items: [{ label: "A", hex: "#ff7f67" }] }`.
 */
export const ALTERNATIVES: Record<
    'dark' | 'light',
    { ink: string; items: { label: string; hex: string }[] } | undefined
> = {
    dark: undefined,
    light: undefined,
};
