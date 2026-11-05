import { describe, expect, it } from 'vitest';

import { createPreviewToken, isValidPreviewToken } from '../preview';

const SECRET = 'test-secret';

describe('preview.ts', () => {
    it('creates a stable, url-safe token per slug', () => {
        const token = createPreviewToken('foo', SECRET);

        expect(token).toHaveLength(32);
        expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
        expect(createPreviewToken('foo', SECRET)).toBe(token);
        expect(createPreviewToken('bar', SECRET)).not.toBe(token);
    });

    it('accepts the token of the matching slug', () => {
        expect(isValidPreviewToken('foo', createPreviewToken('foo', SECRET), SECRET)).toBe(true);
    });

    it('rejects a token of another slug or another secret', () => {
        expect(isValidPreviewToken('bar', createPreviewToken('foo', SECRET), SECRET)).toBe(false);
        expect(isValidPreviewToken('foo', createPreviewToken('foo', 'other'), SECRET)).toBe(false);
    });

    it('rejects tokens of the wrong length', () => {
        expect(isValidPreviewToken('foo', '', SECRET)).toBe(false);
        expect(isValidPreviewToken('foo', createPreviewToken('foo', SECRET) + 'x', SECRET)).toBe(false);
    });

    it('rejects everything without a secret', () => {
        expect(isValidPreviewToken('foo', createPreviewToken('foo', ''), '')).toBe(false);
        expect(isValidPreviewToken('foo', 'anything', undefined)).toBe(false);
    });
});
