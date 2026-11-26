import { describe, expect, it } from 'vitest';

import { parseWeather, weatherForDay } from '../weather';

describe('weatherForDay', () => {
    it('gives a day the same weather every time', () => {
        const morning = new Date(2026, 10, 21, 8, 0);
        const evening = new Date(2026, 10, 21, 22, 30);

        expect(weatherForDay(morning)).toEqual(weatherForDay(evening));
    });

    it('only rains from a cloudy sky', () => {
        for (let day = 1; day <= 365; day += 1) {
            const { cover, rain } = weatherForDay(new Date(2026, 0, day));

            if ('none' !== rain) {
                expect(['cloudy', 'mostly', 'overcast']).toContain(cover);
            }
        }
    });

    it('uses every cover over a year', () => {
        const covers = new Set<string>();

        for (let day = 1; day <= 365; day += 1) {
            covers.add(weatherForDay(new Date(2026, 0, day)).cover);
        }

        expect([...covers].sort()).toEqual(['clear', 'cloudy', 'light', 'mostly', 'overcast']);
    });
});

describe('parseWeather', () => {
    it('reads a cover with and without rain', () => {
        expect(parseWeather('cloudy')).toEqual({ cover: 'cloudy', rain: 'none' });
        expect(parseWeather('overcast-heavy')).toEqual({ cover: 'overcast', rain: 'heavy' });
    });

    it('rejects anything else', () => {
        expect(parseWeather(null)).toBeNull();
        expect(parseWeather('stormy')).toBeNull();
        expect(parseWeather('mostly-hail')).toBeNull();
        expect(parseWeather('mostly-steady-more')).toBeNull();
    });
});
