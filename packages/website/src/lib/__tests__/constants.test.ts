import { afterEach, describe, expect, it, vi } from 'vitest';

describe('constants', () => {
    afterEach(() => {
        vi.unstubAllEnvs();
        vi.resetModules();
    });

    it('falls back to the production URL when NEXT_PUBLIC_SITE_URL is unset', async () => {
        vi.stubEnv('NEXT_PUBLIC_SITE_URL', undefined as unknown as string);
        vi.resetModules();

        const { SITE_URL } = await import('../constants');

        expect(SITE_URL).toBe('https://samisdat.org');
    });

    it('takes the site URL from NEXT_PUBLIC_SITE_URL when set', async () => {
        vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'http://localhost:3000');
        vi.resetModules();

        const { SITE_URL } = await import('../constants');

        expect(SITE_URL).toBe('http://localhost:3000');
    });
});
