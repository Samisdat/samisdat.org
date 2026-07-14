import fs from 'fs';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock fs to avoid filesystem dependencies
vi.mock('fs');

describe('posts.ts', () => {
    beforeEach(async () => {
        vi.clearAllMocks();
        // Reset module to clear cache
        vi.resetModules();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('loadPost', () => {
        it('loads and caches a valid post', async () => {
            const { loadPost } = await import('../posts');

            const mockContent = `---
title: Test Post
date: 2024-01-15
published: true
---
# Content`;

            vi.mocked(fs.existsSync).mockReturnValue(true);
            vi.mocked(fs.readFileSync).mockReturnValue(mockContent);

            const result = loadPost('test-post');

            expect(result).toBeDefined();
            expect(result?.frontmatter.title).toBe('Test Post');
            expect(result?.frontmatter.date).toBeInstanceOf(Date);
            expect(result?.frontmatter.published).toBe(true);
            expect(result?.source).toBe(mockContent);

            // Second call should use cache (readFileSync called only once)
            const cached = loadPost('test-post');
            expect(cached).toBe(result);
            expect(fs.readFileSync).toHaveBeenCalledTimes(1);
        });

        it('returns null for non-existent post', async () => {
            const { loadPost } = await import('../posts');

            vi.mocked(fs.existsSync).mockReturnValue(false);

            const result = loadPost('nonexistent');

            expect(result).toBeNull();
            expect(fs.readFileSync).not.toHaveBeenCalled();
        });

        it('throws ZodError for invalid frontmatter - missing title', async () => {
            const { loadPost } = await import('../posts');

            const mockContent = `---
date: 2024-01-15
published: true
---
# Content`;

            vi.mocked(fs.existsSync).mockReturnValue(true);
            vi.mocked(fs.readFileSync).mockReturnValue(mockContent);

            expect(() => loadPost('invalid-post')).toThrow();
        });

        it('throws ZodError for invalid frontmatter - empty title', async () => {
            const { loadPost } = await import('../posts');

            const mockContent = `---
title: ""
date: 2024-01-15
published: true
---
# Content`;

            vi.mocked(fs.existsSync).mockReturnValue(true);
            vi.mocked(fs.readFileSync).mockReturnValue(mockContent);

            expect(() => loadPost('invalid-post')).toThrow('title must not be empty');
        });

        it('throws ZodError for invalid frontmatter - missing date', async () => {
            const { loadPost } = await import('../posts');

            const mockContent = `---
title: Test Post
published: true
---
# Content`;

            vi.mocked(fs.existsSync).mockReturnValue(true);
            vi.mocked(fs.readFileSync).mockReturnValue(mockContent);

            expect(() => loadPost('invalid-post')).toThrow();
        });

        it('throws ZodError for invalid frontmatter - invalid date', async () => {
            const { loadPost } = await import('../posts');

            const mockContent = `---
title: Test Post
date: not-a-date
published: true
---
# Content`;

            vi.mocked(fs.existsSync).mockReturnValue(true);
            vi.mocked(fs.readFileSync).mockReturnValue(mockContent);

            expect(() => loadPost('invalid-post')).toThrow('date must be a valid ISO date string');
        });

        it('throws ZodError for invalid frontmatter - missing published', async () => {
            const { loadPost } = await import('../posts');

            const mockContent = `---
title: Test Post
date: 2024-01-15
---
# Content`;

            vi.mocked(fs.existsSync).mockReturnValue(true);
            vi.mocked(fs.readFileSync).mockReturnValue(mockContent);

            expect(() => loadPost('invalid-post')).toThrow();
        });

        it('throws ZodError for invalid frontmatter - invalid published type', async () => {
            const { loadPost } = await import('../posts');

            const mockContent = `---
title: Test Post
date: 2024-01-15
published: "yes"
---
# Content`;

            vi.mocked(fs.existsSync).mockReturnValue(true);
            vi.mocked(fs.readFileSync).mockReturnValue(mockContent);

            expect(() => loadPost('invalid-post')).toThrow('published must be a boolean');
        });
    });

    describe('getAllPostSlugs', () => {
        it('returns all .mdx files as slugs', async () => {
            const { getAllPostSlugs } = await import('../posts');

            vi.mocked(fs.readdirSync).mockReturnValue([
                'post-one.mdx',
                'post-two.mdx',
                'draft.mdx',
                'readme.md',
                'image.png',
            ] as any);

            const slugs = getAllPostSlugs();

            expect(slugs).toEqual(['post-one', 'post-two', 'draft']);
            expect(slugs).not.toContain('readme');
            expect(slugs).not.toContain('image');
        });

        it('returns empty array when no posts exist', async () => {
            const { getAllPostSlugs } = await import('../posts');

            vi.mocked(fs.readdirSync).mockReturnValue([] as any);

            const slugs = getAllPostSlugs();

            expect(slugs).toEqual([]);
        });
    });

    describe('getAllPublishedPosts', () => {
        it('returns only published posts sorted by date descending', async () => {
            const { getAllPublishedPosts } = await import('../posts');

            vi.mocked(fs.readdirSync).mockReturnValue(['post-a.mdx', 'post-b.mdx', 'post-c.mdx'] as any);

            vi.mocked(fs.existsSync).mockReturnValue(true);

            // Mock different posts with different dates and published status
            vi.mocked(fs.readFileSync).mockImplementation((filePath: any) => {
                if (filePath.includes('post-a.mdx')) {
                    return `---
title: Post A
date: 2024-01-15
published: true
---
# Content A`;
                }
                if (filePath.includes('post-b.mdx')) {
                    return `---
title: Post B
date: 2024-03-20
published: true
---
# Content B`;
                }
                if (filePath.includes('post-c.mdx')) {
                    return `---
title: Post C (Draft)
date: 2024-02-10
published: false
---
# Content C`;
                }
                return '';
            });

            const posts = getAllPublishedPosts();

            expect(posts).toHaveLength(2);
            expect(posts[0].slug).toBe('post-b'); // Most recent
            expect(posts[1].slug).toBe('post-a');
            expect(posts.find(p => p.slug === 'post-c')).toBeUndefined(); // Unpublished filtered out
        });

        it('returns empty array when no published posts exist', async () => {
            const { getAllPublishedPosts } = await import('../posts');

            vi.mocked(fs.readdirSync).mockReturnValue(['draft.mdx'] as any);
            vi.mocked(fs.existsSync).mockReturnValue(true);
            vi.mocked(fs.readFileSync).mockReturnValue(`---
title: Draft
date: 2024-01-15
published: false
---
# Content`);

            const posts = getAllPublishedPosts();

            expect(posts).toEqual([]);
        });
    });

    describe('getPublishedPostSlugs', () => {
        it('returns only published post slugs', async () => {
            const { getPublishedPostSlugs } = await import('../posts');

            vi.mocked(fs.readdirSync).mockReturnValue(['post-a.mdx', 'post-b.mdx'] as any);
            vi.mocked(fs.existsSync).mockReturnValue(true);

            vi.mocked(fs.readFileSync).mockImplementation((filePath: any) => {
                if (filePath.includes('post-a.mdx')) {
                    return `---
title: Post A
date: 2024-01-15
published: true
---
# Content A`;
                }
                if (filePath.includes('post-b.mdx')) {
                    return `---
title: Post B
date: 2024-02-10
published: false
---
# Content B`;
                }
                return '';
            });

            const slugs = getPublishedPostSlugs();

            expect(slugs).toEqual(['post-a']);
        });
    });

    describe('getLatestPosts', () => {
        it('returns limited number of latest posts', async () => {
            const { getLatestPosts } = await import('../posts');

            vi.mocked(fs.readdirSync).mockReturnValue(['post-1.mdx', 'post-2.mdx', 'post-3.mdx', 'post-4.mdx'] as any);
            vi.mocked(fs.existsSync).mockReturnValue(true);

            vi.mocked(fs.readFileSync).mockImplementation((filePath: any) => {
                const match = filePath.match(/post-(\d)\.mdx/);
                if (match) {
                    const num = parseInt(match[1], 10);
                    return `---
title: Post ${num}
date: 2024-0${num}-01
published: true
---
# Content ${num}`;
                }
                return '';
            });

            const posts = getLatestPosts(2);

            expect(posts).toHaveLength(2);
            expect(posts[0].slug).toBe('post-4'); // Most recent
            expect(posts[1].slug).toBe('post-3');
        });

        it('uses default limit of 10', async () => {
            const { getLatestPosts } = await import('../posts');

            const mockFiles = Array.from({ length: 15 }, (_, i) => `post-${i + 1}.mdx`);
            vi.mocked(fs.readdirSync).mockReturnValue(mockFiles as any);
            vi.mocked(fs.existsSync).mockReturnValue(true);

            vi.mocked(fs.readFileSync).mockImplementation((filePath: any) => {
                const match = filePath.match(/post-(\d+)\.mdx/);
                if (match) {
                    const num = parseInt(match[1], 10);
                    return `---
title: Post ${num}
date: 2024-${String(num).padStart(2, '0')}-01
published: true
---
# Content ${num}`;
                }
                return '';
            });

            const posts = getLatestPosts();

            expect(posts).toHaveLength(10);
        });
    });
});
