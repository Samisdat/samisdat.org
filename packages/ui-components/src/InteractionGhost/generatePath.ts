import type { Point } from './script';

const round = (value: number) => Math.round(value * 100) / 100;

const point = (x: number, y: number): Point => [round(x), round(y)];

/** Deterministic pseudo noise in -1..1, so generated scripts never change between runs. */
export const noise = (index: number, seed = 1) => {
    const raw = Math.sin(index * 127.1 + seed * 311.7) * 43758.5453;

    return (raw - Math.floor(raw)) * 2 - 1;
};

export type SwayOptions = {
    /** where the path starts (default: the center) */
    from?: Point;
    /** how far the path bows away from the axis, alternating sides like a lazy S */
    cross?: number;
    /** how far from the start the path comes to rest at the end ("almost the center") */
    settle?: number;
    /** shifts the organic variation */
    seed?: number;
};

/** waypoints per swing; enough that the turning points stay round */
const SWING_POINTS = 8;

/**
 * Organic back-and-forth along one axis, calm and never exactly on the axis. Every swing is a half sine
 * along the axis (out to its amplitude and back to the start) combined with a full sine across it, so the way
 * is a lazy S and the turning points are round. The path comes to rest close to where it started.
 */
export const sway = (
    axis: 'x' | 'y',
    swings: number[],
    { from = [0, 0], cross = 0.2, settle = 0.05, seed = 1 }: SwayOptions = {}
): Point[] => {
    const place = (along: number, across: number): Point =>
        axis === 'x' ? point(along, from[1] + across) : point(from[0] + across, along);
    const start = axis === 'x' ? from[0] : from[1];

    const out = swings.flatMap((amplitude, swing) => {
        const reach = amplitude * (1 + 0.06 * noise(swing, seed));
        const side = swing % 2 === 0 ? 1 : -1;

        return Array.from({ length: SWING_POINTS }, (_, i) => {
            const s = (i + 1) / SWING_POINTS;

            return place(start + reach * Math.sin(Math.PI * s), side * cross * Math.sin(2 * Math.PI * s));
        });
    });
    // the last point comes to rest near, not exactly on, the start
    out[out.length - 1] = place(start + settle * noise(99, seed), settle * noise(100, seed));

    return [from, ...out];
};

export type RingOptions = {
    /** where the path comes from; it runs from there out to the ring */
    from?: Point;
    center?: Point;
    rx?: number;
    ry?: number;
    /** waypoints around the ring */
    points?: number;
    /** share of a full turn that is drawn, below 1 so the circle stays open */
    turn?: number;
    /** first angle in radians (default: the top) */
    start?: number;
    /** radius modulation, makes it egg-shaped */
    wobble?: number;
    seed?: number;
};

/** A slow, organic, not quite round circle: elliptic, gently wobbling radius, not closed. */
export const ring = ({
    from = [0, 0],
    center = [0, 0],
    rx = 0.6,
    ry = 0.45,
    points = 12,
    turn = 0.94,
    start = -Math.PI / 2,
    wobble = 0.1,
    seed = 1,
}: RingOptions = {}): Point[] => {
    const around = Array.from({ length: points + 1 }, (_, i) => {
        const angle = start + 2 * Math.PI * turn * (i / points);
        const radius = 1 + wobble * Math.sin(2 * angle + seed) + 0.04 * noise(i, seed);

        return point(center[0] + rx * radius * Math.cos(angle), center[1] + ry * radius * Math.sin(angle));
    });

    return [from, ...around];
};

export type GlideOptions = {
    /** sideways bow of the way, as a share of its length */
    bow?: number;
    seed?: number;
};

/** A soft way from one point to another, slightly bowed instead of a straight line. */
export const glide = (from: Point, to: Point, { bow = 0.12, seed = 1 }: GlideOptions = {}): Point[] => {
    const [dx, dy] = [to[0] - from[0], to[1] - from[1]];
    const side = noise(seed, seed) < 0 ? -1 : 1;
    // the normal of the way; its length is the length of the way, so `bow` is relative to it
    const [nx, ny] = [-dy * side * bow, dx * side * bow];

    return [from, point(from[0] + dx / 2 + nx, from[1] + dy / 2 + ny), to];
};
