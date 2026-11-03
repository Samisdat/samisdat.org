import path from 'path';

import { Heading } from '@samisdat/ui-components/Heading';
import { notFound } from 'next/navigation';

import { MarkdownServer } from '@/components/Markdown/MarkdownServer';
import { PostLayout } from '@/components/PostLayout';
import { getAllPostSlugs, getPublishedPostSlugs, loadPost } from '@/lib/posts';

import type { Metadata } from 'next';

const isDev = process.env.NODE_ENV === 'development';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
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

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = loadPost(slug);

    if (!post || (!isDev && !post.frontmatter.published)) {
        return notFound();
    }

    const mdxDir = path.join(process.cwd(), 'content/posts');

    return (
        <PostLayout typography={post.frontmatter.typography}>
            <Heading level={1}>{post.frontmatter.title}</Heading>
            <MarkdownServer
                content={post.source}
                mdxDir={mdxDir}
                slug={slug}
            />
        </PostLayout>
    );
}

export async function generateStaticParams() {
    const slugs = isDev ? getAllPostSlugs() : getPublishedPostSlugs();
    return slugs.map(slug => ({ slug }));
}
