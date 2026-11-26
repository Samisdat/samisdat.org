import { describe, expect, it } from 'vitest';

import { HALF_CLOUD, litAt, litOfCloud, SUN_X } from '../cloudLight';

describe('litAt', () => {
    it('is 1 at the sun and falls with the distance', () => {
        expect(litAt(SUN_X.sunset, SUN_X.sunset)).toBe(1);
        expect(litAt(SUN_X.sunset + 200, SUN_X.sunset)).toBeLessThan(1);
        expect(litAt(SUN_X.sunset + 200, SUN_X.sunset)).toBeGreaterThan(litAt(SUN_X.sunset + 500, SUN_X.sunset));
    });

    it('is nearly 0 on the far side of the sky', () => {
        expect(litAt(SUN_X.sunrise, SUN_X.sunset)).toBeLessThan(0.1);
    });
});

describe('litOfCloud', () => {
    it('lights a cloud whose middle is at the sun fully', () => {
        expect(litOfCloud(SUN_X.sunset - HALF_CLOUD, SUN_X.sunset)).toBe(1);
    });

    it('gives a cloud on the other side of the sky little or no light', () => {
        expect(litOfCloud(SUN_X.sunrise - HALF_CLOUD, SUN_X.sunset)).toBeLessThan(0.1);
    });

    it('counts the copy one sky width to the left', () => {
        // A cloud far right has its copy near the sun at the left.
        expect(litOfCloud(SUN_X.sunrise - HALF_CLOUD + 1700, SUN_X.sunrise)).toBe(1);
    });

    it('rounds to steps, so a slow drift writes rarely', () => {
        const value = litOfCloud(900, SUN_X.sunset);

        expect(Math.round(value / 0.02) * 0.02).toBeCloseTo(value);
    });
});
