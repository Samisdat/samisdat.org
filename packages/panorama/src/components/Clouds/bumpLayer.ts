import { BUMP_KINDS, BumpCloudType } from './bumpCloud';
import { Flow, flowOf, flowParts, halvesOf } from './cloudFlow';
import { drawCloud, DrawnCloud } from './cloudOutline';

import type { DriftMember, DriftSeed } from './cloudDrift';
import type { Spawn } from './cloudLife';

/**
 * A cloud from the bump generator, drawn as it starts: its paths sit in their own frame, whose origin is placed at
 * x y. Its flow stays with it, so it can go on changing its shape.
 */
export interface PlacedBump {
    id: number;
    x: number;
    y: number;
    body: string;
    shade: string;
    flow: Flow;
}

/**
 * The four lanes of the sky, top to bottom, between the cirrus and the hills: their level line in sky coordinates,
 * the size of their clouds against the type's own, and the seconds a cloud takes to drift across the sky. As the wind
 * picks up with the height, the higher lanes carry smaller, faster clouds and the lower ones bigger, slower clouds.
 * The lowest level line stays clear of the highest hill (y 200), so no cloud drifts behind a hill.
 */
const LANES = [
    { y: 112, size: 1, crossing: 140 },
    { y: 138, size: 1, crossing: 170 },
    { y: 163, size: 0.75, crossing: 210 },
    { y: 186, size: 1, crossing: 260 },
] as const;

/** The lanes each type drifts on: high and mid clouds on their own, the low ones on the two lowest. */
const TYPE_LANES: Record<BumpCloudType, number[]> = {
    cirrocumulus: [0],
    altocumulus: [1],
    cumulus: [2, 3],
    stratocumulus: [2, 3],
};

/** Share of the widest clouds that start as two halves of one cloud, which come apart after a while. */
const PAIRS = 0.45;
/** Speed of a cloud against its lane's own: enough to catch up with each other, not enough to overtake a higher lane. */
const SPEED = [0.85, 1.15] as const;
/** Seconds before a starting pair parts. */
const PAIR_LIFE = [8, 40] as const;

const between = ([from, to]: readonly [number, number], value: number) => from + (to - from) * value;

type Piece = DrawnCloud & { flow: Flow };

/** A flow as the server draws it: at its start, fully formed. */
const piece = (flow: Flow): Piece => ({ ...drawCloud(flowParts(flow, 0)), flow });

/** What the drift needs to know of a piece: how far it reaches and where it sits. */
const memberOf = ({ from, to, shadeFrom, shadeTo, flow }: Piece, y: number): Omit<DriftMember, 'id' | 'dx'> => ({
    from,
    to,
    shadeFrom,
    shadeTo,
    y,
    pivot: (from + to) / 2,
    base: flow.base,
});

export interface BumpLayer {
    clouds: PlacedBump[];
    drift: DriftSeed[];
}

/** A cloud of the type on one of its lanes: its flow at the lane's size, where it sits, and how fast it drifts. */
const onLane = (type: BumpCloudType, sky: number, next: () => number) => {
    const seed = Math.floor(next() * 1_000_000);
    const lane = TYPE_LANES[type][Math.floor(next() * TYPE_LANES[type].length)];
    const { size, y, crossing } = LANES[lane];
    const drawn = flowOf({ seed, type });
    const flow = 1 === size ? drawn : flowOf({ seed, type, width: drawn.width * size });

    return { lane, flow, y: y - flow.base, speed: (sky / crossing) * between(SPEED, next()) };
};

/**
 * The bump clouds of a layer at the given places: each one on a lane, drifting at its own speed; some of the wide ones
 * start as a pair of halves. `sky` is the width of the sky.
 */
export const bumpLayer = (type: BumpCloudType, xs: number[], sky: number, next: () => number): BumpLayer => {
    const clouds: PlacedBump[] = [];
    const drift: DriftSeed[] = [];
    const widest = BUMP_KINDS[type].width[1];

    xs.forEach(x => {
        const { lane, flow: whole, y, speed } = onLane(type, sky, next);
        const pair = whole.width >= widest * 0.65 && next() < PAIRS;
        const pieces = pair ? halvesOf(whole, between([0.35, 0.65], next())).map(piece) : [piece(whole)];
        const members = pieces.map((one, index) => ({ ...memberOf(one, y), id: clouds.length + index, dx: 0 }));

        pieces.forEach(({ body, shade, flow }, index) =>
            clouds.push({ id: members[index].id, x, y, body, shade, flow })
        );
        drift.push({
            lane,
            x,
            speed,
            members,
            life: pair ? between(PAIR_LIFE, next()) : Infinity,
        });
    });

    return { clouds, drift };
};

/**
 * Makes the new clouds of a layer, which grow in place of dissolved ones: a fresh shape on one of the type's lanes,
 * anywhere along the sky, at its own speed. `sky` is the width of the sky.
 */
export const spawner =
    (type: BumpCloudType, sky: number) =>
    (next: () => number): Spawn => {
        const { lane, flow, y, speed } = onLane(type, sky, next);
        const one = piece(flow);

        return {
            member: memberOf(one, y),
            lane,
            x: next() * sky,
            speed,
            body: one.body,
            shade: one.shade,
            flow: one.flow,
        };
    };
