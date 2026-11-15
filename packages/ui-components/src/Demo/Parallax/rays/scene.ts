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
    { k: 'hill', s: 400, d: 228 },
    { k: 'house', s: 390, d: 120 },
    { k: 'tree', s: 150, d: 70 },
    { k: 'tree', s: 260, d: 85 },
    { k: 'tree', s: 520, d: 80 },
    { k: 'tree', s: 640, d: 75 },
];

/** wedge radius per kind, deliberately different so the wedges do not cover each other */
export const WEDGE_RADIUS: Record<Kind, number> = { tree: 40, house: 72, hill: 110 };

const BUMPS = [
    { s: 400, d: 228, h: 34, rs: 62, rd: 34 },
    { s: 478, d: 250, h: 25, rs: 40, rd: 28 },
    { s: 330, d: 252, h: 18, rs: 46, rd: 26 },
];

/** Height field: three gaussian hills plus a slight modulation so the contour lines do not look too smooth. */
export const terrain = (s: number, d: number) => {
    let h = 0;
    for (const b of BUMPS) {
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

/** Sight ray of an object from the eye now, and the angle it swept during the last half second. */
export const sight = (tx: number, o: SceneObject) => {
    const eye = P(tx, 0);
    const before = P(tx - V * WINDOW_S, 0);
    const target = P(o.s, o.d);
    const now = Math.atan2(target[1] - eye[1], target[0] - eye[0]);
    const then = Math.atan2(target[1] - before[1], target[0] - before[0]);

    return { eye, target, wedge: wedgeArc(eye[0], eye[1], WEDGE_RADIUS[o.k], then, now) };
};

/** Where an object appears in the window: x on screen and the scale of its sprite. */
export const project = (tx: number, o: SceneObject) => ({ x: 400 + (F * (o.s - tx)) / o.d, scale: F / o.d });

/**
 * Silhouette of the terrain between the depths dA and dB, seen from the window. For every column the
 * view ray is sampled in depth, the highest projected terrain wins.
 */
export const ridge = (tx: number, dA: number, dB: number) => {
    let path = `M0,${round(YB)}`;
    for (let x = 0; x <= 800; x += 5) {
        const k = (x - 400) / F;
        let ym = YB;
        for (let d = dA; d <= dB; d += 3) {
            const h = terrain(tx + k * d, d);
            if (h < 0.5) continue;
            const y = HOR - (F * (h - EYE)) / d;
            if (y < ym) ym = y;
        }
        path += `L${x},${round(ym)}`;
    }

    return `${path}L800,${round(YB)}Z`;
};

/** The view cone as a triangle from the eye. */
export const cone = (tx: number, length = 900) => {
    const [ex, ey] = P(tx, 0);
    const edge = (angle: number) => `${round(ex + length * Math.cos(angle))},${round(ey + length * Math.sin(angle))}`;

    return `M${ex},${ey}L${edge(LOOK - HALF)}L${edge(LOOK + HALF)}Z`;
};
