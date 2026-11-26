/**
 * Weather data contract shared by the `/api/weather` route handler and its readers.
 *
 * Source: Open-Meteo "current" data (https://open-meteo.com, CC BY 4.0).
 * All numbers are finite; the route never answers with partial data.
 */

/** Where the weather is measured: Wuppertal. */
export const WEATHER_LOCATION = { name: 'Wuppertal', latitude: 51.2562, longitude: 7.1508 } as const;

/** Path of the route handler; readers request this, never Open-Meteo directly. */
export const WEATHER_ENDPOINT = '/api/weather';

/** Server-side cache lifetime in seconds. Visitors never reach Open-Meteo. */
export const WEATHER_REVALIDATE_SECONDS = 1800;

/**
 * Sky cover per altitude band, in percent (0 = clear, 100 = fully covered).
 * Open-Meteo bands: low up to 2 km, mid 2-6 km, high above 6 km.
 * Intended to drive one cloud layer per band.
 */
export interface CloudCover {
    /** Low clouds (stratus, cumulus), 0-100 %. */
    low: number;
    /** Mid-level clouds (altocumulus, altostratus), 0-100 %. */
    mid: number;
    /** High clouds (cirrus), 0-100 %. */
    high: number;
}

export interface Wind {
    /** Wind speed at 10 m, in km/h. */
    speed: number;
    /** Direction the wind comes from, in degrees (0 = north, 90 = east), 0-360. */
    direction: number;
}

export interface WeatherData {
    location: typeof WEATHER_LOCATION;
    /** ISO 8601 time of the observation, UTC (e.g. `2026-11-22T10:15:00Z`). */
    observedAt: string;
    /** Cloud cover per altitude band. */
    cloudCover: CloudCover;
    /** Precipitation (rain, showers, snow water equivalent) of the preceding hour, in mm. */
    precipitation: number;
    wind: Wind;
    /** WMO weather interpretation code (0 clear, 3 overcast, 61-65 rain, 95+ thunderstorm, ...). */
    weatherCode: number;
}

/** Body of a non-200 answer from the route. Readers treat any non-200 as "use the fallback". */
export interface WeatherError {
    error: string;
}
