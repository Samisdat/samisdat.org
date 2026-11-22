import { Lobe } from './cloudShapes';
import { random } from './random';

export interface ThinShape {
    width: number;
    height: number;
    /** Flat ellipses, drawn in one tone: thin high clouds have no shaded underside. */
    lobes: Lobe[];
}

/** A cirrus streak: a few long, thin strands that fray out at one end. */
const cirrus = (seed: number): ThinShape => {
    const next = random(seed);
    const lobes: Lobe[] = [];

    for (let strand = 0; strand < 4; strand += 1) {
        const length = 90 + next() * 120;
        const drift = strand * 7 + next() * 6;

        lobes.push({ cx: length * 0.9 + drift * 3, cy: 22 + drift, rx: length, ry: 2.2 + next() * 2 });
        lobes.push({ cx: length * 1.7 + drift * 3, cy: 20 + drift * 1.2, rx: length * 0.45, ry: 1.4 + next() });
    }

    return { width: 340, height: 50, lobes };
};

/** Cirrocumulus: a rippled field of small, evenly sized puffs with holes in it. */
const cirrocumulus = (seed: number): ThinShape => {
    const next = random(seed);
    const lobes: Lobe[] = [];

    for (let row = 0; row < 4; row += 1) {
        for (let column = 0; column < 13; column += 1) {
            if (next() < 0.22) {
                continue;
            }

            const size = 7 + next() * 4;

            lobes.push({
                cx: column * 22 + (row % 2) * 11 + next() * 4,
                cy: row * 13 + Math.sin(column * 0.7) * 3,
                rx: size * 1.3,
                ry: size * 0.55,
            });
        }
    }

    return { width: 300, height: 56, lobes };
};

export const thinShapes = {
    cirrusA: cirrus(31),
    cirrusB: cirrus(37),
    cirrusC: cirrus(41),
    cirrocumulusA: cirrocumulus(43),
    cirrocumulusB: cirrocumulus(47),
} satisfies Record<string, ThinShape>;

export type ThinShapeName = keyof typeof thinShapes;
