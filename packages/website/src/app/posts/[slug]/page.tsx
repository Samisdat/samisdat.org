import type { Metadata } from 'next';
import { Heading } from '@samisdat/ui-components/Heading';
import { MarkdownServer } from '@/components/Markdown/MarkdownServer';
import { loadPost, getPublishedPostSlugs, getAllPostSlugs } from '@/lib/posts';

const isDev = process.env.NODE_ENV === 'development';
import { notFound } from 'next/navigation';
import path from 'path';

export async function generateMetadata({
    params,
}: {
    params: { slug: string };
}): Promise<Metadata> {
    const { slug } = await params;
    const post = loadPost(slug);

    if (!post || (!isDev && !post.frontmatter.published)) {
        return {};
    }

    return {
        title: post.frontmatter.title,
        ...(post.frontmatter.description && {
            description: post.frontmatter.description,
        }),
    };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const post = loadPost(slug);

    if (!post || (!isDev && !post.frontmatter.published)) {
        return notFound();
    }

    const mdxDir = path.join(process.cwd(), 'content/posts');

    return (
        <>
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
    return slugs.map((slug) => ({ slug }));
}
