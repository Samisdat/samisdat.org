import { describe, expect, it } from 'vitest';

import { captureName, captures } from '../textmate-scopes';

describe('captureName', () => {
    it('replaces every dot, since DTCG does not allow a token to be a group at once', () => {
        expect(captureName('tag.attribute')).toBe('tag-attribute');
        expect(captureName('a.b.c')).toBe('a-b-c');
        expect(captureName('keyword')).toBe('keyword');
    });
});

describe('captures', () => {
    it('has unique capture names and non-empty scope lists', () => {
        const names = captures.map(c => c.capture);

        expect(new Set(names).size).toBe(names.length);
        for (const c of captures) {
            expect(c.scopes.length).toBeGreaterThan(0);
        }
    });

    it('maps to unique token names', () => {
        const tokens = captures.map(c => captureName(c.capture));

        expect(new Set(tokens).size).toBe(tokens.length);
    });
});
