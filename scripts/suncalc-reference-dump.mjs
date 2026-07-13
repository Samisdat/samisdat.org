#!/usr/bin/env node
/**
 * suncalc Reference Dump
 * 
 * Dumps getPosition, getMoonPosition, getTimes for fixed test points
 * to verify astronomical correctness after suncalc 1.9 → 2.0 migration.
 * 
 * Run on main (1.9) and feature/suncalc-2 (2.0), then diff.
 */

import * as SunCalc from 'suncalc';

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

const results = testPoints.map(({ label, date }) => {
  const sunPos = SunCalc.getPosition(date, LAT, LNG);
  const moonPos = SunCalc.getMoonPosition(date, LAT, LNG);
  const times = SunCalc.getTimes(date, LAT, LNG);

  return {
    label,
    timestamp: date.toISOString(),
    sunPosition: {
      altitude: sunPos.altitude,
      azimuth: sunPos.azimuth,
    },
    moonPosition: {
      altitude: moonPos.altitude,
      azimuth: moonPos.azimuth,
      distance: moonPos.distance,
      parallacticAngle: moonPos.parallacticAngle,
    },
    times: Object.fromEntries(
      Object.entries(times).map(([key, val]) => [
        key,
        val instanceof Date && !isNaN(val.getTime()) ? val.toISOString() : null,
      ])
    ),
  };
});

console.log(JSON.stringify(results, null, 2));
