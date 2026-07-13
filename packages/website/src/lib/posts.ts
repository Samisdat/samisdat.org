import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import { z } from 'zod';

const POSTS_DIR = path.join(process.cwd(), 'content/posts');

// ---------------------------------------------------------------------------
// Frontmatter schema
// ---------------------------------------------------------------------------

export const frontmatterSchema = z.object({
    title: z.string().min(1, 'title must not be empty'),
    date: z.coerce.date({ message: 'date must be a valid ISO date string' }),
    published: z.boolean({ message: 'published must be a boolean' }),
    description: z.string().optional(),
});

export type Frontmatter = z.infer<typeof frontmatterSchema>;

// ---------------------------------------------------------------------------
// Post type
// ---------------------------------------------------------------------------

export interface Post {
    slug: string;
    frontmatter: Frontmatter;
    /** Raw .mdx source including the frontmatter block (needed by parseMarkdown). */
    source: string;
}

// ---------------------------------------------------------------------------
// Cache – each .mdx file is read & parsed at most once per process
// ---------------------------------------------------------------------------

interface CacheEntry {
    frontmatter: Frontmatter;
    /** Raw .mdx source including the frontmatter block (needed by parseMarkdown). */
    source: string;
}

const postCache = new Map<string, CacheEntry>();

/**
 * Load a single post by slug. Reads the file once, validates frontmatter
 * with zod, and caches the result for the lifetime of the process.
 *
 * Returns `null` when the slug has no matching .mdx file.
 * Throws a `ZodError` when frontmatter is invalid (= build-time error).
 */
export const loadPost = (slug: string): CacheEntry | null => {
    if (postCache.has(slug)) {
        return postCache.get(slug)!;
    }

    const fullPath = path.join(POSTS_DIR, `${slug}.mdx`);

    if (!fs.existsSync(fullPath)) {
        return null;
    }

    const raw = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(raw);

    const frontmatter = frontmatterSchema.parse(data);

    const entry: CacheEntry = { frontmatter, source: raw };
    postCache.set(slug, entry);

    return entry;
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Get all post slugs (including unpublished).
 */
export const getAllPostSlugs = (): string[] => {
    const files = fs.readdirSync(POSTS_DIR);
    return files.filter((f) => f.endsWith('.mdx')).map((f) => f.replace(/\.mdx$/, ''));
};

/**
 * Get all published posts, sorted by date descending.
 * Each file is read exactly once thanks to `loadPost` caching.
 */
export const getAllPublishedPosts = (): Post[] => {
    const slugs = getAllPostSlugs();

    return slugs
        .map((slug) => {
            const entry = loadPost(slug)!;
            return { slug, ...entry };
        })
        .filter((post) => post.frontmatter.published === true)
        .sort((a, b) => b.frontmatter.date.getTime() - a.frontmatter.date.getTime());
};

/**
 * Get only published post slugs.
 */
export const getPublishedPostSlugs = (): string[] => {
    return getAllPublishedPosts().map((p) => p.slug);
};

/**
 * Get latest published posts.
 */
export const getLatestPosts = (limit: number = 10): Post[] => {
    return getAllPublishedPosts().slice(0, limit);
};
