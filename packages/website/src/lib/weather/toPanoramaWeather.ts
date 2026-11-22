import { type Cover, type Rain, skyFromPercent, type Weather } from '@samisdat/wtal-panorama';

import type { WeatherData } from './contract';
import type { WeatherReading } from './readWeather';

/** Whole-sky cover in percent, from the three bands: each band hides what is left of the sky behind it. */
const totalCover = ({ low, mid, high }: WeatherData['cloudCover']): number => {
    const open = [low, mid, high].reduce((rest, percent) => rest * (1 - Math.min(100, Math.max(0, percent)) / 100), 1);

    return (1 - open) * 100;
};

/** Cover class by total percent: clear under 10 %, light under 30 %, cloudy under 55 %, mostly under 80 %. */
export const coverOf = (percent: number): Cover => {
    if (percent < 10) {
        return 'clear';
    }

    if (percent < 30) {
        return 'light';
    }

    if (percent < 55) {
        return 'cloudy';
    }

    return percent < 80 ? 'mostly' : 'overcast';
};

/** Rain class by mm in the preceding hour: dry under 0.1, light under 2.5, steady under 7.6, heavy from there. */
export const rainOf = (millimetres: number): Rain => {
    if (!(millimetres >= 0.1)) {
        return 'none';
    }

    if (millimetres < 2.5) {
        return 'light';
    }

    return millimetres < 7.6 ? 'steady' : 'heavy';
};

/** The weather the panorama draws, from the measured data. */
export const toPanoramaWeather = ({ cloudCover, precipitation }: WeatherData): Weather => ({
    cover: coverOf(totalCover(cloudCover)),
    rain: rainOf(precipitation),
    sky: skyFromPercent(cloudCover),
});

/** `undefined` for a fallback reading: the panorama then keeps the weather seeded by the date. */
export const weatherOfReading = (reading: WeatherReading): Weather | undefined =>
    'live' === reading.source ? toPanoramaWeather(reading.weather) : undefined;
