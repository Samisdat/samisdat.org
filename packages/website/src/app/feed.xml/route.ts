import { SITE_AUTHOR, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/constants';
import { getAllPublishedPosts } from '@/lib/posts';

export const dynamic = 'force-static';

function escapeXml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

export function GET() {
    const posts = getAllPublishedPosts();

    const items = posts
        .map(
            post => `    <item>
      <title>${escapeXml(post.frontmatter.title)}</title>
      <link>${SITE_URL}/posts/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/posts/${post.slug}</guid>
      <pubDate>${post.frontmatter.date.toUTCString()}</pubDate>
    </item>`
        )
        .join('\n');

    const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>de</language>
    <managingEditor>${SITE_AUTHOR}</managingEditor>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

    return new Response(feed, {
        headers: {
            'Content-Type': 'application/rss+xml; charset=utf-8',
        },
    });
}
