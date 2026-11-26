/**
 * The test hooks of the panorama, set in the query string:
 * `?time=2026-12-21T15:30:00Z` pins the clock, `?weather=overcast-steady` sets the weather and `?cloudspeed=20`
 * runs the clouds twenty times as fast. Read them in effects and event handlers only; the server has no `window`.
 */
export const testParam = (name: 'time' | 'weather' | 'cloudspeed'): string | null =>
    new URLSearchParams(window.location.search).get(name);
