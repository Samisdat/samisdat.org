import { Cover } from '@/lib/weather';

import { CloudShapeName } from './cloudShapes';
import { random } from './random';

export const SKY_WIDTH = 1700;

export interface PlacedCloud {
    shape: CloudShapeName;
    x: number;
    y: number;
    scale: number;
}

export interface CloudLayer {
    clouds: PlacedCloud[];
    /** Seconds for one drift across the sky; the back layer is the slowest. */
    duration: number;
}

interface LayerSpec {
    count: number;
    shapes: CloudShapeName[];
    scale: [number, number];
    y: [number, number];
    duration: number;
}

const SPECS: Record<Cover, LayerSpec[]> = {
    clear: [{ count: 2, shapes: ['cumMed', 'stratus'], scale: [1, 1.15], y: [20, 90], duration: 320 }],
    light: [{ count: 3, shapes: ['fairSmall', 'cumMed'], scale: [0.9, 1.1], y: [30, 150], duration: 240 }],
    cloudy: [
        { count: 5, shapes: ['fairSmall', 'cumMed', 'stratus'], scale: [0.8, 1], y: [20, 140], duration: 260 },
        { count: 4, shapes: ['cumMed', 'cumTower', 'fairSmall'], scale: [0.8, 1], y: [90, 190], duration: 170 },
    ],
    mostly: [
        { count: 6, shapes: ['cumMed', 'stratus'], scale: [1.1, 1.4], y: [-10, 120], duration: 280 },
        { count: 6, shapes: ['cumMed', 'cumTower', 'stratus'], scale: [1.3, 1.7], y: [50, 170], duration: 190 },
        { count: 5, shapes: ['cumMed', 'stratus', 'rain'], scale: [1.5, 1.9], y: [110, 210], duration: 120 },
    ],
    overcast: [
        { count: 8, shapes: ['rain', 'cumMed', 'stratus'], scale: [1.6, 2.2], y: [-30, 100], duration: 300 },
        { count: 8, shapes: ['rain', 'cumMed', 'stratus'], scale: [1.7, 2.3], y: [40, 170], duration: 200 },
        { count: 7, shapes: ['rain', 'cumMed', 'stratus'], scale: [1.8, 2.4], y: [110, 230], duration: 130 },
    ],
};

const between = ([from, to]: [number, number], value: number) => from + (to - from) * value;

const layerOf = (spec: LayerSpec, seed: number): CloudLayer => {
    const next = random(seed);
    const clouds: PlacedCloud[] = [];

    for (let index = 0; index < spec.count; index += 1) {
        const shape = spec.shapes[Math.floor(next() * spec.shapes.length)];

        clouds.push({
            shape,
            x: ((index + 0.1 + next() * 0.8) / spec.count) * SKY_WIDTH - 150,
            y: between(spec.y, next()),
            scale: between(spec.scale, next()),
        });
    }

    return { clouds, duration: spec.duration };
};

const cache = new Map<Cover, CloudLayer[]>();

/** The clouds of a cover, back to front. Placed once with a fixed seed, so a cover always looks the same. */
export const layersFor = (cover: Cover): CloudLayer[] => {
    let layers = cache.get(cover);

    if (!layers) {
        layers = SPECS[cover].map((spec, index) =>
            layerOf(spec, (Object.keys(SPECS).indexOf(cover) + 1) * 100 + index)
        );
        cache.set(cover, layers);
    }

    return layers;
};
