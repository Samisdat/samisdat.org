export type Point = [number, number];
export type Kind = 'hill' | 'house' | 'tree';
export type SceneObject = { k: Kind; s: number; d: number };

/** train speed in world units per second */
export const V = 110;
/** loop range of the train position */
export const XMIN = -40;
export const XMAX = 840;
/** half of the horizontal opening angle of the window */
export const HALF = (35 * Math.PI) / 180;
/** looking direction: perpendicular to the direction of travel */
export const LOOK = -Math.PI / 2;
/** window view: height, horizon line, eye height */
export const WH = 240;
export const HOR = 150;
export const EYE = 2;
/** focal length in px, so that ±HALF fills exactly 800 px */
export const F = 400 / Math.tan(HALF);
/** foot line of the hill silhouette */
export const YB = HOR + (F * EYE) / 175;
/** map: y of the tracks */
export const OY = 315;
/** how far back the angle wedges look, in seconds */
export const WINDOW_S = 0.5;

export const OBJECTS: SceneObject[] = [
    { k: 'hill', s: 510, d: 228 },
    { k: 'hill', s: 290, d: 235 },
    { k: 'house', s: 390, d: 120 },
    { k: 'tree', s: 150, d: 70 },
    { k: 'tree', s: 260, d: 85 },
    { k: 'tree', s: 520, d: 80 },
    { k: 'tree', s: 640, d: 75 },
];

/** wedge radius per kind, deliberately different so the wedges do not cover each other */
export const WEDGE_RADIUS: Record<Kind, number> = { tree: 40, house: 72, hill: 110 };

/** The wide hill with its two shoulders sits 290 from the right edge, the narrow, deep one 290 from the left. */
const BUMPS = [
    { s: 510, d: 228, h: 34, rs: 62, rd: 34 },
    { s: 588, d: 250, h: 25, rs: 40, rd: 28 },
    { s: 440, d: 252, h: 18, rs: 46, rd: 26 },
    { s: 290, d: 235, h: 30, rs: 34, rd: 52 },
];

/** Height field: three gaussian hills plus a slight modulation so the contour lines do not look too smooth. */
export const terrain = (s: number, d: number, bumps = BUMPS) => {
    let h = 0;
    for (const b of bumps) {
        const u = (s - b.s) / b.rs;
        const v = (d - b.d) / b.rd;
        h += b.h * Math.exp(-u * u - v * v);
    }

    return h * (1 + 0.13 * Math.sin(s / 19 + d / 29) * Math.cos(d / 13 - s / 41));
};

/** World (along the tracks, distance from the tracks) to map coordinates. */
export const P = (s: number, d: number): Point => [s, OY - d];

const round = (value: number) => Math.round(value * 100) / 100;

/**
 * Wedge around `c` with radius `r` from angle a1 to a2. The difference is normalised to (−π, π],
 * so the short way round is drawn.
 */
export const wedgeArc = (cx: number, cy: number, r: number, a1: number, a2: number) => {
    let dl = a2 - a1;
    while (dl > Math.PI) dl -= 2 * Math.PI;
    while (dl < -Math.PI) dl += 2 * Math.PI;
    const b = a1 + dl;

    return (
        `M${round(cx)},${round(cy)}L${round(cx + r * Math.cos(a1))},${round(cy + r * Math.sin(a1))}` +
        `A${r},${r} 0 0 ${dl > 0 ? 1 : 0} ${round(cx + r * Math.cos(b))},${round(cy + r * Math.sin(b))}Z`
    );
};

/**
 * Sight ray of an object from the eye now, and the angle it swept during the last half second.
 * `dir` is the direction of travel (1 forward, -1 back), so the wedge always trails the movement.
 */
export const sight = (tx: number, o: SceneObject, dir = 1) => {
    const eye = P(tx, 0);
    const before = P(tx - dir * V * WINDOW_S, 0);
    const target = P(o.s, o.d);
    const now = Math.atan2(target[1] - eye[1], target[0] - eye[0]);
    const then = Math.atan2(target[1] - before[1], target[0] - before[0]);

    return { eye, target, wedge: wedgeArc(eye[0], eye[1], WEDGE_RADIUS[o.k], then, now) };
};

/** Where an object appears in the window: x on screen and the scale of its sprite. */
export const project = (tx: number, o: SceneObject) => ({ x: 400 + (F * (o.s - tx)) / o.d, scale: F / o.d });

/** The two hills as fixed layers: each with its own bumps and the depth it is drawn at. */
export const HILLS = [
    { s: 510, d: 228, bumps: BUMPS.slice(0, 3) },
    { s: 290, d: 235, bumps: BUMPS.slice(3) },
];

export type Hill = (typeof HILLS)[number];

/** Half the width of a layer path in px; wide enough for the broadest hill. */
const LAYER_HALF = 500;

/**
 * Silhouette of one hill seen abeam, drawn once around x = 0. The layer is never recomputed while the train
 * drives: it is only shifted sideways by `layerX`.
 */
export const layerPath = (hill: Hill) => {
    let path = `M${-LAYER_HALF},${round(YB)}`;
    for (let x = -LAYER_HALF; x <= LAYER_HALF; x += 5) {
        const k = x / F;
        let ym = YB;
        for (let d = hill.d - 70; d <= hill.d + 70; d += 3) {
            const h = terrain(hill.s + k * d, d, hill.bumps);
            if (h < 0.5) continue;
            const y = HOR - (F * (h - EYE)) / d;
            if (y < ym) ym = y;
        }
        path += `L${x},${round(ym)}`;
    }

    return `${path}L${LAYER_HALF},${round(YB)}Z`;
};

/** Horizontal shift of a hill layer in the window: the only thing that changes while driving. */
export const layerX = (tx: number, hill: Hill) => 400 + (F * (hill.s - tx)) / hill.d;

/** The view cone as a triangle from the eye. */
export const cone = (tx: number, length = 900) => {
    const [ex, ey] = P(tx, 0);
    const edge = (angle: number) => `${round(ex + length * Math.cos(angle))},${round(ey + length * Math.sin(angle))}`;

    return `M${ex},${ey}L${edge(LOOK - HALF)}L${edge(LOOK + HALF)}Z`;
};

/** Middle and half range of the ride: the train position is `NORM_MID + NORM_HALF * u` for a norm u in -1..1. */
export const NORM_MID = (XMIN + XMAX) / 2;
export const NORM_HALF = (XMAX - XMIN) / 2;

/**
 * Shift of a layer or sprite in the window for a ride norm u in -1..1: `400 + k * (ds - NORM_HALF * u)` with
 * k = F / d and ds = s - NORM_MID. The CSS driven window evaluates exactly this with calc().
 */
export const shiftFromNorm = (u: number, s: number, d: number) => 400 + (F / d) * (s - NORM_MID - NORM_HALF * u);

/** One way along the tracks, in ms. */
export const RIDE_MS = ((XMAX - XMIN) / V) * 1000;

/** Train position and direction after `ms` of the ride, which goes there and back without a jump. */
export const rideAt = (ms: number) => {
    const phase = ((ms % (2 * RIDE_MS)) + 2 * RIDE_MS) % (2 * RIDE_MS);

    return phase < RIDE_MS
        ? { tx: XMIN + (V * phase) / 1000, dir: 1 }
        : { tx: XMAX - (V * (phase - RIDE_MS)) / 1000, dir: -1 };
};
