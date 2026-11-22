import { WEATHER_ENDPOINT, type WeatherData } from './contract';

export type WeatherReading = { source: 'live'; weather: WeatherData } | { source: 'fallback' };

const isWeatherData = (value: unknown): value is WeatherData => {
    const data = value as Partial<WeatherData> | null;

    return (
        'object' === typeof data &&
        null !== data &&
        'number' === typeof data.weatherCode &&
        'number' === typeof data.cloudCover?.low &&
        'number' === typeof data.cloudCover.mid &&
        'number' === typeof data.cloudCover.high &&
        'number' === typeof data.precipitation &&
        'number' === typeof data.wind?.speed &&
        'number' === typeof data.wind.direction
    );
};

/**
 * Client-side reader of the weather route. Never throws: on a network error, a non-200
 * answer or a malformed body it answers `{ source: 'fallback' }`, and the caller keeps
 * using the date-seeded weather.
 */
export const readWeather = async (fetchImpl: typeof fetch = fetch, signal?: AbortSignal): Promise<WeatherReading> => {
    try {
        const response = await fetchImpl(WEATHER_ENDPOINT, { signal });

        if (!response.ok) {
            return { source: 'fallback' };
        }

        const body: unknown = await response.json();

        return isWeatherData(body) ? { source: 'live', weather: body } : { source: 'fallback' };
    } catch {
        return { source: 'fallback' };
    }
};
