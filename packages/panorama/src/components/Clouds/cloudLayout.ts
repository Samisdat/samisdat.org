import type { Rain } from '@/lib/weather';
import type { Oktas, Sky } from '@/lib/sky';

import type { CloudType } from './cloudTypes';
import { CloudShapeName } from './cloudShapes';
import { random } from './random';
import { ThinShapeName } from './thinShapes';

export const SKY_WIDTH = 1700;

export type PlacedShape = CloudShapeName | ThinShapeName;

export interface PlacedCloud {
    shape: PlacedShape;
    x: number;
    y: number;
    scale: number;
}

export interface CloudLayer {
    type: CloudType;
    /** Cover of this layer in eighths. */
    oktas: Oktas;
    clouds: PlacedCloud[];
    /** Seconds for one drift across the sky; the higher the layer, the slower. */
    duration: number;
}

interface LayerSpec {
    shapes: PlacedShape[];
    /** Places along the sky; a layer with n eighths fills n/8 of them. */
    slots: number;
    scale: [number, number];
    y: [number, number];
    duration: number;
}

const SPECS: Record<Exclude<CloudType, 'nimbostratus'>, LayerSpec> = {
    cirrus: { shapes: ['cirrusA', 'cirrusB', 'cirrusC'], slots: 6, scale: [1, 1.6], y: [-10, 60], duration: 460 },
    cirrocumulus: { shapes: ['cirrocumulusA', 'cirrocumulusB'], slots: 5, scale: [1, 1.4], y: [30, 110], duration: 380 },
    altocumulus: { shapes: ['altoLump', 'altoBand'], slots: 7, scale: [0.9, 1.3], y: [40, 130], duration: 300 },
    cumulus: { shapes: ['fairSmall', 'cumMed', 'cumTower'], slots: 5, scale: [0.85, 1.1], y: [60, 170], duration: 230 },
    stratocumulus: { shapes: ['stratoLump', 'stratoRoll'], slots: 8, scale: [1.1, 1.5], y: [90, 190], duration: 170 },
};

const SEEDS: Record<CloudType, number> = {
    cirrus: 1,
    cirrocumulus: 2,
    altocumulus: 3,
    cumulus: 4,
    stratocumulus: 5,
    nimbostratus: 6,
};

const between = ([from, to]: [number, number], value: number) => from + (to - from) * value;

/** Which `count` of `slots` places hold a cloud; the rest are the gaps. */
const filledSlots = (slots: number, count: number, next: () => number): number[] =>
    Array.from({ length: slots }, (_, index) => index)
        .sort(() => next() - 0.5)
        .slice(0, count)
        .sort((a, b) => a - b);

const layerOf = (type: Exclude<CloudType, 'nimbostratus'>, oktas: Oktas): CloudLayer => {
    const spec = SPECS[type];
    const next = random(SEEDS[type] * 100 + oktas);
    const count = Math.ceil((oktas / 8) * spec.slots);
    const clouds = filledSlots(spec.slots, count, next).map((slot) => ({
        shape: spec.shapes[Math.floor(next() * spec.shapes.length)],
        x: ((slot + 0.1 + next() * 0.8) / spec.slots) * SKY_WIDTH - 150,
        y: between(spec.y, next()),
        scale: between(spec.scale, next()),
    }));

    return { type, oktas, clouds, duration: spec.duration };
};

/** Low clouds: separate cumulus while the sky is mostly open, stratocumulus lumps once it closes up. */
const lowType = (oktas: Oktas): 'cumulus' | 'stratocumulus' => (oktas <= 2 ? 'cumulus' : 'stratocumulus');

/** Rain falls from a nimbostratus deck, which is at least almost closed. */
const NIMBOSTRATUS_OKTAS: Record<Exclude<Rain, 'none'>, Oktas> = { light: 6, steady: 7, heavy: 8 };

const cache = new Map<string, CloudLayer[]>();

/**
 * The cloud layers of a sky, back to front: high (cirrus, cirrocumulus), mid (altocumulus), the
 * nimbostratus deck where it rains, low (cumulus or stratocumulus). Layers without cloud are left out.
 * Placed with fixed seeds, so the same sky always looks the same.
 */
export const layersFor = ({ high, mid, low }: Sky, rain: Rain = 'none'): CloudLayer[] => {
    const key = `${high}${mid}${low}${rain}`;
    let layers = cache.get(key);

    if (!layers) {
        layers = [];

        if (high > 0) {
            layers.push(layerOf('cirrus', high));
        }

        if (high >= 3) {
            layers.push(layerOf('cirrocumulus', high));
        }

        if (mid > 0) {
            layers.push(layerOf('altocumulus', mid));
        }

        if ('none' !== rain) {
            layers.push({ type: 'nimbostratus', oktas: NIMBOSTRATUS_OKTAS[rain], clouds: [], duration: 360 });
        }

        if (low > 0) {
            layers.push(layerOf(lowType(low), low));
        }

        cache.set(key, layers);
    }

    return layers;
};
