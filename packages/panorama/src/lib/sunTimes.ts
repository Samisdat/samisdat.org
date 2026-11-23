import * as SunCalc from 'suncalc';

const LAT = 51.2562;
const LNG = 7.1508;

export interface SunTimes {
    sunrise: number;
    sunset: number;
    dawn: number;
    dusk: number;
    currentTime: number;
    isDay: boolean;
    skyOpacity: number;
    windowOpacity: number;
}

type Boundaries = Pick<SunTimes, 'sunrise' | 'sunset' | 'dawn' | 'dusk'>;

const boundariesOf = (time: Date): Boundaries => {
    const times = SunCalc.getTimes(time, LAT, LNG);
    // At Wuppertal latitude (51°N), sun always rises/sets, but handle null for safety
    return {
        sunrise: times.sunrise?.getTime() ?? new Date(time).setHours(6, 0, 0, 0),
        sunset: times.sunset?.getTime() ?? new Date(time).setHours(18, 0, 0, 0),
        dawn: times.dawn?.getTime() ?? new Date(time).setHours(5, 0, 0, 0),
        dusk: times.dusk?.getTime() ?? new Date(time).setHours(19, 0, 0, 0),
    };
};

const skyOpacityAt = (now: number, { sunrise, sunset, dawn, dusk }: Boundaries): number => {
    if (now < dawn) return 1;
    if (now < sunrise) return 1 - (now - dawn) / (sunrise - dawn);
    if (now < sunset) return 0;
    if (now < dusk) return (now - sunset) / (dusk - sunset);
    return 1;
};

const windowOpacityAt = (now: number, { sunrise, sunset, dawn, dusk }: Boundaries): number => {
    if (now >= sunset && now < dusk) return (now - sunset) / (dusk - sunset);
    if (now >= dusk || now < dawn) return 1;
    if (now >= dawn && now < sunrise) return 1 - (now - dawn) / (sunrise - dawn);
    return 0;
};

/** Sun times and the sky/window opacities for a point in time at the panorama's location. */
export const computeSunTimes = (time: Date): SunTimes => {
    const boundaries = boundariesOf(time);
    const currentTime = time.getTime();

    return {
        ...boundaries,
        currentTime,
        isDay: currentTime >= boundaries.sunrise && currentTime < boundaries.sunset,
        skyOpacity: skyOpacityAt(currentTime, boundaries),
        windowOpacity: windowOpacityAt(currentTime, boundaries),
    };
};
