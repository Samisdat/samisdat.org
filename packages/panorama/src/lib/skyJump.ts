import * as SunCalc from 'suncalc';

/** The moon phases to pick from: the phase as `moonView` gives it (0 new, 0.5 full) and what the controls call it. */
export const MOON_PHASES = [
    { phase: 0, label: 'Neumond' },
    { phase: 0.125, label: 'Zunehmende Sichel' },
    { phase: 0.25, label: 'Erstes Viertel' },
    { phase: 0.375, label: 'Zunehmend' },
    { phase: 0.5, label: 'Vollmond' },
    { phase: 0.625, label: 'Abnehmend' },
    { phase: 0.75, label: 'Letztes Viertel' },
    { phase: 0.875, label: 'Abnehmende Sichel' },
] as const;

/** Local hour at which a picked moon phase is shown; deep enough in the night for the moon to be up in the sky. */
const MOON_HOUR = 23;
/** A lunar month is about 29.5 days. */
const SEARCH_DAYS = 30;

/** Midday or midnight (the start of the day) of the day `from` falls on. */
export const timeOfDay = (from: Date, part: 'day' | 'night'): Date => {
    const moment = new Date(from);

    moment.setHours('day' === part ? 12 : 0, 0, 0, 0);

    return moment;
};

/** Distance between two phases, which wrap around: 0.95 is close to 0.05. */
const phaseGap = (a: number, b: number): number => {
    const gap = Math.abs(a - b) % 1;

    return Math.min(gap, 1 - gap);
};

/** The nearest night, today or later, whose moon shows `phase`. */
export const nightOfMoonPhase = (from: Date, phase: number): Date => {
    let best = new Date(from);
    let bestGap = Infinity;

    for (let offset = 0; offset < SEARCH_DAYS; offset += 1) {
        const night = new Date(from);

        night.setDate(night.getDate() + offset);
        night.setHours(MOON_HOUR, 0, 0, 0);

        const gap = phaseGap(SunCalc.getMoonIllumination(night).phase, phase);

        if (gap < bestGap) {
            best = night;
            bestGap = gap;
        }
    }

    return best;
};

/** Which of the `MOON_PHASES` the moon of `moment` is closest to, as an index. */
export const closestMoonPhase = (moment: Date): number => {
    const { phase } = SunCalc.getMoonIllumination(moment);
    const gaps = MOON_PHASES.map(entry => phaseGap(entry.phase, phase));

    return gaps.indexOf(Math.min(...gaps));
};
