import { SKY_WIDTH } from './cloudLayout';

/** Where the sun rises and sets on the horizon, in sky units; the glow and the light on the clouds sit here. */
export const SUN_X = { sunrise: 455, sunset: 1248 };

/** How far from that place a cloud still catches the low sun, in sky units; beyond it the light fades out. */
const REACH = 450;

/** Average half width of a cloud: its frame starts at its left edge, the light falls on its middle. */
export const HALF_CLOUD = 150;

/** Steps the weight is rounded to, so it is written only when it has changed visibly. */
const STEP = 0.02;

/** 1 where the sun is, falling softly to 0 with the distance. */
export const litAt = (x: number, sunX: number): number => Math.exp(-(((x - sunX) / REACH) ** 2));

/**
 * How much of the low sunlight a cloud with its frame at `x` catches. The cloud is drawn again one sky width to the
 * left, so the nearer of the two counts.
 */
export const litOfCloud = (x: number, sunX: number): number => {
    const middle = x + HALF_CLOUD;
    const lit = Math.max(litAt(middle, sunX), litAt(middle - SKY_WIDTH, sunX));

    return Number((Math.round(lit / STEP) * STEP).toFixed(2));
};
