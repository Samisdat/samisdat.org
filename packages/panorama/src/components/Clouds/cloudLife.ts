import type { DriftGroup, DriftMember, DriftState } from './cloudDrift';
import type { Flow } from './cloudFlow';

/** Seconds a cloud takes to grow, how long it stays, and how long it takes to dissolve. */
const FORM = [20, 35] as const;
const STAY = [90, 240] as const;
const FADE = [20, 35] as const;

const between = ([from, to]: readonly [number, number], value: number) => from + (to - from) * value;

/** Ease in and out, so a cloud starts and ends its growing and shrinking gently. */
const smooth = (t: number) => t * t * (3 - 2 * t);

/** A new cloud somewhere on the layer, with its paths, its height on the sky and how fast it drifts. */
export interface Spawn {
    member: Omit<DriftMember, 'id' | 'dx'>;
    lane: number;
    x: number;
    speed: number;
    body: string;
    shade: string;
    /** Its flow, so it can go on changing its shape. */
    flow?: Flow;
}

/** A cloud whose paths changed in the last step: it dissolved and grew again elsewhere as a new cloud. */
export interface Reshaped {
    id: number;
    body: string;
    shade: string;
    flow?: Flow;
}

/** The member as it is drawn now: its reach shrunk about its pivot by its scale. */
export const sized = (member: DriftMember): DriftMember => {
    const scale = member.scale ?? 1;

    if (1 === scale) {
        return member;
    }

    const pivot = member.pivot ?? (member.from + member.to) / 2;
    const shrink = (value: number) => pivot + (value - pivot) * scale;

    return {
        ...member,
        from: shrink(member.from),
        to: shrink(member.to),
        shadeFrom: undefined === member.shadeFrom ? undefined : shrink(member.shadeFrom),
        shadeTo: undefined === member.shadeTo ? undefined : shrink(member.shadeTo),
    };
};

/** Gives a cloud without a phase its stay, so every cloud of a new sky dissolves at a time of its own. */
export const settle = (member: DriftMember, next: () => number): DriftMember =>
    member.phase ? member : { ...member, phase: 'stay', left: between(STAY, next()), scale: 1 };

/** One cloud one step on in its life: growing, staying, dissolving; `undefined` once it is gone. */
const age = (member: DriftMember, seconds: number, next: () => number): DriftMember | undefined => {
    const left = (member.left ?? 0) - seconds;

    if ('form' === member.phase) {
        return left > 0
            ? { ...member, left, scale: smooth(1 - left / (member.length ?? 1)) }
            : { ...member, phase: 'stay', left: between(STAY, next()), scale: 1 };
    }

    if ('fade' === member.phase) {
        return left > 0 ? { ...member, left, scale: smooth(left / (member.length ?? 1)) } : undefined;
    }

    if (left > 0) {
        return { ...member, left };
    }

    const length = between(FADE, next());

    return { ...member, phase: 'fade', left: length, length };
};

/** A new group of one cloud that grows from nothing, in place of a cloud that dissolved. */
const reborn = (id: number, state: DriftState, reshaped: Reshaped[]): DriftGroup[] => {
    if (!state.spawn) {
        return [];
    }

    const { member, lane, x, speed, body, shade, flow } = state.spawn(state.next);
    const length = between(FORM, state.next());

    reshaped.push({ id, body, shade, flow });

    return [
        {
            id: state.nextId++,
            lane,
            x,
            speed,
            members: [{ ...member, id, dx: 0, phase: 'form', left: length, length, scale: 0 }],
            age: 0,
            life: Infinity,
        },
    ];
};

/**
 * Every cloud one step on in its life. A cloud that has dissolved leaves its group and grows again as a new cloud
 * somewhere else on the layer, so the sky keeps its cover; its id stays, so a renderer can reuse what it drew.
 */
export const live = (groups: DriftGroup[], seconds: number, state: DriftState) => {
    const reshaped: Reshaped[] = [];
    const born: DriftGroup[] = [];
    const living = groups
        .map(group => {
            const members = group.members.flatMap(member => {
                const older = age(member, seconds, state.next);

                if (!older) {
                    born.push(...reborn(member.id, state, reshaped));
                }

                return older ? [older] : [];
            });

            return { ...group, members };
        })
        .filter(({ members }) => members.length > 0);

    return { groups: [...living, ...born], reshaped };
};
