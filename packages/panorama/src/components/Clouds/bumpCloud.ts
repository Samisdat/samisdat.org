import { edgeY, HalfEllipse, round } from './arcOutline';
import { CloudParts, drawCloud } from './cloudOutline';
import { random } from './random';

/** Cloud types the bump generator draws. Cirrus, nimbostratus and storm clouds get their own generators later. */
export type BumpCloudType = 'cumulus' | 'stratocumulus' | 'altocumulus' | 'cirrocumulus';

type Range = readonly [number, number];

interface Kind {
    width: Range;
    /** Width to height; the hand-drawn cumulus clouds sit between 3.8 and 5.8. */
    aspect: Range;
    /** Radius of the smallest lobe, in pixels. */
    smallest: number;
    /** Height of the shaded underside in the middle, as a share of the cloud's height. */
    shade: Range;
    /** Big round lobes on top of the row; flat types have none or one. */
    crown: Range;
}

/** Starting values from `assets/clouds-hand.svg`; the review page is where they get tuned. */
export const BUMP_KINDS: Record<BumpCloudType, Kind> = {
    cumulus: { width: [160, 420], aspect: [3.8, 5.2], smallest: 6, shade: [0.3, 0.45], crown: [1.5, 3.99] },
    stratocumulus: { width: [300, 520], aspect: [5.5, 8], smallest: 8, shade: [0.35, 0.55], crown: [0, 1.99] },
    altocumulus: { width: [120, 300], aspect: [5, 7.5], smallest: 5, shade: [0.35, 0.55], crown: [0, 1.99] },
    cirrocumulus: { width: [70, 170], aspect: [5, 8], smallest: 3, shade: [0.35, 0.55], crown: [0, 1.49] },
};

export interface BumpCloudOptions {
    /** The same seed always draws the same cloud. */
    seed: number;
    type: BumpCloudType;
    /** Overrides the width drawn from the type's range; height, lobes and shade follow from it. */
    width?: number;
    /** Where the light comes from, in whole steps from -2 (left) to 2 (right); 0 is the hand-drawn, symmetric look. */
    light?: number;
}

export interface BumpCloud {
    width: number;
    height: number;
    /** Height of the level line the lobes sit on; clouds that share it can merge. The underside bulges a little below. */
    base: number;
    /** Path of the cloud's body, in a box from 0 0 to width height. */
    body: string;
    /** Path of the shaded underside, drawn on top of the body; it shares the body's bottom edge. */
    shade: string;
    /** How far the underside reaches, in the same box. */
    shadeFrom: number;
    shadeTo: number;
}

const between = ([from, to]: Range, value: number) => from + (to - from) * value;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/** Step of the light, as a share of the width that the thick part of the underside moves. */
const LIGHT_STEP = 0.08;

/** Size of the row's lobes at u, as a share of the biggest: one peak, a long low tail on the more gentle side. */
const envelope = (u: number, peak: number, left: number, right: number) =>
    0.15 + 0.85 * Math.exp(-((Math.abs(u - peak) / (u < peak ? left : right)) ** 2));

const top = (cx: number, cy: number, rx: number, ry: number): HalfEllipse => ({ cx, cy, rx, ry, side: 'top' });

interface Frame {
    width: number;
    /** The level line every lobe sits on. */
    base: number;
    kind: Kind;
    next: () => number;
}

/** A flat, pointed lobe at each end, like the hand-drawn tails; it reaches to the row, but stays short. */
const tails = ({ width, base, next }: Frame, lobes: HalfEllipse[]): HalfEllipse[] => {
    const first = lobes.length > 0 ? lobes[0].cx : width / 2;
    const last = lobes.length > 0 ? lobes[lobes.length - 1].cx : width / 2;
    const longest = width * 0.14;
    const left = Math.min(longest, Math.max(width * between([0.05, 0.1], next()), first / 2 + 1));
    const right = Math.min(longest, Math.max(width * between([0.06, 0.12], next()), (width - last) / 2 + 1));

    return [
        top(left, base, left, base * between([0.06, 0.12], next())),
        top(width - right, base, right, base * between([0.05, 0.1], next())),
    ];
};

/** Round lobes along the level line, biggest at the peak, each overlapping the last so the notches stay sharp. */
const row = ({ width, base, kind, next }: Frame, peak: number): HalfEllipse[] => {
    const left = between([0.24, 0.36], next());
    const right = between([0.26, 0.42], next());
    // A run of tiny lobes would read as a saw blade; below this size the flat tails take over.
    const floor = Math.max(kind.smallest, base * 0.16);
    const lobes: HalfEllipse[] = [];
    let front = width * between([0.03, 0.07], next());

    while (front < width * 0.94 && lobes.length < 40) {
        const share = envelope(front / width, peak, left, right);
        const r = Math.max(floor, share * base * between([0.55, 0.8], next()));
        // Low down the lobes widen into flat steps, so the tail falls off calmly instead of in many small teeth.
        const rx = r * (share < 0.4 ? between([2, 3], next()) : between([1, 1.2], next()));
        const cx = front + rx * 0.6;
        // Near the ends a lobe stays small enough to leave room for the tail; a big one there ends the cloud in a wall.
        const fit = Math.min(rx, 0.55 * Math.min(cx, width - cx));

        if (fit * (r / rx) >= kind.smallest) {
            lobes.push(top(cx, base, fit, r * (fit / rx)));
        }

        front = cx + rx * between([0.35, 0.65], next());
    }

    return lobes;
};

/** Height of the lobes at x above the level line. */
const heightAt = (lobes: HalfEllipse[], base: number, x: number) =>
    lobes.reduce((highest, lobe) => Math.max(highest, base - (edgeY(lobe, x) ?? base)), 0);

/**
 * Big round lobes resting on the row near the peak: the biggest at the peak, smaller shoulders alternately left and
 * right of it. They sit low enough that the row hides their lower sides.
 */
const crown = ({ width, base, kind, next }: Frame, peak: number, lobes: HalfEllipse[]): HalfEllipse[] => {
    const main = base * between([0.28, 0.42], next());

    return Array.from({ length: Math.floor(between(kind.crown, next())) }, (_, index) => {
        const r = index === 0 ? main : main * between([0.65, 0.9], next());
        const side = (index % 2 === 0 ? 1 : -1) * Math.ceil(index / 2);
        const cx = clamp(width * peak + side * main * between([0.9, 1.3], next()), r, width - r);
        const lift = Math.min(base - r, 0.92 * Math.min(heightAt(lobes, base, cx - r), heightAt(lobes, base, cx + r)));

        return top(cx, base - Math.max(0, lift), r, r);
    });
};

/** Stretches the lobes up or down so the tallest point reaches the top of the box. */
const fitHeight = (lobes: HalfEllipse[], base: number): HalfEllipse[] => {
    const tallest = Math.max(...lobes.map(({ cy, ry }) => base - cy + ry));
    const scale = base / tallest;

    return lobes.map(lobe => ({ ...lobe, cy: base - (base - lobe.cy) * scale, ry: lobe.ry * scale }));
};

/** Share of the body's height that the dark underside may fill at most; the hand-drawn clouds keep light above it everywhere. */
const SHADE_CAP = 0.6;

/** Where the body stands at least this share of its full height: the part the underside sits under. */
const CORE = 0.35;

/** The part of the width where the body is tall, found on a coarse grid. */
const coreOf = (body: HalfEllipse[], base: number, width: number) => {
    const xs = Array.from({ length: 101 }, (_, index) => (width * index) / 100);
    const heights = xs.map(x => heightAt(body, base, x));
    const tallest = Math.max(...heights);
    const inside = xs.filter((_, index) => heights[index] >= tallest * CORE);

    return { from: inside[0], to: inside[inside.length - 1] };
};

/** The lowest the body gets over the middle of a lobe, so the lobe can stay below it. */
const lowestOver = (body: HalfEllipse[], base: number, cx: number, rx: number) =>
    Math.min(...[-0.6, -0.3, 0, 0.3, 0.6].map(t => heightAt(body, base, cx + t * rx)));

/**
 * The underside: overlapping ellipses along the level line under the body's core, thick in the middle, bulging a
 * little below it, and never higher than part of the body above it, so a band of light stays on top.
 */
const underside = ({ width, base, kind, next }: Frame, body: HalfEllipse[], height: number, light: number) => {
    const core = coreOf(body, base, width);
    const span = core.to - core.from;
    const count = clamp(Math.round(span / 40), 2, 9);
    const middle = base * between(kind.shade, next());
    const centre = clamp(0.5 + LIGHT_STEP * light, 0.15, 0.85);
    const ups: HalfEllipse[] = [];
    const downs: HalfEllipse[] = [];

    for (let index = 0; index < count; index += 1) {
        const u = 0.05 + (0.9 * (index + 0.5 + (next() - 0.5) * 0.4)) / count;
        const lens = 0.35 + 0.65 * (1 - Math.min(1, ((u - centre) / 0.5) ** 2));
        const rx = ((0.9 * span) / count) * between([0.9, 1.3], next());
        const cx = clamp(core.from + span * u, rx, width - rx);
        const ry = Math.min(middle * lens * between([0.75, 1.05], next()), SHADE_CAP * lowestOver(body, base, cx, rx));

        ups.push(top(cx, base, rx, ry));
        downs.push({ cx, cy: base, rx, ry: (height - base) * lens * between([0.4, 1], next()), side: 'bottom' });
    }

    return { ups, downs };
};

/** The pieces of one cloud before they are drawn; the same options always give the same pieces. */
export const cloudParts = ({ seed, type, width: fixedWidth, light = 0 }: BumpCloudOptions): CloudParts => {
    const kind = BUMP_KINDS[type];
    const next = random(seed);
    const drawnWidth = between(kind.width, next());
    const width = fixedWidth ?? drawnWidth;
    const height = width / between(kind.aspect, next());
    const frame: Frame = { width, base: height * (1 - between([0.05, 0.1], next())), kind, next };
    const peak = between([0.3, 0.6], next());
    const lobes = row(frame, peak);
    const ends = tails(frame, lobes);
    const tops = crown(frame, peak, lobes);
    const body = fitHeight([...ends, ...lobes, ...tops], frame.base);
    const { ups, downs } = underside(frame, body, height, Math.round(light));

    return {
        width,
        height,
        base: frame.base,
        tails: body.slice(0, ends.length),
        row: body.slice(ends.length, ends.length + lobes.length),
        crown: body.slice(ends.length + lobes.length),
        ups,
        downs,
    };
};

/**
 * One flat cumulus-style cloud in the look of the hand-drawn ones: a row of round lobes with sharp notches on a level
 * line, a big round crown, pointed flat tails, and a shaded underside of overlapping ellipses. Every outline is made
 * of exact arcs. Pure and seeded; the numbers are rounded to one decimal.
 */
export const bumpCloud = (options: BumpCloudOptions): BumpCloud => {
    const parts = cloudParts(options);
    const { body, shade, shadeFrom = 0, shadeTo = 0 } = drawCloud(parts);

    return {
        width: round(parts.width),
        height: round(parts.height),
        base: round(parts.base),
        body,
        shade,
        shadeFrom,
        shadeTo,
    };
};
