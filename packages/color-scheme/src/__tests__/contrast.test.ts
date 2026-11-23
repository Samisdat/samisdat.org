import { describe, expect, it } from 'vitest';

import {
    borderPairs,
    contrastMatrix,
    contrastMatrixAll,
    MIN_BORDER,
    MIN_TEXT,
    modes,
    SYNTAX_BACKGROUND,
    syntaxBackgrounds,
    syntaxForegrounds,
    syntaxPairs,
    tokensOf,
} from '../contrast';

describe.each(modes)('contrast matrix (%s)', mode => {
    const tokens = tokensOf(mode);
    const byId = new Map(tokens.map(t => [t.id, t]));

    it('flattens the token file into dotted ids with raw values', () => {
        expect(byId.get('surface.default')?.value).toMatch(/^\{color\./);
        expect(tokens.every(t => !t.id.includes('$') && t.id !== '')).toBe(true);
    });

    it('builds only pairs of this mode with a matching id', () => {
        for (const pair of contrastMatrix(mode)) {
            expect(pair.mode).toBe(mode);
            expect(pair.id).toBe(`${mode}:${pair.foreground}/${pair.background}`);
        }
    });

    it('uses the text minimum for text pairs and the non-text minimum for borders only', () => {
        for (const pair of contrastMatrix(mode)) {
            const isBorder = pair.foreground.startsWith('border.');
            expect(pair.min).toBe(isBorder ? MIN_BORDER : MIN_TEXT);
        }
    });

    it('has no duplicate pairs', () => {
        const ids = contrastMatrix(mode).map(p => p.id);

        expect(new Set(ids).size).toBe(ids.length);
    });

    it('never uses a token marked exempt on either side', () => {
        const exempt = new Set(tokens.filter(t => t.exempt).map(t => t.id));

        for (const pair of contrastMatrix(mode)) {
            expect(exempt.has(pair.foreground)).toBe(false);
            expect(exempt.has(pair.background)).toBe(false);
        }
    });

    it('checks the neutral text on every surface that declares a text tier', () => {
        const pairs = contrastMatrix(mode);
        const tiered = tokens.filter(t => t.textTier && !t.exempt);

        expect(tiered.length).toBeGreaterThan(0);
        for (const surface of tiered) {
            for (const fg of ['text.default', 'text.emphasis']) {
                expect(pairs.some(p => p.foreground === fg && p.background === surface.id)).toBe(true);
            }
        }
    });

    it('limits neutral-only surfaces to the neutral text', () => {
        const pairs = contrastMatrix(mode);

        for (const surface of tokens.filter(t => t.textTier === 'neutral-only' && !t.exempt)) {
            const fgs = pairs.filter(p => p.background === surface.id && p.min === MIN_TEXT).map(p => p.foreground);

            expect(fgs.sort()).toEqual(['text.default', 'text.emphasis']);
        }
    });

    it('checks ink foregrounds only on full and ink tier surfaces', () => {
        const pairs = contrastMatrix(mode).filter(p => p.foreground.startsWith('ink.'));

        for (const pair of pairs) {
            expect(['full', 'ink']).toContain(byId.get(pair.background)?.textTier);
        }
    });

    describe('borderPairs', () => {
        it('checks the strong borders against the page surface at 3:1', () => {
            const pairs = borderPairs(mode);

            expect(pairs.length).toBeGreaterThan(0);
            for (const pair of pairs) {
                expect(['border.strong', 'border.focus']).toContain(pair.foreground);
                expect(pair.background).toBe('surface.default');
                expect(pair.min).toBe(3);
            }
        });
    });

    describe('syntax pairs', () => {
        it('uses every syntax token except the background as foreground', () => {
            const fgs = syntaxForegrounds(mode).map(t => t.id);

            expect(fgs.length).toBeGreaterThan(0);
            expect(fgs).not.toContain(SYNTAX_BACKGROUND);
            expect(fgs.every(id => id.startsWith('syntax.'))).toBe(true);
        });

        it('checks against the code block, the page and the ink-tier surfaces', () => {
            const backgrounds = syntaxBackgrounds(mode);

            expect(backgrounds.slice(0, 2)).toEqual([SYNTAX_BACKGROUND, 'surface.default']);
            for (const id of backgrounds.slice(2)) {
                expect(byId.get(id)?.textTier).toBe('ink');
            }
        });

        it('pairs every foreground with every background', () => {
            expect(syntaxPairs(mode)).toHaveLength(syntaxForegrounds(mode).length * syntaxBackgrounds(mode).length);
        });

        it('is part of the matrix', () => {
            const ids = new Set(contrastMatrix(mode).map(p => p.id));

            for (const pair of syntaxPairs(mode)) {
                expect(ids.has(pair.id)).toBe(true);
            }
        });
    });
});

describe('contrastMatrixAll', () => {
    it('concatenates the matrices of all modes in order', () => {
        expect(contrastMatrixAll()).toEqual(modes.flatMap(mode => contrastMatrix(mode)));
    });
});
