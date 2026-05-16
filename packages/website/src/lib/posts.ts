import { Frontmatter } from '@/components/Markdown/Frontmatter';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

const POSTS_DIR = path.join(process.cwd(), 'content/posts');

export interface Post {
    slug: string;
    frontmatter: Frontmatter;
    content: string;
}

/**
 * Get all post slugs (including unpublished)
 */
export const getAllPostSlugs = (): string[] => {
    const files = fs.readdirSync(POSTS_DIR);
    return files.filter(f => f.endsWith('.mdx')).map(f => f.replace(/\.mdx$/, ''));
};

/**
 * Get only published post slugs
 */
export const getPublishedPostSlugs = (): string[] => {
    const slugs = getAllPostSlugs();
    return slugs.filter(slug => {
        const frontmatter = getPostFrontmatter(slug);
        return frontmatter.published === true;
    });
};

/**
 * Get frontmatter for a specific post (fast - doesn't parse full MDX)
 */
export const getPostFrontmatter = (slug: string): Frontmatter => {
    const fullPath = path.join(POSTS_DIR, `${slug}.mdx`);

    if (!fs.existsSync(fullPath)) {
        throw new Error(`Post not found: ${slug}`);
    }

    const source = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(source);

    return data as Frontmatter;
};

/**
 * Get raw MDX content for a specific post
 */
export const getPostContent = (slug: string): string => {
    const fullPath = path.join(POSTS_DIR, `${slug}.mdx`);

    if (!fs.existsSync(fullPath)) {
        throw new Error(`Post not found: ${slug}`);
    }

    return fs.readFileSync(fullPath, 'utf8');
};

/**
 * Get all published posts with frontmatter
 */
export const getAllPublishedPosts = (): Post[] => {
    const slugs = getPublishedPostSlugs();

    return slugs
        .map(slug => {
            const frontmatter = getPostFrontmatter(slug);
            const content = getPostContent(slug);

            return {
                slug,
                frontmatter,
                content,
            };
        })
        .sort((a, b) => {
            // Sort by date descending
            return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime();
        });
};

/**
 * Get latest published posts
 */
export const getLatestPosts = (limit: number = 10): Post[] => {
    const allPosts = getAllPublishedPosts();
    return allPosts.slice(0, limit);
};
