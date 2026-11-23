import { describe, expect, it } from 'vitest';

import { PRESET_DATA, presetFontNames, presetFonts, presetSizeStyle, presetStyle } from '../data';
import { PRESET_IDS } from '../ids';

const byId = (id: string) => PRESET_DATA.find(preset => preset.id === id)!;

describe('PRESET_DATA', () => {
    it('has exactly one preset per registered id, in order', () => {
        expect(PRESET_DATA.map(preset => preset.id)).toEqual([...PRESET_IDS]);
    });

    it('resolves sizes for every preset with the body at or above the floor', () => {
        for (const preset of PRESET_DATA) {
            expect(preset.body.size.min).toBeGreaterThanOrEqual(18);
            expect(preset.head.size.max).toBeGreaterThan(preset.head.h2.max);
            expect(preset.head.h2.max).toBeGreaterThan(preset.head.h3.max);
        }
    });
});

describe('presetFonts / presetFontNames', () => {
    it('lists head, body, mono and em fonts in that order', () => {
        const preset = byId('inter');

        expect(presetFonts(preset)).toEqual([preset.head.font, preset.body.font, preset.mono.font, preset.em.font]);
    });

    it('maps the roles to the font display names', () => {
        const preset = byId('inter');
        const names = presetFontNames(preset);

        expect(names.head).toBe(preset.head.font.name);
        expect(names.body).toBe(preset.body.font.name);
        expect(names.mono).toBe(preset.mono.font.name);
        expect(names.em).toBe(preset.em.font.name);
    });
});

describe('presetSizeStyle', () => {
    it('emits one size variable per role, interpolated by --t when fluid', () => {
        const style = presetSizeStyle(byId('inter')) as Record<string, string>;

        expect(Object.keys(style).sort()).toEqual(['--bz', '--h2z', '--h3z', '--hz', '--mz']);
        expect(style['--hz']).toContain('var(--t)');
    });
});

describe('presetStyle', () => {
    it('points the font variables at the fonts custom properties', () => {
        const preset = byId('inter');
        const style = presetStyle(preset) as Record<string, string | number>;

        expect(style['--f-head']).toBe(`var(${preset.head.font.cssVar})`);
        expect(style['--f-body']).toBe(`var(${preset.body.font.cssVar})`);
        expect(style['--f-mono']).toBe(`var(${preset.mono.font.cssVar})`);
        expect(style['--f-em']).toBe(`var(${preset.em.font.cssVar})`);
    });

    it('includes the size variables', () => {
        const preset = byId('inter');

        expect(presetStyle(preset)).toMatchObject(presetSizeStyle(preset));
    });

    it('defaults variations to normal and line height to 1.65', () => {
        const preset = {
            ...byId('inter'),
            head: { ...byId('inter').head, variations: undefined },
            body: { ...byId('inter').body, variations: undefined, lineHeight: undefined },
            mono: { ...byId('inter').mono, variations: undefined },
            em: { ...byId('inter').em, variations: undefined },
        };
        const style = presetStyle(preset) as Record<string, string | number>;

        expect(style['--v-head']).toBe('normal');
        expect(style['--v-body']).toBe('normal');
        expect(style['--v-mono']).toBe('normal');
        expect(style['--v-em']).toBe('normal');
        expect(style['--blh']).toBe(1.65);
    });

    it('passes explicit variations and line height through', () => {
        const base = byId('inter');
        const preset = {
            ...base,
            head: { ...base.head, variations: '"opsz" 32' },
            body: { ...base.body, lineHeight: 1.5 },
        };
        const style = presetStyle(preset) as Record<string, string | number>;

        expect(style['--v-head']).toBe('"opsz" 32');
        expect(style['--blh']).toBe(1.5);
    });
});
