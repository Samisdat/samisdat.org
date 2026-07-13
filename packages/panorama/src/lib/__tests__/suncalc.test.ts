/**
 * suncalc Astronomical Accuracy Test
 * 
 * Ensures suncalc calculations remain stable across version bumps.
 * Captures sun/moon positions and times for fixed test points.
 */

import * as SunCalc from 'suncalc';
import { describe, it, expect } from 'vitest';

// Panorama coordinates (Wuppertal)
const LAT = 51.2562;
const LNG = 7.1508;

// Test points: solstices, equinox, night
const testPoints = [
  { label: 'Summer Solstice 2024 Noon', date: new Date('2024-06-21T12:00:00+02:00') },
  { label: 'Winter Solstice 2024 Noon', date: new Date('2024-12-21T12:00:00+01:00') },
  { label: 'Spring Equinox 2024 Noon', date: new Date('2024-03-20T12:00:00+01:00') },
  { label: 'Winter Night 2024 02:00', date: new Date('2024-12-21T02:00:00+01:00') },
];

describe('suncalc astronomical accuracy', () => {
  it.each(testPoints)('should produce stable results for $label', ({ date }) => {
    const sunPos = SunCalc.getPosition(date, LAT, LNG);
    const moonPos = SunCalc.getMoonPosition(date, LAT, LNG);
    const times = SunCalc.getTimes(date, LAT, LNG);

    const snapshot = {
      sunPosition: {
        // Rounded to 4 decimals (tolerance: ~10m on ground, ~0.01° in sky)
        altitude: Number(sunPos.altitude.toFixed(4)),
        azimuth: Number(sunPos.azimuth.toFixed(4)),
      },
      moonPosition: {
        altitude: Number(moonPos.altitude.toFixed(4)),
        azimuth: Number(moonPos.azimuth.toFixed(4)),
        distance: Math.round(moonPos.distance), // km precision
        parallacticAngle: Number(moonPos.parallacticAngle.toFixed(4)),
      },
      times: {
        // Times to nearest minute (15s accuracy floor per USNO)
        sunrise: times.sunrise ? roundToMinute(times.sunrise) : null,
        sunset: times.sunset ? roundToMinute(times.sunset) : null,
        dawn: times.dawn ? roundToMinute(times.dawn) : null,
        dusk: times.dusk ? roundToMinute(times.dusk) : null,
        solarNoon: times.solarNoon ? roundToMinute(times.solarNoon) : null,
        night: times.night ? roundToMinute(times.night) : null,
        nightEnd: times.nightEnd ? roundToMinute(times.nightEnd) : null,
      },
    };

    expect(snapshot).toMatchSnapshot();
  });
});

function roundToMinute(date: Date): string {
  const rounded = new Date(date);
  rounded.setSeconds(0, 0);
  return rounded.toISOString();
}
