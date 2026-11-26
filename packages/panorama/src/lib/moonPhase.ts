import * as SunCalc from 'suncalc';

export interface MoonView {
    /** 0 new moon, 0.25 first quarter, 0.5 full moon, 0.75 last quarter. */
    phase: number;
    /** Illuminated fraction of the disc, 0 to 1. */
    fraction: number;
    waxing: boolean;
    /** Clockwise rotation in degrees of a disc whose lit side points right (waxing) or left (waning). */
    rotation: number;
}

/**
 * Phase, fraction and tilt of the moon as seen when it crosses the meridian. The tilt does not follow the moon along
 * its path (that would add the parallactic angle): the moon runs on a painted arc, so it keeps its tilt all night.
 */
export const moonView = (date: Date): MoonView => {
    const { phase, fraction, angle, waxing } = SunCalc.getMoonIllumination(date);

    // suncalc gives the angle of the bright limb anticlockwise, SVG rotates clockwise.
    const clockwise = -angle;
    const home = waxing ? 90 : 270;
    const rotation = ((clockwise - home + 540) % 360) - 180;

    return { phase, fraction, waxing, rotation };
};

export interface MoonShape {
    /** Path of the lit part in a disc of radius `r` around (r, r), lit side to the right. */
    path: string;
    /** Mirror the path horizontally for a waning moon. */
    flip: boolean;
}

/** Outline of the lit part: the outer limb plus the terminator as half an ellipse. */
export const moonShape = (phase: number, r = 25): MoonShape => {
    const waxing = phase <= 0.5;
    const progress = waxing ? phase : 1 - phase;
    // 1 at new moon, 0 at the quarters, -1 at full moon
    const k = Math.cos(2 * Math.PI * progress);
    const rx = Math.abs(k) * r;
    const sweep = k > 0 ? 0 : 1;

    return {
        path: `M${r} 0A${r} ${r} 0 0 1 ${r} ${2 * r}A${rx.toFixed(3)} ${r} 0 0 ${sweep} ${r} 0Z`,
        flip: !waxing,
    };
};
