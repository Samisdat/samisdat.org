import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/posts', () => ({
    getAllPublishedPosts: () => [
        {
            slug: 'hello',
            frontmatter: { title: 'Hello & welcome', date: new Date('2025-11-17T00:00:00Z') },
        },
    ],
}));

describe('GET /feed.xml', () => {
    it('is served as application/xml so browsers render it instead of showing plain text', async () => {
        const { GET } = await import('../route');

        const response = GET();

        expect(response.headers.get('Content-Type')).toBe('application/xml; charset=utf-8');
    });

    it('escapes post titles in the feed body', async () => {
        const { GET } = await import('../route');

        const body = await GET().text();

        expect(body).toContain('<title>Hello &amp; welcome</title>');
    });
});
