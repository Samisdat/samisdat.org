import { bumpLayer, PlacedBump } from './bumpLayer';
import { random } from './random';
import { ThinShapeName } from './thinShapes';

import type { DriftSeed } from './cloudDrift';
import type { CloudType } from './cloudTypes';
import type { Oktas, Sky } from '@/lib/sky';
import type { Rain } from '@/lib/weather';

export const SKY_WIDTH = 1700;

/** A thin high cloud: one of the fixed cirrus shapes, scaled. */
export interface PlacedThin {
    shape: ThinShapeName;
    x: number;
    y: number;
    scale: number;
}

export type { PlacedBump };

export type PlacedCloud = PlacedThin | PlacedBump;

export const isBump = (cloud: PlacedCloud): cloud is PlacedBump => 'body' in cloud;

export interface CloudLayer {
    type: CloudType;
    /** Cover of this layer in eighths. */
    oktas: Oktas;
    clouds: PlacedCloud[];
    /** Seconds for one drift across the sky; the higher the layer, the slower. */
    duration: number;
    /** How the bump clouds start drifting: in groups, each at its own speed. Layers without it drift as a whole. */
    drift?: DriftSeed[];
}

interface LayerSpec {
    /** Places along the sky; a layer with n eighths fills n/8 of them. */
    slots: number;
    y: [number, number];
    duration: number;
}

/** Cirrus keeps its fixed, scaled streaks; the other types come from the bump generator, which sizes them itself. */
const CIRRUS = { shapes: ['cirrusA', 'cirrusB', 'cirrusC'] as ThinShapeName[], scale: [1, 1.6] as [number, number] };

const SPECS: Record<Exclude<CloudType, 'nimbostratus'>, LayerSpec> = {
    // The highest clouds drift fastest: the wind picks up with the height.
    cirrus: { slots: 6, y: [-10, 60], duration: 120 },
    cirrocumulus: { slots: 5, y: [30, 110], duration: 380 },
    altocumulus: { slots: 7, y: [40, 130], duration: 300 },
    cumulus: { slots: 5, y: [60, 170], duration: 230 },
    stratocumulus: { slots: 8, y: [90, 190], duration: 170 },
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

/**
 * Which `count` of `slots` places hold a cloud; the rest are the gaps. A seeded Fisher-Yates shuffle: sorting with a
 * random comparator gives different orders in Node and in the browser, and the server and the client would place the
 * clouds differently.
 */
const filledSlots = (slots: number, count: number, next: () => number): number[] => {
    const order = Array.from({ length: slots }, (_, index) => index);

    for (let index = order.length - 1; index > 0; index -= 1) {
        const other = Math.floor(next() * (index + 1));

        [order[index], order[other]] = [order[other], order[index]];
    }

    return order.slice(0, count).sort((a, b) => a - b);
};

/** The cirrus streaks of a layer at the given places, each at its own height and scale. */
const cirrusAt = (xs: number[], spec: LayerSpec, next: () => number): PlacedThin[] =>
    xs.map(x => ({
        shape: CIRRUS.shapes[Math.floor(next() * CIRRUS.shapes.length)],
        x,
        y: between(spec.y, next()),
        scale: between(CIRRUS.scale, next()),
    }));

/** The clouds of a layer; their shapes come from the layer's own sequence, so a sky always looks the same. */
const layerOf = (type: Exclude<CloudType, 'nimbostratus'>, oktas: Oktas): CloudLayer => {
    const spec = SPECS[type];
    const next = random(SEEDS[type] * 100 + oktas);
    const count = Math.ceil((oktas / 8) * spec.slots);
    const xs = filledSlots(spec.slots, count, next).map(
        slot => ((slot + 0.1 + next() * 0.8) / spec.slots) * SKY_WIDTH - 150
    );

    if ('cirrus' === type) {
        return { type, oktas, clouds: cirrusAt(xs, spec, next), duration: spec.duration };
    }

    const { clouds, drift } = bumpLayer(type, xs, SKY_WIDTH, next);

    return { type, oktas, clouds, duration: spec.duration, drift };
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
