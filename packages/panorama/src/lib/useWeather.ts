import { useEffect, useState } from 'react';

import { CLEAR, dayKey, parseWeather, Weather, weatherForDay } from './weather';

/**
 * Weather of the simulated day. It starts clear and is set after mounting, because the server and the
 * browser do not agree on the day near midnight. `?weather=overcast-steady` overrides it for testing.
 */
export const useWeather = (time: Date): Weather => {
    const [weather, setWeather] = useState<Weather>(CLEAR);
    const day = dayKey(time);

    useEffect(() => {
        const override = parseWeather(new URLSearchParams(window.location.search).get('weather'));

        setWeather(override ?? weatherForDay(new Date(time)));
        // The weather changes with the day, not with every frame of the clock
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [day]);

    return weather;
};
