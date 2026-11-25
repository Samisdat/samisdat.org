import { cloudParts } from './bumpCloud';
import { CloudParts, drawCloud, DrawnCloud } from './cloudOutline';

import type { HalfEllipse } from './arcOutline';
import type { BumpCloudOptions } from './bumpCloud';

type Side = 'left' | 'right';

/** Where the cloud parts: halfway between the two lobes of the row whose notch lies closest to `at` of the width. */
const cutOf = (row: HalfEllipse[], width: number, at: number): number => {
    const sorted = [...row].sort((a, b) => a.cx - b.cx);
    const notches = sorted.slice(1).map((lobe, index) => (sorted[index].cx + lobe.cx) / 2);

    if (0 === notches.length) {
        return width * at;
    }

    return notches.reduce((best, notch) => (Math.abs(notch - width * at) < Math.abs(best - width * at) ? notch : best));
};

/** Lobes of the row a crown lobe rests on, out to its rims; the half with the crown keeps them, so it does not hang in the air. */
const under = (crown: HalfEllipse[], row: HalfEllipse[]) =>
    row.filter(lobe => crown.some(({ cx, rx }) => Math.abs(lobe.cx - cx) < rx + lobe.rx));

/** The lobe of the row that reaches furthest towards the cut. */
const outermost = (row: HalfEllipse[], side: Side) =>
    row.reduce((outer, lobe) =>
        'left' === side
            ? lobe.cx + lobe.rx > outer.cx + outer.rx
                ? lobe
                : outer
            : lobe.cx - lobe.rx < outer.cx - outer.rx
              ? lobe
              : outer
    );

/**
 * A flat, pointed tail where a half was cut off, like the ends of a whole cloud. While the halves still touch it lies
 * low inside the other half's body and does not show.
 */
const cutTail = (row: HalfEllipse[], base: number, side: Side): HalfEllipse[] => {
    if (0 === row.length) {
        return [];
    }

    const edge = outermost(row, side);
    const sign = 'left' === side ? 1 : -1;

    return [
        {
            cx: edge.cx + sign * edge.rx * 0.4,
            cy: base,
            rx: edge.rx * 1.2,
            ry: Math.min(edge.ry * 0.35, base * 0.1),
            side: 'top',
        },
    ];
};

/** The lobes of one side, with what its crown rests on and a tail at the cut; `side` is the half's own side. */
const halfOf = (parts: CloudParts, keep: (lobe: HalfEllipse) => boolean, side: Side): CloudParts => {
    const crown = parts.crown.filter(keep);
    const row = [
        ...parts.row.filter(keep),
        ...under(
            crown,
            parts.row.filter(lobe => !keep(lobe))
        ),
    ];

    return {
        ...parts,
        tails: [...parts.tails.filter(keep), ...cutTail(row, parts.base, side)],
        row,
        crown,
        ups: parts.ups.filter(keep),
        downs: parts.downs.filter(keep),
    };
};

/** The pieces of the two halves of the cloud of the options, parted at a notch of the row near `at` (0..1 of the width). */
export const splitParts = (options: BumpCloudOptions, at = 0.5): [CloudParts, CloudParts] => {
    const parts = cloudParts(options);
    const cut = cutOf(parts.row, parts.width, at);
    const left = (lobe: HalfEllipse) => lobe.cx < cut;

    return [halfOf(parts, left, 'left'), halfOf(parts, lobe => !left(lobe), 'right')];
};

/**
 * The cloud of the options as two smaller ones, parted at a notch of the row near `at` (0..1 of the width). Both
 * halves keep the whole cloud's frame: drawn at the same place, all bodies first and then all undersides, they give
 * back the whole cloud; moved apart, each reads as a cloud of its own.
 */
export const splitCloud = (options: BumpCloudOptions, at = 0.5): [DrawnCloud, DrawnCloud] => {
    const [left, right] = splitParts(options, at);

    return [drawCloud(left), drawCloud(right)];
};
