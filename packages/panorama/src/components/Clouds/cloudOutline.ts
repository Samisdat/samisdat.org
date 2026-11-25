import { Edge, edgeY, HalfEllipse, Pick, round, trace } from './arcOutline';

/** The pieces a bump cloud is made of, all sitting on one level line. */
export interface CloudParts {
    width: number;
    height: number;
    /** The level line every lobe sits on. */
    base: number;
    /** Flat, pointed lobes at the ends. */
    tails: HalfEllipse[];
    /** Round lobes along the level line. */
    row: HalfEllipse[];
    /** Big round lobes resting on the row. */
    crown: HalfEllipse[];
    /** Tops of the shaded underside. */
    ups: HalfEllipse[];
    /** How far the underside bulges below the level line. */
    downs: HalfEllipse[];
}

/** The outline of some parts: paths in the parts' own frame, and how far they reach to either side. */
export interface DrawnCloud {
    body: string;
    /** Empty when the parts have no underside. */
    shade: string;
    from: number;
    to: number;
    /** How far the underside reaches; missing when there is none. */
    shadeFrom?: number;
    shadeTo?: number;
}

/** The highest (`lowest` false) or lowest y among the edges at x, or the fallback edge where none reaches. */
const choose = (edges: readonly Edge[], indices: number[], fallback: number, x: number, lowest = false) =>
    indices.reduce(
        (best, edge) => {
            const y = edgeY(edges[edge], x);

            return null !== y && (lowest ? y > best.y : y < best.y) ? { edge, y } : best;
        },
        { edge: fallback, y: edgeY(edges[fallback], x) as number }
    );

const reach = (lobes: HalfEllipse[]) => ({
    from: Math.min(...lobes.map(({ cx, rx }) => cx - rx)),
    to: Math.max(...lobes.map(({ cx, rx }) => cx + rx)),
});

/**
 * Body and underside of the parts as paths of exact arcs. The underside never rises above the body, and both share
 * the bottom edge, so drawing the body and then the underside gives one cloud.
 */
export const drawCloud = ({ base, tails, row, crown, ups, downs }: CloudParts): DrawnCloud => {
    const body = [...tails, ...row, ...crown];

    // A cloud that has let out all its air.
    if (0 === body.length) {
        return { body: '', shade: '', from: 0, to: 0 };
    }
    const edges: Edge[] = [{ y: base }, ...body, ...ups, ...downs];
    const ids = (from: number, count: number) => Array.from({ length: count }, (_, index) => from + index);
    const bodyIds = ids(1, body.length);
    const upIds = ids(1 + body.length, ups.length);
    const downIds = ids(1 + body.length + ups.length, downs.length);
    const bodyTop: Pick = x => choose(edges, bodyIds, 0, x);
    const bottom: Pick = x => choose(edges, downIds, 0, x, true);
    const shadeTop: Pick = x => {
        const shade = choose(edges, upIds, 0, x);
        const crest = bodyTop(x);

        return shade.y >= crest.y ? shade : crest;
    };
    const level = round(base);
    const { from, to } = reach(body);
    const under = ups.length > 0 ? reach(ups) : undefined;

    return {
        body: `M${round(from)} ${level}${trace(bodyTop, edges, from, to)}${trace(bottom, edges, to, from)}Z`,
        shade: under
            ? `M${round(under.from)} ${level}${trace(shadeTop, edges, under.from, under.to)}${trace(bottom, edges, under.to, under.from)}Z`
            : '',
        from,
        to,
        shadeFrom: under?.from,
        shadeTo: under?.to,
    };
};
