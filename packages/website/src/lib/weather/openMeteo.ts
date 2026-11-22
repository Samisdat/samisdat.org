import { WEATHER_LOCATION, WEATHER_REVALIDATE_SECONDS, type WeatherData } from './contract';

const CURRENT_FIELDS = [
    'cloud_cover_low',
    'cloud_cover_mid',
    'cloud_cover_high',
    'precipitation',
    'wind_speed_10m',
    'wind_direction_10m',
    'weather_code',
] as const;

export const OPEN_METEO_URL =
    'https://api.open-meteo.com/v1/forecast' +
    `?latitude=${WEATHER_LOCATION.latitude}&longitude=${WEATHER_LOCATION.longitude}` +
    `&current=${CURRENT_FIELDS.join(',')}&wind_speed_unit=kmh&timezone=GMT`;

const TIMEOUT_MS = 5000;

const isRecord = (value: unknown): value is Record<string, unknown> => 'object' === typeof value && null !== value;

const num = (source: Record<string, unknown>, key: string): number => {
    const value = source[key];

    if ('number' !== typeof value || !Number.isFinite(value)) {
        throw new Error(`Open-Meteo: "${key}" is missing or not a number`);
    }

    return value;
};

/** Maps an Open-Meteo forecast response to the weather contract; throws when a field is missing. */
export const parseOpenMeteo = (json: unknown): WeatherData => {
    const current = isRecord(json) ? json.current : undefined;

    if (!isRecord(current) || 'string' !== typeof current.time) {
        throw new Error('Open-Meteo: response has no "current" block');
    }

    return {
        location: WEATHER_LOCATION,
        // timezone=GMT, so the bare local time is UTC
        observedAt: `${current.time}:00Z`,
        cloudCover: {
            low: num(current, 'cloud_cover_low'),
            mid: num(current, 'cloud_cover_mid'),
            high: num(current, 'cloud_cover_high'),
        },
        precipitation: num(current, 'precipitation'),
        wind: { speed: num(current, 'wind_speed_10m'), direction: num(current, 'wind_direction_10m') },
        weatherCode: num(current, 'weather_code'),
    };
};

/** Fetches current weather; Next's data cache keeps the upstream call to once per cache window. */
export const fetchWeather = async (fetchImpl: typeof fetch = fetch): Promise<WeatherData> => {
    const response = await fetchImpl(OPEN_METEO_URL, {
        next: { revalidate: WEATHER_REVALIDATE_SECONDS },
        signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) {
        throw new Error(`Open-Meteo answered ${response.status}`);
    }

    return parseOpenMeteo(await response.json());
};
