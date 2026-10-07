import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/constants';
import { getAllPublishedPosts } from '@/lib/posts';

export default function sitemap(): MetadataRoute.Sitemap {
    const posts = getAllPublishedPosts();

    const postEntries: MetadataRoute.Sitemap = posts.map(post => ({
        url: `${SITE_URL}/posts/${post.slug}`,
        lastModified: post.frontmatter.date,
        changeFrequency: 'monthly',
        priority: 0.8,
    }));

    return [
        {
            url: SITE_URL,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${SITE_URL}/impressum`,
            changeFrequency: 'yearly',
            priority: 0.1,
        },
        {
            url: `${SITE_URL}/datenschutz`,
            changeFrequency: 'yearly',
            priority: 0.1,
        },
        ...postEntries,
    ];
}
