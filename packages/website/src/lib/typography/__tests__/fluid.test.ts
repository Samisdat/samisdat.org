import { describe, expect, it } from 'vitest';

import { PRESET_DATA } from '../data';
import { deriveSizes, fluidCss, sizeAt } from '../fluid';

describe('deriveSizes', () => {
    it('keeps body and h1 as the maximum and the body floor at 16px', () => {
        const sizes = deriveSizes({ head: 60, body: 20, mono: 16 });

        expect(sizes.h1.max).toBe(60);
        expect(sizes.body).toEqual({ min: 16, max: 20 });
        expect(sizes.h1.min).toBe(31.5);
        expect(sizes.h2.max).toBeLessThan(sizes.h1.max);
        expect(sizes.h3.max).toBeLessThan(sizes.h2.max);
    });

    it('lets mono follow the body, but not below 14px', () => {
        expect(deriveSizes({ head: 60, body: 20, mono: 16 }).mono).toEqual({ min: 14, max: 16 });
    });

    it('keeps a body or mono that is already at or below its floor fixed', () => {
        const sizes = deriveSizes({ head: 42, body: 16, mono: 13 });

        expect(sizes.body).toEqual({ min: 16, max: 16 });
        expect(sizes.mono).toEqual({ min: 13, max: 13 });
    });

    it('still makes the heads fluid when the body is fixed', () => {
        const { h1 } = deriveSizes({ head: 42, body: 16, mono: 14 });

        expect(h1.max).toBe(42);
        expect(h1.min).toBeLessThan(h1.max);
    });
});

describe('fluidCss', () => {
    it('emits a plain rem length for a fixed size (root is 20px)', () => {
        expect(fluidCss({ min: 16, max: 16 })).toBe('0.8rem');
    });

    it('interpolates with --t otherwise', () => {
        expect(fluidCss({ min: 16, max: 20 })).toBe('calc(0.8rem + 0.2rem * var(--t))');
    });
});

describe('sizeAt', () => {
    it('is min at progress 0 and max at 1', () => {
        expect(sizeAt({ min: 16, max: 20 }, 0)).toBe(16);
        expect(sizeAt({ min: 16, max: 20 }, 1)).toBe(20);
        expect(sizeAt({ min: 16, max: 20 }, 0.5)).toBe(18);
    });
});

describe('presets', () => {
    it('resolve to fluid sizes whose maxima are the sizes written down', () => {
        const current = PRESET_DATA.find(preset => preset.id === 'current')!;

        expect(current.head.size.max).toBe(60);
        expect(current.body.size).toEqual({ min: 16, max: 20 });
        expect(current.mono.size).toEqual({ min: 14, max: 16 });
    });

    it('never shrink below the body floor or below the mono floor unless fixed below it', () => {
        for (const { body, mono } of PRESET_DATA) {
            expect(body.size.min).toBeLessThanOrEqual(16);
            expect(body.size.min).toBeGreaterThanOrEqual(Math.min(body.size.max, 16));
            expect(mono.size.min).toBeGreaterThanOrEqual(Math.min(mono.size.max, 14));
        }
    });
});
