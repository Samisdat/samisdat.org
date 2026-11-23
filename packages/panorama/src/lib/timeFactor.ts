/** Time factors of the speed slider: normal time, then up to one hour per second. */
export const FACTORS = [1, 2, 5, 10, 30, 60, 120, 300, 600, 1800, 3600] as const;

/** Highest slider position, 0 is normal time. */
export const SPEED_STEPS = FACTORS.length - 1;

/** Time factor for a slider position. Fixed stops instead of a continuous scale, so every stop makes a visible difference. */
export const factorAt = (step: number): number => FACTORS[Math.max(0, Math.min(SPEED_STEPS, Math.round(step)))];

/** Slider position of a time factor; a factor between two stops snaps to the lower one. */
export const stepOf = (factor: number): number => {
    const index = FACTORS.findLastIndex(candidate => candidate <= factor);

    return Math.max(0, index);
};

/** What one second on the clock corresponds to, e.g. `1 s = 5 min im Panorama`. */
export const formatEquivalence = (factor: number): string => {
    if (1 === factor) {
        return '1 s im Panorama = 1 s';
    }

    if (factor < 60) {
        return `1 s = ${factor} s im Panorama`;
    }

    if (factor < 3600) {
        return `1 s = ${factor / 60} min im Panorama`;
    }

    return `1 s = ${factor / 3600} h im Panorama`;
};
