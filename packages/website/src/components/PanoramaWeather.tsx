'use client';

import { faCloud as faCloudOutline } from '@fortawesome/free-regular-svg-icons';
import {
    faBan,
    faCloud,
    faCloudBolt,
    faCloudRain,
    faCloudShowersHeavy,
    faCloudSun,
    faSmog,
    faSun,
    type IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Segmented } from '@samisdat/ui-components/Segmented';
import { COVERS, RAINS, type Cover, type Rain, type Weather, WtalPanorama } from '@samisdat/wtal-panorama';
import { useEffect, useState, useSyncExternalStore } from 'react';

import { useStars } from '@/lib/useStars';
import { readWeather } from '@/lib/weather/readWeather';
import { weatherOfReading } from '@/lib/weather/toPanoramaWeather';

import { SkyJumpSegments } from './SkyJumpSegments';

type CoverChoice = Cover | 'auto';

const COVER_LABELS: Record<Cover, string> = {
    clear: 'Klar',
    light: 'Leicht',
    cloudy: 'Wolkig',
    mostly: 'Meist bewölkt',
    overcast: 'Bedeckt',
};
const RAIN_LABELS: Record<Rain, string> = { none: 'Kein Regen', light: 'Leicht', steady: 'Stetig', heavy: 'Stark' };

const COVER_ICONS: Record<Cover, IconDefinition> = {
    clear: faSun,
    light: faCloudSun,
    cloudy: faCloudOutline,
    mostly: faCloud,
    overcast: faSmog,
};
const RAIN_ICONS: Record<Rain, IconDefinition> = {
    none: faBan,
    light: faCloudRain,
    steady: faCloudShowersHeavy,
    heavy: faCloudBolt,
};

const COVER_OPTIONS = COVERS.map(cover => ({
    value: cover as CoverChoice,
    label: COVER_LABELS[cover],
    icon: <FontAwesomeIcon icon={COVER_ICONS[cover]} />,
}));
/** The measured weather, or `undefined` while loading, on a fallback, and when `?weather=` overrides it. */
const useLiveWeather = (): Weather | undefined => {
    const [live, setLive] = useState<Weather>();

    useEffect(() => {
        if (new URLSearchParams(window.location.search).has('weather')) {
            return;
        }

        const controller = new AbortController();

        void readWeather(fetch, controller.signal).then(reading => {
            if (!controller.signal.aborted) {
                setLive(weatherOfReading(reading));
            }
        });

        return () => controller.abort();
    }, []);

    return live;
};

const RAIN_OPTIONS = RAINS.map(rain => ({
    value: rain,
    label: RAIN_LABELS[rain],
    icon: <FontAwesomeIcon icon={RAIN_ICONS[rain]} />,
}));

/** Shown while developing, or on any page with `?weather-picker`. */
const subscribeNothing = () => () => {};
const pickerEnabled = () =>
    'production' !== process.env.NODE_ENV || new URLSearchParams(window.location.search).has('weather-picker');

const usePickerEnabled = () => useSyncExternalStore(subscribeNothing, pickerEnabled, () => false);

/** The panorama; its time control overlay carries segments to switch through every cover and rain. */
export const PanoramaWeather = () => {
    const enabled = usePickerEnabled();
    const live = useLiveWeather();
    const stars = useStars();
    const [cover, setCover] = useState<CoverChoice>('auto');
    const [rain, setRain] = useState<Rain>('none');

    // Rain falls from clouds: with a clear sky (or the measured weather) it would not show, so the cover goes to overcast.
    const chooseRain = (next: Rain) => {
        setRain(next);

        if ('none' !== next && ('clear' === cover || 'auto' === cover)) {
            setCover('overcast');
        }
    };

    return (
        <WtalPanorama
            weather={enabled && 'auto' !== cover ? { cover, rain } : live}
            stars={stars}
            controls={
                enabled && (
                    <>
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
                            onChange={chooseRain}
                        />
                        <SkyJumpSegments />
                    </>
                )
            }
        />
    );
};
