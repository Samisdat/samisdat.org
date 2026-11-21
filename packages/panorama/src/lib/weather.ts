export type Cover = 'clear' | 'light' | 'cloudy' | 'mostly' | 'overcast';
export type Rain = 'none' | 'light' | 'steady' | 'heavy';

export interface Weather {
    cover: Cover;
    rain: Rain;
}

export const CLEAR: Weather = { cover: 'clear', rain: 'none' };

const covers: Cover[] = ['clear', 'light', 'cloudy', 'mostly', 'overcast'];
const rains: Rain[] = ['none', 'light', 'steady', 'heavy'];

/** The weather of a day: twenty slots, so a day is drawn with these odds. */
const SLOTS: Weather[] = [
    ...Array<Weather>(3).fill({ cover: 'clear', rain: 'none' }),
    ...Array<Weather>(4).fill({ cover: 'light', rain: 'none' }),
    ...Array<Weather>(4).fill({ cover: 'cloudy', rain: 'none' }),
    { cover: 'cloudy', rain: 'light' },
    ...Array<Weather>(3).fill({ cover: 'mostly', rain: 'none' }),
    ...Array<Weather>(2).fill({ cover: 'mostly', rain: 'steady' }),
    { cover: 'overcast', rain: 'none' },
    { cover: 'overcast', rain: 'steady' },
    { cover: 'overcast', rain: 'heavy' },
];

export const dayKey = (date: Date): string => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

const hash = (text: string): number => {
    let value = 2166136261;

    for (const char of text) {
        value = Math.imul(value ^ char.charCodeAt(0), 16777619);
    }

    return value >>> 0;
};

/** The same day always has the same weather, a new day has a new one. */
export const weatherForDay = (date: Date): Weather => SLOTS[hash(dayKey(date)) % SLOTS.length];

/** Reads `cloudy`, `mostly-steady`, `overcast-heavy`; used for the `?weather=` override. */
export const parseWeather = (text: string | null): Weather | null => {
    const [cover, rain = 'none', ...rest] = (text ?? '').split('-');

    if (rest.length > 0 || !covers.includes(cover as Cover) || !rains.includes(rain as Rain)) {
        return null;
    }

    return { cover: cover as Cover, rain: rain as Rain };
};
