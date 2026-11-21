/** Number of positions on the speed ring, 0 is normal time. */
export const SPEED_STEPS = 100;

const MAX_EXPONENT = 3.2;

/**
 * Time factor for a position on the ring. Position 0 is normal time; from position 1 the factor grows
 * exponentially from 2 to about 3170 (roughly 53 minutes per second), so normal speed is easy to hit.
 */
export const factorAt = (step: number): number => {
    const clamped = Math.max(0, Math.min(SPEED_STEPS, Math.round(step)));

    if (0 === clamped) {
        return 1;
    }

    return Math.round(2 * 10 ** (((clamped - 1) / (SPEED_STEPS - 1)) * MAX_EXPONENT));
};

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
