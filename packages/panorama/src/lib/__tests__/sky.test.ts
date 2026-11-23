import { describe, expect, it } from 'vitest';

import { layersFor } from '../../components/Clouds/cloudLayout';
import { percentToOktas, skyFromCover, skyFromPercent } from '../sky';
import { COVERS } from '../weather';

describe('percentToOktas', () => {
    it('maps the ends of the scale', () => {
        expect(percentToOktas(0)).toBe(0);
        expect(percentToOktas(1.9)).toBe(0);
        expect(percentToOktas(100)).toBe(8);
        expect(percentToOktas(98)).toBe(8);
    });

    it('rounds to the nearest eighth and keeps 1 and 7 for what is not clear or closed', () => {
        expect(percentToOktas(2)).toBe(1);
        expect(percentToOktas(12.5)).toBe(1);
        expect(percentToOktas(50)).toBe(4);
        expect(percentToOktas(75)).toBe(6);
        expect(percentToOktas(97.9)).toBe(7);
    });

    it('treats anything not finite as clear and never leaves 0-8', () => {
        expect([Number.NaN, Infinity, -Infinity, -5].map(percentToOktas)).toEqual([0, 0, 0, 0]);
        expect(percentToOktas(250)).toBe(8);
    });
});

describe('skyFromPercent', () => {
    it('maps every band on its own', () => {
        expect(skyFromPercent({ low: 100, mid: 50, high: 0 })).toEqual({ low: 8, mid: 4, high: 0 });
    });
});

describe('skyFromCover', () => {
    it('gets denser with every cover', () => {
        const total = COVERS.map(cover => Object.values(skyFromCover(cover)).reduce((sum, okta) => sum + okta, 0));

        expect(total).toEqual([...total].sort((a, b) => a - b));
    });
});

describe('layersFor', () => {
    it('draws no layer for a clear band', () => {
        expect(layersFor({ high: 0, mid: 0, low: 0 })).toEqual([]);
    });

    it('gives each layer its own type, cover and speed, high to low', () => {
        const layers = layersFor({ high: 4, mid: 3, low: 5 });

        expect(layers.map(({ type }) => type)).toEqual(['cirrus', 'cirrocumulus', 'altocumulus', 'stratocumulus']);
        expect(layers.map(({ oktas }) => oktas)).toEqual([4, 4, 3, 5]);
        expect(new Set(layers.map(({ duration }) => duration)).size).toBe(layers.length);
        expect(layers[0].duration).toBeGreaterThan(layers[3].duration);
    });

    it('uses cumulus while the low sky is open, and keeps cirrocumulus for a denser high sky', () => {
        expect(layersFor({ high: 2, mid: 0, low: 2 }).map(({ type }) => type)).toEqual(['cirrus', 'cumulus']);
    });

    it('fills more places with more eighths and leaves gaps below 8', () => {
        const count = (low: 3 | 5 | 7) => layersFor({ high: 0, mid: 0, low })[0].clouds.length;

        expect(count(3)).toBeLessThan(count(5));
        expect(count(5)).toBeLessThan(count(7));
        expect(count(7)).toBeLessThan(8);
    });

    it('adds a nimbostratus deck where it rains', () => {
        const types = layersFor({ high: 0, mid: 4, low: 4 }, 'steady').map(({ type }) => type);

        expect(types).toEqual(['altocumulus', 'nimbostratus', 'stratocumulus']);
    });
});
