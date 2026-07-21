import { MarkdownServer } from '@/components/Markdown/MarkdownServer';
import { StructuredData } from '@/components/StructuredData';
import { SITE_AUTHOR, SITE_URL } from '@/lib/constants';
import { getAllPostSlugs, getPublishedPostSlugs, loadPost } from '@/lib/posts';
import { Heading } from '@samisdat/ui-components/Heading';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import path from 'path';
import type { BlogPosting, WithContext } from 'schema-dts';

const isDev = process.env.NODE_ENV === 'development';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const { slug } = await params;
    const post = loadPost(slug);

    if (!post || (!isDev && !post.frontmatter.published)) {
        return {};
    }

    const postUrl = `${SITE_URL}/posts/${slug}`;

    return {
        title: post.frontmatter.title,
        ...(post.frontmatter.description && {
            description: post.frontmatter.description,
        }),
        alternates: {
            canonical: postUrl,
        },
    };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const post = loadPost(slug);

    if (!post || (!isDev && !post.frontmatter.published)) {
        return notFound();
    }

    const mdxDir = path.join(process.cwd(), 'content/posts');
    const postUrl = `${SITE_URL}/posts/${slug}`;

    const blogPostingSchema: WithContext<BlogPosting> = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.frontmatter.title,
        datePublished: post.frontmatter.date.toISOString(),
        author: {
            '@type': 'Person',
            name: SITE_AUTHOR,
        },
        url: postUrl,
        ...(post.frontmatter.description && {
            description: post.frontmatter.description,
        }),
    };

    return (
        <>
            <StructuredData data={blogPostingSchema} />
            <Heading>{post.frontmatter.title}</Heading>
            <MarkdownServer
                content={post.source}
                mdxDir={mdxDir}
                slug={slug}
            />
        </>
    );
}

export async function generateStaticParams() {
    const slugs = isDev ? getAllPostSlugs() : getPublishedPostSlugs();
    return slugs.map(slug => ({ slug }));
}
