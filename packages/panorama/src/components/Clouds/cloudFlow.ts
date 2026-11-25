import { edgeY, HalfEllipse } from './arcOutline';
import { BUMP_KINDS, BumpCloudOptions } from './bumpCloud';
import { random } from './random';

import type { CloudParts } from './cloudOutline';

type Range = readonly [number, number];

/** Seconds a lobe takes to travel through the cloud, from the windward edge to the lee edge. */
const CROSSING = [150, 300] as const;
/** Share of the body's height under a lobe that its dark underside may fill at most. */
const SHADE_CAP = 0.55;

const between = ([from, to]: Range, value: number) => from + (to - from) * value;
const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const smooth = (value: number) => {
    const t = clamp01(value);

    return t * t * (3 - 2 * t);
};

/**
 * A cloud as a flow of lobes. The wind comes from the right, the side the cloud drifts away from: lobes are blown up
 * at the windward edge, travel slowly through the cloud to the lee edge and let their air out there. The size of a
 * lobe follows a profile that is high on the windward side and runs out long towards lee.
 */
export interface Flow {
    seed: number;
    width: number;
    height: number;
    /** The level line the lobes sit on. */
    base: number;
    /** The part of the frame this flow covers: the whole width, or one half of a parted cloud. */
    from: number;
    to: number;
    /** Where the profile is highest, and how far it reaches towards lee (left) and windward (right). */
    peak: number;
    lee: number;
    windward: number;
    /** Distance between two lobes of the row, and how fast they travel through the cloud, in px/s. */
    spacing: number;
    speed: number;
    /** Radius of the big crown lobes that swell up as they pass the peak; 0 for a cloud without a crown. */
    crown: number;
    /** Height of the underside in the middle, and how far it bulges below the level line. */
    shade: number;
    depth: number;
    smallest: number;
    /** Which ends get a flat, pointed tail: the outer ends of the whole cloud; a cut end gets a small one. */
    ends: { lee: boolean; windward: boolean };
}

/** The flow of the cloud of the options; same options, same flow. */
export const flowOf = ({ seed, type, width: fixedWidth }: BumpCloudOptions): Flow => {
    const kind = BUMP_KINDS[type];
    const next = random(seed);
    const drawnWidth = between(kind.width, next());
    const width = fixedWidth ?? drawnWidth;
    const height = width / between(kind.aspect, next());
    const base = height * (1 - between([0.05, 0.1], next()));

    return {
        seed,
        width,
        height,
        base,
        from: 0,
        to: width,
        peak: width * between([0.58, 0.72], next()),
        lee: width * between([0.32, 0.48], next()),
        windward: width * between([0.14, 0.22], next()),
        spacing: base * between([0.28, 0.36], next()),
        speed: width / between(CROSSING, next()),
        crown: Math.floor(between(kind.crown, next())) > 0 ? base * between([0.3, 0.42], next()) : 0,
        shade: base * between(kind.shade, next()),
        depth: (height - base) * between([0.5, 1], next()),
        smallest: kind.smallest,
        ends: { lee: true, windward: true },
    };
};

/** The flow as two halves parted at `at` (0..1 of the width): the left one gets a windward edge at the cut, the right one a lee edge. */
export const halvesOf = (flow: Flow, at: number): [Flow, Flow] => {
    const cut = flow.from + (flow.to - flow.from) * at;

    return [
        { ...flow, to: cut, ends: { lee: flow.ends.lee, windward: false } },
        { ...flow, from: cut, ends: { lee: false, windward: flow.ends.windward } },
    ];
};

/** A fixed random number for lobe k, the same at every time. */
const hash = (flow: Flow, k: number, salt: number) => random(flow.seed * 31 + k * 7919 + salt * 104_729)();

const top = (cx: number, cy: number, rx: number, ry: number): HalfEllipse => ({ cx, cy, rx, ry, side: 'top' });

/** Size of the profile at x, as a share of the biggest. */
const profile = (flow: Flow, x: number) =>
    0.15 + 0.85 * Math.exp(-(((x - flow.peak) / (x < flow.peak ? flow.lee : flow.windward)) ** 2));

/** How far lobe k is blown up while the cloud forms or dissolves: each one at a threshold of its own, like balloons. */
const gate = (flow: Flow, k: number, salt: number, mass: number) => smooth((mass - 0.7 * hash(flow, k, salt)) / 0.3);

/** The lobes that pass by at time t, spaced `spacing` apart: their index and where they are now. */
const passing = (flow: Flow, t: number, spacing: number) => {
    const travel = (t * flow.speed) / spacing;
    const newest = Math.floor(travel);
    const count = Math.ceil((flow.to - flow.from) / spacing) + 2;

    return Array.from({ length: count }, (_, index) => {
        const k = newest - index;

        return { k, x: flow.to - (travel - k) * spacing };
    }).filter(({ x }) => x > flow.from - spacing);
};

/** The row: blown up at the windward edge, travelling to lee, letting the air out at the lee edge. */
const rowAt = (flow: Flow, t: number, mass: number): HalfEllipse[] =>
    passing(flow, t, flow.spacing).flatMap(({ k, x }) => {
        const amount =
            smooth((flow.to - x) / (flow.spacing * 1.2)) *
            smooth((x - flow.from) / (flow.spacing * 1.5)) *
            gate(flow, k, 4, mass);
        const r =
            Math.max(flow.smallest, profile(flow, x) * flow.base * between([0.55, 0.8], hash(flow, k, 2))) * amount;

        return r < 0.5 ? [] : [top(x, flow.base, r * between([1, 1.2], hash(flow, k, 3)), r)];
    });

/** Height of the row at x above the level line. */
const heightAt = (row: HalfEllipse[], base: number, x: number) =>
    row.reduce((highest, lobe) => Math.max(highest, base - (edgeY(lobe, x) ?? base)), 0);

/** The crown: big lobes that swell up as they near the peak and sink again behind it, resting on the row. */
const crownAt = (flow: Flow, t: number, mass: number, row: HalfEllipse[]): HalfEllipse[] =>
    flow.crown <= 0
        ? []
        : passing(flow, t, flow.crown * 1.3).flatMap(({ k, x }) => {
              const swell = Math.exp(-(((x - flow.peak) / (flow.crown * 1.4)) ** 2));
              const edges = smooth((flow.to - x) / flow.crown) * smooth((x - flow.from) / flow.crown);
              const r =
                  flow.crown *
                  between([0.75, 1], hash(flow, k, 5)) *
                  smooth(swell * 1.4) *
                  edges *
                  gate(flow, k, 6, mass);
              const lift = Math.min(
                  flow.base - r,
                  0.92 * Math.min(heightAt(row, flow.base, x - r), heightAt(row, flow.base, x + r))
              );

              return r < 1 ? [] : [top(x, flow.base - Math.max(0, lift), r, r)];
          });

/** Flat, pointed tails: long on the lee side, short on the windward side, small at a cut. */
const tailsAt = (flow: Flow, mass: number): HalfEllipse[] => {
    const lee = flow.ends.lee ? flow.width * 0.1 : flow.spacing * 0.8;
    const windward = flow.ends.windward ? flow.width * 0.06 : flow.spacing * 0.8;
    const flat = flow.base * 0.07 * smooth(mass * 1.5);

    return flat < 0.3
        ? []
        : [top(flow.from + lee, flow.base, lee, flat), top(flow.to - windward, flow.base, windward, flat * 0.8)];
};

/**
 * The underside, carried by the lobes of the row: thick in the middle of the cloud, and never higher than part of the
 * lowest point of the body above it, so a band of light stays on top everywhere, as on the hand-drawn clouds.
 */
const undersideAt = (flow: Flow, row: HalfEllipse[], body: HalfEllipse[]) => {
    const middle = flow.width / 2;
    const lens = (x: number) => 0.35 + 0.65 * (1 - Math.min(1, ((x - middle) / middle) ** 2));
    const lowest = (cx: number, rx: number) =>
        Math.min(...[-0.6, -0.3, 0, 0.3, 0.6].map(at => heightAt(body, flow.base, cx + at * rx)));
    const shaded = row.filter(({ ry }) => ry > flow.smallest * 0.5);

    return {
        ups: shaded.map(({ cx, rx }) =>
            top(cx, flow.base, rx * 1.25, Math.min(flow.shade * lens(cx), SHADE_CAP * lowest(cx, rx * 1.25)))
        ),
        downs: shaded.map(({ cx, rx, ry }): HalfEllipse => ({
            cx,
            cy: flow.base,
            rx: rx * 1.25,
            ry: flow.depth * lens(cx) * Math.min(1, ry / flow.spacing),
            side: 'bottom',
        })),
    };
};

/**
 * The pieces of the flow at time t (seconds), with `mass` from 0 (gone) to 1 (fully formed). A pure function of
 * time: the server draws t = 0, the browser goes on from there.
 */
export const flowParts = (flow: Flow, t: number, mass = 1): CloudParts => {
    const row = rowAt(flow, t, mass);
    const tails = tailsAt(flow, mass);
    const crown = crownAt(flow, t, mass, row);

    return {
        width: flow.width,
        height: flow.height,
        base: flow.base,
        tails,
        row,
        crown,
        ...undersideAt(flow, row, [...tails, ...row, ...crown]),
    };
};
