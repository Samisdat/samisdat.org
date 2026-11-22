import { describe, expect, it } from 'vitest';

import type { WeatherData } from '../contract';
import { coverOf, rainOf, toPanoramaWeather, weatherOfReading } from '../toPanoramaWeather';

const data = (cloudCover: WeatherData['cloudCover'], precipitation = 0): WeatherData => ({
    location: { name: 'Wuppertal', latitude: 51.2562, longitude: 7.1508 },
    observedAt: '2026-11-22T10:15:00Z',
    cloudCover,
    precipitation,
    wind: { speed: 10, direction: 200 },
    weatherCode: 3,
});

describe('toPanoramaWeather', () => {
    it('turns each band into eighths', () => {
        expect(toPanoramaWeather(data({ low: 80, mid: 40, high: 10 })).sky).toEqual({ low: 6, mid: 3, high: 1 });
    });

    it('derives the whole-sky cover from all bands', () => {
        expect(toPanoramaWeather(data({ low: 0, mid: 0, high: 0 })).cover).toBe('clear');
        expect(toPanoramaWeather(data({ low: 100, mid: 0, high: 0 })).cover).toBe('overcast');
        expect(toPanoramaWeather(data({ low: 20, mid: 20, high: 20 })).cover).toBe('cloudy');
    });

    it('takes rain from the precipitation', () => {
        expect(toPanoramaWeather(data({ low: 90, mid: 90, high: 90 }, 3)).rain).toBe('steady');
    });
});

describe('coverOf and rainOf', () => {
    it('cut at the documented limits', () => {
        expect([9.9, 10, 29.9, 30, 54.9, 55, 79.9, 80].map(coverOf)).toEqual([
            'clear', 'light', 'light', 'cloudy', 'cloudy', 'mostly', 'mostly', 'overcast',
        ]);
        expect([0, 0.05, 0.1, 2.4, 2.5, 7.5, 7.6, Number.NaN].map(rainOf)).toEqual([
            'none', 'none', 'light', 'light', 'steady', 'steady', 'heavy', 'none',
        ]);
    });
});

describe('weatherOfReading', () => {
    it('uses live data and leaves a fallback to the date-seeded weather', () => {
        const weather = data({ low: 10, mid: 10, high: 10 });

        expect(weatherOfReading({ source: 'live', weather })).toEqual(toPanoramaWeather(weather));
        expect(weatherOfReading({ source: 'fallback' })).toBeUndefined();
    });
});
