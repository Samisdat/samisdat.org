import { describe, expect, it } from 'vitest';

import { skyFromCover } from '../../../lib/sky';
import { isBump, layersFor } from '../cloudLayout';

import type { Cover } from '../../../lib/weather';

/** Top of the highest hill on the panorama (viewBox 0 0 1700 500), measured in the browser. */
const HIGHEST_HILL = 200;

const COVERS: Cover[] = ['light', 'cloudy', 'mostly', 'overcast'];

const bumpsOf = (cover: Cover) =>
    layersFor(skyFromCover(cover)).flatMap(layer =>
        layer.clouds.filter(isBump).map(cloud => ({ type: layer.type, cloud, drift: layer.drift }))
    );

describe('bump lanes', () => {
    it('keeps every cloud above the hills, underside included', () => {
        COVERS.forEach(cover => {
            bumpsOf(cover).forEach(({ cloud }) => {
                expect(cloud.y + cloud.flow.height).toBeLessThan(HIGHEST_HILL);
            });
        });
    });

    it('lets the higher lanes drift faster than the lower ones', () => {
        const lanes = new Map<number, number[]>();

        COVERS.forEach(cover =>
            layersFor(skyFromCover(cover)).forEach(({ drift = [] }) =>
                drift.forEach(({ lane, speed }) => lanes.set(lane, [...(lanes.get(lane) ?? []), speed]))
            )
        );

        const mean = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length;
        const speeds = [...lanes.entries()].sort(([a], [b]) => a - b).map(([, values]) => mean(values));

        speeds.slice(1).forEach((speed, index) => expect(speed).toBeLessThan(speeds[index]));
    });
});
