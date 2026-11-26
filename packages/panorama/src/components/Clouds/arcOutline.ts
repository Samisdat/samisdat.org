/** Half of an ellipse whose centre sits on `cy`; `top` bulges up, `bottom` down (SVG y points down). */
export interface HalfEllipse {
    cx: number;
    cy: number;
    rx: number;
    ry: number;
    side: 'top' | 'bottom';
}

/** A piece of an outline: half an ellipse, or a level line. */
export type Edge = HalfEllipse | { y: number };

/** Which edge forms the outline at x, and its height there. */
export type Pick = (x: number) => { edge: number; y: number };

/** One decimal is enough for a cloud and keeps server and browser on the same digits. */
export const round = (value: number): number => Math.round(value * 10) / 10;

/** Height of an edge at x, or null where the edge does not reach. */
export const edgeY = (edge: Edge, x: number): number | null => {
    if (!('rx' in edge)) {
        return edge.y;
    }

    const t = (x - edge.cx) / edge.rx;

    if (Math.abs(t) >= 1) {
        return null;
    }

    const bulge = edge.ry * Math.sqrt(1 - t * t);

    return 'top' === edge.side ? edge.cy - bulge : edge.cy + bulge;
};

/** Distance between the samples that look for a change of edge; the change itself is found to a fraction of that. */
const STEP = 1;

/** Where the outline passes from `edge` to the next one, between a and b. */
const boundary = (pick: Pick, edge: number, a: number, b: number): number => {
    let inside = a;
    let outside = b;

    // 16 halvings find the change to within a hundredth of a pixel.
    for (let step = 0; step < 16; step += 1) {
        const middle = (inside + outside) / 2;

        if (pick(middle).edge === edge) {
            inside = middle;
        } else {
            outside = middle;
        }
    }

    return (inside + outside) / 2;
};

/**
 * The end of one piece. Arcs always sweep clockwise: along the top from left to right, along the bottom from right to
 * left, which are the only two directions the outlines are traced in.
 */
const segment = (edge: Edge, x: number, y: number): string =>
    'rx' in edge ? `A${round(edge.rx)} ${round(edge.ry)} 0 0 1 ${round(x)} ${round(y)}` : `L${round(x)} ${round(y)}`;

/** Path commands along the outline that `pick` chooses, from `from` to `to`, made of exact arcs with sharp notches. */
export const trace = (pick: Pick, edges: readonly Edge[], from: number, to: number): string => {
    const direction = Math.sign(to - from);
    const steps = Math.max(1, Math.ceil(Math.abs(to - from) / STEP));
    let current = pick(from).edge;
    let start = from;
    let x = from;
    let path = '';

    for (let step = 1; step <= steps; step += 1) {
        const next = step === steps ? to : from + direction * step * STEP;
        const { edge } = pick(next);

        if (edge !== current) {
            const at = boundary(pick, current, x, next);

            // A piece too short to draw would only add digits.
            if (Math.abs(at - start) >= 0.05) {
                path += segment(edges[current], at, edgeY(edges[current], at) ?? pick(at).y);
                start = at;
            }

            current = edge;
        }

        x = next;
    }

    return path + segment(edges[current], to, pick(to).y);
};
