/** Small seeded generator (mulberry32), so drawings and layouts are the same on every render. */
export const random = (seed: number) => () => {
    let t = (seed += 0x6d2b79f5);

    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
