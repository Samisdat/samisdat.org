import type { Cover } from '../weather';

/** Sky cover in eighths (oktas): 0 is clear, 8 is fully covered. */
export type Oktas = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/** Cover of the three altitude bands, in eighths. */
export interface Sky {
    /** Above ~6 km: cirrus, cirrocumulus. */
    high: Oktas;
    /** ~2-6 km: altocumulus. */
    mid: Oktas;
    /** Up to ~2 km: cumulus, stratocumulus. */
    low: Oktas;
}

export type SkyBand = keyof Sky;

/**
 * Percent (0-100) to eighths. Anything that is not a number counts as clear. A trace of cloud
 * (under 2 %) stays clear and a nearly closed sky (98 % and more) is fully covered; in between
 * every band shows at least one and at most seven eighths.
 */
export const percentToOktas = (percent: number): Oktas => {
    if (!Number.isFinite(percent) || percent < 2) {
        return 0;
    }

    if (percent >= 98) {
        return 8;
    }

    return Math.min(7, Math.max(1, Math.round(percent / 12.5))) as Oktas;
};

/** Open-Meteo style cover per band, percent in, eighths out. */
export const skyFromPercent = ({ low, mid, high }: { low: number; mid: number; high: number }): Sky => ({
    high: percentToOktas(high),
    mid: percentToOktas(mid),
    low: percentToOktas(low),
});

/** The layers that belong to a whole-sky cover, for weather that has no per-band data. */
const COVER_SKY: Record<Cover, Sky> = {
    clear: { high: 0, mid: 0, low: 1 },
    light: { high: 1, mid: 0, low: 2 },
    cloudy: { high: 2, mid: 2, low: 3 },
    mostly: { high: 3, mid: 5, low: 5 },
    overcast: { high: 4, mid: 7, low: 8 },
};

export const skyFromCover = (cover: Cover): Sky => COVER_SKY[cover];
