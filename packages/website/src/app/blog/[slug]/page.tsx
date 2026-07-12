import { Heading } from '@samisdat/ui-components/Heading';
import { MarkdownServer } from '@/components/Markdown/MarkdownServer';
import { loadPost, getPublishedPostSlugs } from '@/lib/posts';
import { notFound } from 'next/navigation';
import path from 'path';

export default async function PostPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const post = loadPost(slug);

    if (!post || !post.frontmatter.published) {
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
    const slugs = getPublishedPostSlugs();
    return slugs.map((slug) => ({ slug }));
}
