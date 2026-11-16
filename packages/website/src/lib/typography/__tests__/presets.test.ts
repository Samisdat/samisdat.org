import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { PRESET_DATA } from '../data';

// next/font only works inside the Next compiler. Every font export that presets.ts reads becomes a stub declaring
// its own variable; the names are taken from the source so the mock cannot drift from the registry.
vi.mock('../fonts', async () => {
    const { readFileSync } = await import('node:fs');
    const { join } = await import('node:path');
    const source = readFileSync(join(__dirname, '../presets.ts'), 'utf8');
    const names = new Set([...source.matchAll(/\bf\.(\w+)\.variable/g)].map(match => match[1]));
    return Object.fromEntries([...names].map(name => [name, { variable: `cls-${name}` }]));
});

describe('presets', () => {
    let presets: typeof import('../presets');

    beforeEach(async () => {
        presets = await import('../presets');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('resolvePreset', () => {
        it('returns the requested preset', () => {
            expect(presets.resolvePreset('editorial').id).toBe('editorial');
        });

        it.each([undefined, null, ''])('falls back to the default for %j without warning', value => {
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

            expect(presets.resolvePreset(value).id).toBe(presets.DEFAULT_PRESET_ID);
            expect(warn).not.toHaveBeenCalled();
        });

        it('warns and falls back to the default for unknown ids', () => {
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

            expect(presets.resolvePreset('nope').id).toBe(presets.DEFAULT_PRESET_ID);
            expect(warn).toHaveBeenCalledWith(expect.stringContaining('"nope"'));
        });
    });

    describe('fontClasses', () => {
        it('deduplicates classes of fonts sharing a custom property', () => {
            const classes = presets.fontClasses([
                { cssVar: '--ff-inter' },
                { cssVar: '--ff-inter' },
                { cssVar: '--ff-geist' },
            ]);

            expect(classes.split(' ')).toHaveLength(2);
        });

        it('throws for a font nobody registered', () => {
            expect(() => presets.fontClasses([{ cssVar: '--ff-unknown' }])).toThrow('--ff-unknown');
        });
    });

    describe('presetFontClasses', () => {
        it('covers every preset with registered fonts', () => {
            for (const preset of PRESET_DATA) {
                expect(presets.presetFontClasses(preset)).not.toBe('');
            }
        });
    });

    it('ALL_FONT_CLASSES declares at least the classes of every preset', () => {
        const all = new Set(presets.ALL_FONT_CLASSES.split(' '));

        for (const preset of PRESET_DATA) {
            for (const cls of presets.presetFontClasses(preset).split(' ')) {
                expect(all.has(cls)).toBe(true);
            }
        }
    });

    it('getDefaultPreset returns the default preset', () => {
        expect(presets.getDefaultPreset().id).toBe(presets.DEFAULT_PRESET_ID);
    });
});
