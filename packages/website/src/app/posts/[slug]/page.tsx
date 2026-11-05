import { notFound } from 'next/navigation';

import { PostArticle } from '@/components/PostArticle';
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

    return (
        <PostArticle
            slug={slug}
            {...post}
        />
    );
}

export async function generateStaticParams() {
    const slugs = isDev ? getAllPostSlugs() : getPublishedPostSlugs();
    return slugs.map(slug => ({ slug }));
}
