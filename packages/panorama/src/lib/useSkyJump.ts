import { useCallback } from 'react';

import { closestMoonPhase, MOON_PHASES, nightOfMoonPhase, timeOfDay } from './skyJump';
import { useTal } from './TalContext';

/** Jumps of the simulated clock to day, night and a moon phase, for pickers in the time control overlay. */
export const useSkyJump = () => {
    const { time, jumpTo, sunTimes } = useTal();

    return {
        /** True while the sun is up. */
        isDay: sunTimes.isDay,
        /** Index into `MOON_PHASES` of the moon of the shown time. */
        moonPhase: closestMoonPhase(time),
        moonPhases: MOON_PHASES,
        jumpToDay: useCallback(() => jumpTo(timeOfDay(time, 'day')), [time, jumpTo]),
        jumpToNight: useCallback(() => jumpTo(timeOfDay(time, 'night')), [time, jumpTo]),
        jumpToMoonPhase: useCallback(
            (index: number) => jumpTo(nightOfMoonPhase(time, MOON_PHASES[index].phase)),
            [time, jumpTo]
        ),
    };
};
