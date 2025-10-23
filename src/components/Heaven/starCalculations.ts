import { StarData } from './starCatalog';

const WUPPERTAL_LAT = 51.2562;
const WUPPERTAL_LON = 7.1508;

export interface StarPosition {
    x: number;
    y: number;
    visible: boolean;
    brightness: number;
}

function calculateLocalSiderealTime(date: Date, longitude: number): number {
    const J2000 = new Date('2000-01-01T12:00:00Z').getTime();
    const msPerDay = 86400000;
    const daysSinceJ2000 = (date.getTime() - J2000) / msPerDay;

    const gmst = 18.697374558 + 24.06570982441908 * daysSinceJ2000;

    const lst = gmst + longitude / 15.0;

    return ((lst % 24) + 24) % 24;
}

function equatorialToHorizontal(
    ra: number,
    dec: number,
    lst: number,
    latitude: number
): { altitude: number; azimuth: number } {
    const hourAngle = (lst - ra + 24) % 24;
    const haRad = (hourAngle * 15 * Math.PI) / 180;
    const decRad = (dec * Math.PI) / 180;
    const latRad = (latitude * Math.PI) / 180;

    const sinAlt = Math.sin(decRad) * Math.sin(latRad) + Math.cos(decRad) * Math.cos(latRad) * Math.cos(haRad);
    const altitude = (Math.asin(sinAlt) * 180) / Math.PI;

    const cosAz = (Math.sin(decRad) - Math.sin(latRad) * sinAlt) / (Math.cos(latRad) * Math.cos(Math.asin(sinAlt)));
    let azimuth = (Math.acos(Math.max(-1, Math.min(1, cosAz))) * 180) / Math.PI;

    if (Math.sin(haRad) > 0) {
        azimuth = 360 - azimuth;
    }

    return { altitude, azimuth };
}

export function calculateStarPosition(star: StarData, time: Date, viewWidth: number, viewHeight: number): StarPosition {
    const lst = calculateLocalSiderealTime(time, WUPPERTAL_LON);

    const { altitude, azimuth } = equatorialToHorizontal(star.ra, star.dec, lst, WUPPERTAL_LAT);

    const visible = altitude > 5;

    const azimuthRad = (azimuth * Math.PI) / 180;
    const altitudeNorm = Math.max(0, altitude) / 90;

    const centerX = viewWidth / 2;
    const radius = Math.min(viewWidth, viewHeight) * 0.45;

    const r = radius * (1 - altitudeNorm);
    const x = centerX + r * Math.sin(azimuthRad);
    const y = viewHeight - r * Math.cos(azimuthRad);

    const brightness = Math.max(0.3, Math.min(1, 1 - star.magnitude / 4));

    return {
        x,
        y,
        visible,
        brightness: visible ? brightness : 0,
    };
}
