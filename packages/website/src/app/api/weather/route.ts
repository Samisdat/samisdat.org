import { WEATHER_REVALIDATE_SECONDS, type WeatherError } from '@/lib/weather/contract';
import { fetchWeather } from '@/lib/weather/openMeteo';

// Upstream calls are cached by fetch (`next.revalidate`); the CDN header keeps visitors off the function too.
export const dynamic = 'force-dynamic';

const CACHE_OK = `public, s-maxage=${WEATHER_REVALIDATE_SECONDS}, stale-while-revalidate=${WEATHER_REVALIDATE_SECONDS}`;

export async function GET(): Promise<Response> {
    try {
        return Response.json(await fetchWeather(), { headers: { 'Cache-Control': CACHE_OK } });
    } catch (error) {
        console.error('weather route failed', error);

        const body: WeatherError = { error: 'Weather data unavailable' };

        // Short cache so a failing upstream is not hammered, but recovers quickly
        return Response.json(body, { status: 502, headers: { 'Cache-Control': 'public, s-maxage=60' } });
    }
}
