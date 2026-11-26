import { afterEach, describe, expect, it, vi } from 'vitest';

import { GET } from '@/app/api/weather/route';

import { WEATHER_REVALIDATE_SECONDS } from '../contract';
import { OPEN_METEO_URL, parseOpenMeteo } from '../openMeteo';
import { readWeather } from '../readWeather';

const CURRENT = {
    time: '2026-11-22T10:15',
    cloud_cover_low: 80,
    cloud_cover_mid: 40,
    cloud_cover_high: 10,
    precipitation: 0.4,
    wind_speed_10m: 12.5,
    wind_direction_10m: 250,
    weather_code: 61,
};

const upstream = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

describe('parseOpenMeteo', () => {
    it('maps the current block to the contract', () => {
        expect(parseOpenMeteo({ current: CURRENT })).toEqual({
            location: { name: 'Wuppertal', latitude: 51.2562, longitude: 7.1508 },
            observedAt: '2026-11-22T10:15:00Z',
            cloudCover: { low: 80, mid: 40, high: 10 },
            precipitation: 0.4,
            wind: { speed: 12.5, direction: 250 },
            weatherCode: 61,
        });
    });

    it('rejects missing blocks and fields', () => {
        expect(() => parseOpenMeteo({})).toThrow('current');
        expect(() => parseOpenMeteo({ current: { ...CURRENT, cloud_cover_mid: undefined } })).toThrow(
            'cloud_cover_mid'
        );
        expect(() => parseOpenMeteo({ current: { ...CURRENT, weather_code: 'x' } })).toThrow('weather_code');
    });
});

describe('GET /api/weather', () => {
    it('requests Open-Meteo with the cache window and answers with cache headers', async () => {
        const fetchMock = vi.fn().mockResolvedValue(upstream({ current: CURRENT }));
        vi.stubGlobal('fetch', fetchMock);

        const response = await GET();
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(response.headers.get('Cache-Control')).toContain(`s-maxage=${WEATHER_REVALIDATE_SECONDS}`);
        expect(body.cloudCover).toEqual({ low: 80, mid: 40, high: 10 });
        expect(fetchMock).toHaveBeenCalledWith(
            OPEN_METEO_URL,
            expect.objectContaining({ next: { revalidate: WEATHER_REVALIDATE_SECONDS } })
        );
        expect(OPEN_METEO_URL).toContain('cloud_cover_low,cloud_cover_mid,cloud_cover_high');
    });

    it.each([
        ['upstream status', () => Promise.resolve(upstream({}, 500))],
        ['network error', () => Promise.reject(new Error('offline'))],
        ['malformed body', () => Promise.resolve(upstream({ current: { time: 'x' } }))],
        ['invalid JSON', () => Promise.resolve(new Response('<html>', { status: 200 }))],
    ])('answers 502 on %s', async (_name, impl) => {
        vi.stubGlobal('fetch', vi.fn(impl));
        vi.spyOn(console, 'error').mockImplementation(() => {});

        const response = await GET();

        expect(response.status).toBe(502);
        expect(await response.json()).toEqual({ error: 'Weather data unavailable' });
    });
});

describe('readWeather', () => {
    it('returns the live weather', async () => {
        const weather = parseOpenMeteo({ current: CURRENT });
        const reading = await readWeather(vi.fn().mockResolvedValue(Response.json(weather)));

        expect(reading).toEqual({ source: 'live', weather });
    });

    it.each([
        ['non-200', () => Promise.resolve(Response.json({ error: 'x' }, { status: 502 }))],
        ['network error', () => Promise.reject(new Error('offline'))],
        ['malformed body', () => Promise.resolve(Response.json({ foo: 1 }))],
        ['null body', () => Promise.resolve(Response.json(null))],
    ])('falls back on %s', async (_name, impl) => {
        expect(await readWeather(vi.fn(impl))).toEqual({ source: 'fallback' });
    });
});
