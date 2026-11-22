/** Time factors the ring snaps to: normal time, then roughly 10 s, 1 min, 5 min, 15 min, 30 min, 1 h and 2 h per second. */
const FACTORS = [1, 10, 60, 300, 900, 1800, 3600, 7200];

/** Highest position on the speed ring, 0 is normal time. */
export const SPEED_STEPS = FACTORS.length - 1;

/** Time factor for a position on the ring. Fixed stops instead of a continuous scale, so every stop makes a visible difference. */
export const factorAt = (step: number): number => FACTORS[Math.max(0, Math.min(SPEED_STEPS, Math.round(step)))];

export const formatFactor = (factor: number): string => (1 === factor ? 'Normal' : `×${factor}`);

const decimal = (value: number, digits: number): string => value.toFixed(digits).replace('.', ',');

/** What one second on the clock corresponds to, e.g. `1 s = 2,5 min`. */
export const formatEquivalence = (factor: number): string => {
    if (factor < 60) {
        return `1 s = ${factor} s`;
    }

    if (factor < 3600) {
        return `1 s = ${decimal(factor / 60, factor < 600 ? 1 : 0)} min`;
    }

    return `1 s = ${decimal(factor / 3600, 1)} h`;
};
