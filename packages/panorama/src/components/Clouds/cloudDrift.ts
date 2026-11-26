import { live, Reshaped, settle, sized, Spawn } from './cloudLife';
import { random } from './random';

/** A cloud inside a drifting group: where it sits in the group, and how far its paths reach in their own frame. */
export interface DriftMember {
    id: number;
    dx: number;
    from: number;
    to: number;
    /** How far the dark underside reaches; groups merge once their undersides touch. */
    shadeFrom?: number;
    shadeTo?: number;
    /** Where the cloud sits on the sky (top of its frame), and the point it grows from and shrinks to. */
    y?: number;
    pivot?: number;
    base?: number;
    /** Its life: growing, staying, dissolving; the seconds left in that phase and how long the phase is. */
    phase?: 'form' | 'stay' | 'fade';
    left?: number;
    length?: number;
    /** 0 when it is gone, 1 at full size. */
    scale?: number;
}

/** Clouds that drift together, at one speed, on one lane. */
export interface DriftGroup {
    id: number;
    lane: number;
    /** Origin of the group, in 0..width; the clouds drift to the left. */
    x: number;
    /** Pixels per second. */
    speed: number;
    members: DriftMember[];
    /** Seconds since the group formed, and after how many a group of several clouds parts again. */
    age: number;
    life: number;
    /** The group it last parted from; the two do not merge again before they have been apart once. */
    sibling?: number;
}

export interface DriftState {
    width: number;
    groups: DriftGroup[];
    next: () => number;
    nextId: number;
    /** Makes a new cloud when one has dissolved; without it dissolved clouds are simply gone. */
    spawn?: (next: () => number) => Spawn;
    /** Clouds whose paths changed in the last step. */
    reshaped: Reshaped[];
}

/** How much faster the front part and how much slower the back part goes on after a group parts. */
const PART = [0.15, 0.35] as const;
/** Seconds a merged group keeps together. */
const LIFE = [20, 60] as const;

const between = ([from, to]: readonly [number, number], value: number) => from + (to - from) * value;
export const wrap = (x: number, width: number) => ((x % width) + width) % width;

/** Where a group reaches, from its left to its right edge, in sky coordinates (not wrapped). */
const reach = ({ x, members }: DriftGroup) => ({
    left: x + Math.min(...members.map(sized).map(({ dx, from }) => dx + from)),
    right: x + Math.max(...members.map(sized).map(({ dx, to }) => dx + to)),
});

/** How deep b overlaps a, taking the wrap of the sky into account, and the shift of b that gives that overlap. */
const overlap = (a: DriftGroup, b: DriftGroup, width: number) => {
    const ra = reach(a);
    const rb = reach(b);

    return [-width, 0, width]
        .map(shift => ({ shift, depth: Math.min(ra.right, rb.right + shift) - Math.max(ra.left, rb.left + shift) }))
        .reduce((best, candidate) => (candidate.depth > best.depth ? candidate : best));
};

const span = (group: DriftGroup) => reach(group).right - reach(group).left;

/** Where the dark underside of a cloud reaches, in sky coordinates; a cloud without one counts with its body. */
const underside = (x: number, member: DriftMember) => {
    const { dx, from, to, shadeFrom = from, shadeTo = to } = sized(member);

    return { left: x + dx + shadeFrom, right: x + dx + shadeTo };
};

/**
 * How deep the undersides of two groups overlap at their closest pair of clouds, with the wrap of the sky, and the
 * shift of b that gives it. The light bodies may push into each other first; the groups become one cloud only once
 * the dark parts touch.
 */
const touch = (a: DriftGroup, b: DriftGroup, width: number) =>
    [-width, 0, width]
        .flatMap(shift =>
            a.members.flatMap(ma =>
                b.members.map(mb => {
                    const ua = underside(a.x, ma);
                    const ub = underside(b.x + shift, mb);

                    return { shift, depth: Math.min(ua.right, ub.right) - Math.max(ua.left, ub.left) };
                })
            )
        )
        .reduce((best, candidate) => (candidate.depth > best.depth ? candidate : best));

const mayJoin = (a: DriftGroup, b: DriftGroup) => a.lane === b.lane && a.sibling !== b.id && b.sibling !== a.id;

/** b joins a: its clouds keep their place on the sky, the pair drifts on at the width-weighted mean speed. */
const join = (a: DriftGroup, b: DriftGroup, shift: number, state: DriftState): DriftGroup => {
    const wa = span(a);
    const wb = span(b);

    return {
        id: state.nextId++,
        lane: a.lane,
        x: a.x,
        speed: (a.speed * wa + b.speed * wb) / (wa + wb),
        members: [...a.members, ...b.members.map(member => ({ ...member, dx: member.dx + b.x + shift - a.x }))],
        age: 0,
        life: between(LIFE, state.next()),
    };
};

/** A group of several clouds parts at a gap between two of them; the front part speeds up, the back part slows down. */
const part = (group: DriftGroup, state: DriftState): [DriftGroup, DriftGroup] => {
    const sorted = [...group.members].sort((a, b) => a.dx + a.from - (b.dx + b.from));
    const cut = 1 + Math.floor(state.next() * (sorted.length - 1));
    const delta = between(PART, state.next());
    const front = {
        ...group,
        id: state.nextId++,
        members: sorted.slice(0, cut),
        speed: group.speed * (1 + delta),
        age: 0,
    };
    const back = { ...group, id: state.nextId++, members: sorted.slice(cut), speed: group.speed * (1 - delta), age: 0 };

    return [
        { ...front, sibling: back.id, life: between(LIFE, state.next()) },
        { ...back, sibling: front.id, life: between(LIFE, state.next()) },
    ];
};

/** Drops a sibling mark once there is a gap between the two groups. */
const forget = (groups: DriftGroup[], width: number): DriftGroup[] =>
    groups.map(group => {
        const sibling = groups.find(({ id }) => id === group.sibling);

        return sibling && overlap(group, sibling, width).depth >= 0 ? group : { ...group, sibling: undefined };
    });

/** Merges the first pair of groups whose undersides touch; one merge per step is plenty at these speeds. */
const mergeOnce = (groups: DriftGroup[], state: DriftState): DriftGroup[] => {
    for (let i = 0; i < groups.length; i += 1) {
        for (let j = i + 1; j < groups.length; j += 1) {
            const { depth, shift } = touch(groups[i], groups[j], state.width);

            if (mayJoin(groups[i], groups[j]) && depth > 0) {
                return [...groups.filter((_, k) => k !== i && k !== j), join(groups[i], groups[j], shift, state)];
            }
        }
    }

    return groups;
};

/**
 * Moves every group on by `seconds` and ages its clouds, then lets groups that have caught up merge and old merged
 * groups part.
 */
export const step = (state: DriftState, seconds: number): DriftState => {
    const moved = state.groups.map(group => ({
        ...group,
        x: wrap(group.x - group.speed * seconds, state.width),
        age: group.age + seconds,
    }));
    const { groups: living, reshaped } = live(moved, seconds, state);
    const parted = living.flatMap(group =>
        group.members.length > 1 && group.age >= group.life ? part(group, state) : [group]
    );

    return { ...state, groups: mergeOnce(forget(parted, state.width), state), reshaped };
};

/** Where a cloud is drawn: its frame's origin on the sky (x in 0..width), and its size about its pivot. */
export interface Placement {
    x: number;
    y: number;
    scale: number;
    pivot: number;
    base: number;
}

/** Every cloud by id; a renderer also draws each one again one width to the left. */
export const positions = ({ groups, width }: DriftState): Map<number, Placement> =>
    new Map(
        groups.flatMap(({ x, members }) =>
            members.map(({ id, dx, y = 0, scale = 1, pivot = 0, base = 0 }) => [
                id,
                { x: wrap(x + dx, width), y, scale, pivot, base },
            ])
        )
    );

/** A starting group: one cloud, or the halves of a parted cloud that will come apart after `life` seconds. */
export interface DriftSeed {
    lane: number;
    x: number;
    speed: number;
    members: DriftMember[];
    life: number;
}

export const startDrift = (
    width: number,
    seeds: DriftSeed[],
    seed: number,
    spawn?: (next: () => number) => Spawn
): DriftState => {
    const next = random(seed);

    return {
        width,
        groups: seeds.map((group, id) => ({
            ...group,
            id,
            x: wrap(group.x, width),
            age: 0,
            members: group.members.map(member => settle(member, next)),
        })),
        next,
        nextId: seeds.length,
        spawn,
        reshaped: [],
    };
};
