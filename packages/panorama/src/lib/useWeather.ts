import { useEffect, useState } from 'react';

import { testParam } from './testParams';
import { CLEAR, dayKey, parseWeather, Weather, weatherForDay } from './weather';

/**
 * Weather of the simulated day. It starts clear and is set after mounting, because the server and the
 * browser do not agree on the day near midnight. `?weather=overcast-steady` overrides it for testing, and so
 * does the `forced` weather of a host page that offers its own picker.
 */
export const useWeather = (time: Date, forced?: Weather): Weather => {
    const [weather, setWeather] = useState<Weather>(CLEAR);
    const day = dayKey(time);

    useEffect(() => {
        const override = parseWeather(testParam('weather'));

        setWeather(override ?? weatherForDay(new Date(time)));
        // The weather changes with the day, not with every frame of the clock
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [day]);

    return forced ?? weather;
};
