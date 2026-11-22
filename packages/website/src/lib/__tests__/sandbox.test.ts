import fs from 'fs';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('fs');

const mdx = (date: string, extra = '') => `---\ntitle: T ${date}\ndate: ${date}\n${extra}---\nbody`;

describe('sandbox.ts', () => {
    beforeEach(() => {
        vi.resetModules();
        vi.mocked(fs.existsSync).mockReturnValue(true);
    });

    afterEach(() => {
        vi.unstubAllEnvs();
        vi.clearAllMocks();
    });

    describe('in development', () => {
        beforeEach(() => vi.stubEnv('NODE_ENV', 'development'));

        it('loads an entry without a published flag', async () => {
            const { loadSandboxEntry } = await import('../sandbox');
            vi.mocked(fs.readFileSync).mockReturnValue(mdx('2026-01-01'));

            const entry = loadSandboxEntry('my-test');

            expect(entry?.frontmatter.title).toBe('T 2026-01-01');
            expect(entry?.frontmatter.published).toBeUndefined();
        });

        it('rejects unsafe slugs and missing files', async () => {
            const { loadSandboxEntry } = await import('../sandbox');

            expect(loadSandboxEntry('../secret')).toBeNull();
            vi.mocked(fs.existsSync).mockReturnValue(false);
            expect(loadSandboxEntry('missing')).toBeNull();
        });

        it('throws on invalid frontmatter', async () => {
            const { loadSandboxEntry } = await import('../sandbox');
            vi.mocked(fs.readFileSync).mockReturnValue('---\ndate: 2026-01-01\n---\nx');

            expect(() => loadSandboxEntry('broken')).toThrow();
        });

        it('lists only safe .mdx files, newest first', async () => {
            const { getAllSandboxEntries } = await import('../sandbox');
            vi.mocked(fs.readdirSync).mockReturnValue(['old.mdx', 'README.md', 'Bad_Name.mdx', 'new.mdx'] as any);
            vi.mocked(fs.readFileSync).mockImplementation(file =>
                String(file).endsWith('old.mdx') ? mdx('2025-01-01') : mdx('2026-01-01')
            );

            expect(getAllSandboxEntries().map(entry => entry.slug)).toEqual(['new', 'old']);
        });
    });

    describe.each(['production', 'test'])('in %s', mode => {
        beforeEach(() => vi.stubEnv('NODE_ENV', mode));

        it('serves and lists nothing', async () => {
            const { getAllSandboxSlugs, getAllSandboxEntries, loadSandboxEntry } = await import('../sandbox');
            vi.mocked(fs.readdirSync).mockReturnValue(['a.mdx'] as any);
            vi.mocked(fs.readFileSync).mockReturnValue(mdx('2026-01-01'));

            expect(loadSandboxEntry('a')).toBeNull();
            expect(getAllSandboxSlugs()).toEqual([]);
            expect(getAllSandboxEntries()).toEqual([]);
        });
    });
});
