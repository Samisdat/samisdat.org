export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const mod = (a: number, b: number) => ((a % b) + b) % b;

// angle = from + frac · (to − from) with from = 0°, to = 360°
export const angleAt = (t: number, begin: number, dur: number) => (mod(t - begin, dur) / dur) * 360;
