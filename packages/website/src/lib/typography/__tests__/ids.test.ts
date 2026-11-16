import { describe, expect, it } from 'vitest';

import { DEFAULT_PRESET_ID, isPresetId, PRESET_IDS } from '../ids';

describe('isPresetId', () => {
    it('accepts every registered id', () => {
        for (const id of PRESET_IDS) {
            expect(isPresetId(id)).toBe(true);
        }
    });

    it('rejects unknown strings and non-strings', () => {
        expect(isPresetId('comic-sans')).toBe(false);
        expect(isPresetId('')).toBe(false);
        expect(isPresetId(undefined)).toBe(false);
        expect(isPresetId(null)).toBe(false);
        expect(isPresetId(42)).toBe(false);
    });

    it('keeps the default preset among the registered ids', () => {
        expect(isPresetId(DEFAULT_PRESET_ID)).toBe(true);
    });
});
