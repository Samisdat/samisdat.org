import { describe, expect, it } from 'vitest';

import { getSkyState } from '../skyModel';
import { seasonFromArcHeight, skyPalette } from '../skyPalette';

const channels = (value: string) => [1, 3, 5].map(i => parseInt(value.slice(i, i + 2), 16));
const luma = (value: string) => {
    const [r, g, b] = channels(value);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
/** Red share of the colour: higher means redder, lower (towards orange/yellow) means yellower. */
const redness = (value: string) => {
    const [r, g, b] = channels(value);
    return r / (r + g + b);
};

describe('skyPalette', () => {
    it('is the plain day sky with high sun', () => {
        const day = skyPalette(45);
        expect(day.zenith).toBe('#0376bf');
        expect(day.horizon).toBe('#a8d0f5');
        expect(day.glow).toBe(0);
        expect(day.stars).toBe(0);
        expect(day.night).toBe(0);
        expect(day.sunScale).toBe(1);
    });

    it('is dark with no glow and all stars after astronomical twilight', () => {
        const night = skyPalette(-40);
        expect(night.stars).toBe(1);
        expect(night.glow).toBe(0);
        expect(night.night).toBe(1);
        expect(luma(night.zenith)).toBeLessThan(20);
    });

    it('darkens the zenith monotonically as the sun sinks', () => {
        let previous = Infinity;
        for (let altitude = 30; altitude >= -25; altitude -= 0.5) {
            const value = luma(skyPalette(altitude).zenith);
            expect(value).toBeLessThanOrEqual(previous + 1);
            previous = value;
        }
    });

    it('lets the stars fade in monotonically with darkness', () => {
        let previous = -1;
        for (let altitude = 10; altitude >= -25; altitude -= 0.5) {
            const { stars } = skyPalette(altitude);
            expect(stars).toBeGreaterThanOrEqual(previous);
            previous = stars;
        }
        expect(skyPalette(2).stars).toBe(0);
        expect(skyPalette(-6).stars).toBeGreaterThan(0);
        expect(skyPalette(-6).stars).toBeLessThan(1);
    });

    it('makes the sun bigger and redder towards the horizon', () => {
        const high = skyPalette(40);
        const low = skyPalette(0);
        expect(low.sunScale).toBeGreaterThan(high.sunScale);
        expect(redness(low.sun)).toBeGreaterThan(redness(high.sun));
    });

    it('lights the cloud undersides most at the horizon', () => {
        const peak = skyPalette(-0.833).glow;
        expect(peak).toBe(1);
        expect(skyPalette(30).glow).toBe(0);
        expect(skyPalette(-14).glow).toBeLessThan(0.1);
        expect(skyPalette(-0.833).cloudLight).not.toBe(skyPalette(30).cloudLight);
    });

    it('hits the keyframes exactly on the twilight thresholds', () => {
        expect(skyPalette(-6).stars).toBeCloseTo(0.6);
        expect(skyPalette(-12).stars).toBeCloseTo(0.9);
        expect(skyPalette(-18).stars).toBe(1);
    });

    it('is continuous', () => {
        for (let altitude = 25; altitude > -25; altitude -= 0.1) {
            const a = channels(skyPalette(altitude).glowBand);
            const b = channels(skyPalette(altitude - 0.1).glowBand);
            a.forEach((channel, index) => expect(Math.abs(channel - b[index])).toBeLessThan(12));
        }
    });

    it('does not change the high-sun sky with the season', () => {
        expect(skyPalette(40, -1)).toEqual(skyPalette(40, 1));
    });

    it('colours winter and summer sunsets differently', () => {
        const winter = skyPalette(-0.833, -1);
        const summer = skyPalette(-0.833, 1);
        expect(winter.glowBand).not.toBe(summer.glowBand);
        expect(redness(winter.sun)).toBeGreaterThan(redness(summer.sun));
        expect(redness(winter.cloudLight)).toBeGreaterThan(redness(summer.cloudLight));
    });

    it('clamps the season', () => {
        expect(skyPalette(0, 5)).toEqual(skyPalette(0, 1));
        expect(skyPalette(0, -5)).toEqual(skyPalette(0, -1));
    });
});

describe('seasonFromArcHeight', () => {
    it('maps the arc height range to -1..1', () => {
        expect(seasonFromArcHeight(0.7)).toBeCloseTo(-1);
        expect(seasonFromArcHeight(1)).toBe(0);
        expect(seasonFromArcHeight(1.3)).toBeCloseTo(1);
    });
});

describe('with the sky model', () => {
    // Wuppertal solstices.
    const winterSunset = getSkyState(new Date('2024-12-21T15:30:00Z'));
    const summerSunset = getSkyState(new Date('2024-06-21T20:10:00Z'));

    it('takes the season from the arc height factor', () => {
        expect(seasonFromArcHeight(winterSunset.arcHeightFactor)).toBeLessThan(-0.9);
        expect(seasonFromArcHeight(summerSunset.arcHeightFactor)).toBeGreaterThan(0.9);
    });

    it('is still twilight in summer at the same sun altitude, with a different look', () => {
        const winter = skyPalette(-3, seasonFromArcHeight(winterSunset.arcHeightFactor));
        const summer = skyPalette(-3, seasonFromArcHeight(summerSunset.arcHeightFactor));
        expect(winter.glowBand).not.toBe(summer.glowBand);
    });

    it('never gets fully dark at midsummer midnight', () => {
        const midnight = getSkyState(new Date('2024-06-21T22:30:00Z'));
        expect(midnight.sunAltitudeDeg).toBeGreaterThan(-18);
        expect(skyPalette(midnight.sunAltitudeDeg).stars).toBeLessThan(1);
    });
});
