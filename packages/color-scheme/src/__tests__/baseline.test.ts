import { describe, expect, it } from 'vitest';

import { contrastBaseline, enforcedPairs, isBaseline } from '../baseline';
import { contrastMatrixAll, modes } from '../contrast';

describe('contrast baseline', () => {
    it('recognises recorded ids only', () => {
        const [known] = Object.keys(contrastBaseline);

        if (known) {
            expect(isBaseline(known)).toBe(true);
        }
        expect(isBaseline('dark:nope/nothing')).toBe(false);
    });

    it('only records pairs that exist in the matrix, so a stale baseline entry shows up', () => {
        const ids = new Set(contrastMatrixAll().map(p => p.id));

        for (const id of Object.keys(contrastBaseline)) {
            expect(ids.has(id)).toBe(true);
        }
    });

    it.each(modes)('enforces the %s matrix minus the baseline', mode => {
        const enforced = enforcedPairs(mode);
        const all = contrastMatrixAll().filter(p => p.mode === mode);

        expect(enforced.every(p => p.mode === mode && !isBaseline(p.id))).toBe(true);
        expect(enforced.length + all.filter(p => isBaseline(p.id)).length).toBe(all.length);
    });
});
