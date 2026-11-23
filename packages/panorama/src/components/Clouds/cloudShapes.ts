import { random } from './random';

export interface Lobe {
    cx: number;
    cy: number;
    rx: number;
    ry: number;
}

export interface CloudShape {
    width: number;
    height: number;
    /** The flat, slightly curved underside every lobe sits on. */
    lens: Lobe;
    /** Back to front; together with the lens they form the silhouette. The lit crown is drawn from them. */
    lobes: Lobe[];
}

interface ShapeSpec {
    width: number;
    height: number;
    /** Lobes along the top. */
    count: number;
    /** 0 spreads the height evenly, 1 gives one tall dome. */
    dome: number;
    seed: number;
}

const SPECS = {
    fairSmall: { width: 202, height: 80, count: 7, dome: 0.8, seed: 3 },
    cumMed: { width: 332, height: 146, count: 11, dome: 0.9, seed: 7 },
    cumTower: { width: 280, height: 234, count: 10, dome: 1, seed: 11 },
    stratus: { width: 530, height: 81, count: 14, dome: 0.35, seed: 5 },
    rain: { width: 420, height: 122, count: 12, dome: 0.5, seed: 13 },
    altoLump: { width: 170, height: 46, count: 6, dome: 0.5, seed: 17 },
    altoBand: { width: 300, height: 44, count: 9, dome: 0.3, seed: 19 },
    stratoLump: { width: 360, height: 62, count: 10, dome: 0.3, seed: 23 },
    stratoRoll: { width: 520, height: 70, count: 14, dome: 0.2, seed: 29 },
} satisfies Record<string, ShapeSpec>;

export type CloudShapeName = keyof typeof SPECS;

const shapeOf = ({ width, height, count, dome, seed }: ShapeSpec): CloudShape => {
    const next = random(seed);
    const lensRy = height * 0.16;
    const top = (height - lensRy) / 1.55;
    const center = 0.35 + next() * 0.3;
    const lobes: Lobe[] = [];

    for (let index = 0; index < count; index += 1) {
        const t = (index + 0.5) / count;
        const bump = Math.exp(-(((t - center) / 0.25) ** 2));
        const ry = top * (0.28 + 0.72 * (dome * bump + (1 - dome) * 0.7)) * (0.9 + 0.2 * next());

        lobes.push({
            cx: width * (0.07 + 0.86 * t),
            cy: height - lensRy - ry * 0.55,
            rx: ry * (0.95 + next() * 0.3),
            ry,
        });
    }

    // Small bumps along the upper rim of every lobe: the cauliflower edge.
    lobes.slice().forEach(({ cx, cy, rx, ry }) => {
        for (let bump = 0; bump < 2 + Math.floor(next() * 2); bump += 1) {
            const angle = Math.PI * (1.1 + next() * 0.8);
            const r = ry * (0.24 + next() * 0.14);

            lobes.push({
                cx: cx + Math.cos(angle) * rx * 0.92,
                cy: cy + Math.sin(angle) * ry * 0.92,
                rx: r * 1.15,
                ry: r,
            });
        }
    });

    return {
        width,
        height,
        lens: { cx: width / 2, cy: height - lensRy, rx: width / 2, ry: lensRy },
        lobes: lobes.sort((a, b) => b.cy + b.ry - (a.cy + a.ry)),
    };
};

export const cloudShapes = Object.fromEntries(
    Object.entries(SPECS).map(([name, spec]) => [name, shapeOf(spec)])
) as Record<CloudShapeName, CloudShape>;
