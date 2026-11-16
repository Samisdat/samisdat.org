import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { HUES, loadScales, STEPS } from '../shared';

describe('loadScales (committed primitives)', () => {
    const scales = loadScales();

    it('has every hue with every step', () => {
        for (const hue of HUES) {
            for (const step of STEPS) {
                expect(scales[hue]?.[step], `${hue}.${step}`).toBeDefined();
            }
        }
    });

    it('does not know any hue outside HUES', () => {
        expect(Object.keys(scales).every(hue => (HUES as readonly string[]).includes(hue))).toBe(true);
    });
});

describe('loadScales (file contents)', () => {
    let dir: string;

    beforeEach(() => {
        dir = mkdtempSync(join(tmpdir(), 'scales-'));
    });

    afterEach(() => {
        rmSync(dir, { recursive: true, force: true });
    });

    const load = (content: unknown) => {
        const file = join(dir, 'p.json');
        writeFileSync(file, JSON.stringify(content));
        return loadScales(pathToFileURL(file));
    };

    it('reads L/C/H per hue and step and treats "none" components as 0', () => {
        const scales = load({
            color: { red: { '500': { $value: { colorSpace: 'oklch', components: [0.6, 'none', 25] } } } },
        });

        expect(scales).toEqual({ red: { 500: { l: 0.6, c: 0, h: 25 } } });
    });

    it('skips $-prefixed groups and tokens, and nodes without a value', () => {
        const scales = load({
            color: {
                $type: 'color',
                red: {
                    $description: 'ignored',
                    '100': { $description: 'no value here' },
                    '200': { $value: { colorSpace: 'oklch', components: [0.9, 0.05, 20] } },
                },
            },
        });

        expect(scales).toEqual({ red: { 200: { l: 0.9, c: 0.05, h: 20 } } });
    });

    it('returns an empty result without a color group', () => {
        expect(load({})).toEqual({});
    });
});
