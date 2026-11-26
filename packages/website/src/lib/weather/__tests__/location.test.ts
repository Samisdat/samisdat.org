import { LAT, LNG } from '@samisdat/wtal-panorama';
import { describe, expect, it } from 'vitest';

import { WEATHER_LOCATION } from '../contract';

describe('WEATHER_LOCATION', () => {
    // The route handler cannot import the coordinates from the panorama: its entry is a client module.
    it('measures the weather where the panorama draws the sky', () => {
        expect(WEATHER_LOCATION.latitude).toBe(LAT);
        expect(WEATHER_LOCATION.longitude).toBe(LNG);
    });
});
