'use client';

import { Segmented } from '@samisdat/ui-components/Segmented';
import { COVERS, RAINS, type Cover, type Rain, type Weather, WtalPanorama } from '@samisdat/wtal-panorama';
import { useEffect, useState, useSyncExternalStore } from 'react';

import { useStars } from '@/lib/useStars';
import { readWeather } from '@/lib/weather/readWeather';
import { weatherOfReading } from '@/lib/weather/toPanoramaWeather';

type CoverChoice = Cover | 'auto';

const COVER_LABELS: Record<Cover, string> = {
    clear: 'Klar',
    light: 'Leicht',
    cloudy: 'Wolkig',
    mostly: 'Meist bewölkt',
    overcast: 'Bedeckt',
};
const RAIN_LABELS: Record<Rain, string> = { none: 'Kein Regen', light: 'Leicht', steady: 'Stetig', heavy: 'Stark' };

const COVER_OPTIONS = [
    { value: 'auto' as CoverChoice, label: 'Tageswetter' },
    ...COVERS.map(cover => ({ value: cover as CoverChoice, label: COVER_LABELS[cover] })),
];
/** The measured weather, or `undefined` while loading, on a fallback, and when `?weather=` overrides it. */
const useLiveWeather = (): Weather | undefined => {
    const [live, setLive] = useState<Weather>();

    useEffect(() => {
        if (new URLSearchParams(window.location.search).has('weather')) {
            return;
        }

        const controller = new AbortController();

        void readWeather(fetch, controller.signal).then((reading) => {
            if (!controller.signal.aborted) {
                setLive(weatherOfReading(reading));
            }
        });

        return () => controller.abort();
    }, []);

    return live;
};

const RAIN_OPTIONS = RAINS.map(rain => ({ value: rain, label: RAIN_LABELS[rain] }));

/** Shown while developing, or on any page with `?weather-picker`. */
const subscribeNothing = () => () => {};
const pickerEnabled = () =>
    'production' !== process.env.NODE_ENV || new URLSearchParams(window.location.search).has('weather-picker');

const usePickerEnabled = () => useSyncExternalStore(subscribeNothing, pickerEnabled, () => false);

/** The panorama, with segments underneath to switch through every cover and rain. */
export const PanoramaWeather = () => {
    const enabled = usePickerEnabled();
    const live = useLiveWeather();
    const stars = useStars();
    const [cover, setCover] = useState<CoverChoice>('auto');
    const [rain, setRain] = useState<Rain>('none');

    return (
        <>
            <WtalPanorama
                weather={enabled && 'auto' !== cover ? { cover, rain } : live}
                stars={stars}
                generatedClouds={'development' === process.env.NODE_ENV}
            />
            {enabled && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1rem', padding: '0.5rem 1rem' }}>
                    <Segmented
                        label="Bewölkung"
                        value={cover}
                        options={COVER_OPTIONS}
                        onChange={setCover}
                    />
                    <Segmented
                        label="Regen"
                        value={rain}
                        options={RAIN_OPTIONS}
                        onChange={setRain}
                    />
                </div>
            )}
        </>
    );
};
