import { Heading } from '@/components/Heading';
import { Markdown } from '@/components/Markdown';
import { parseMarkdown } from '@/components/Markdown/compile';
import { getPostContent, getPublishedPostSlugs } from '@/lib/posts';
import { notFound } from 'next/navigation';
import path from 'path';

export default async function PostPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;

    try {
        const content = getPostContent(slug);
        const { frontmatter, MDXContent } = await parseMarkdown(content);

        if (!frontmatter.published) {
            return notFound();
        }

        const mdxDir = path.join(process.cwd(), 'content/posts');

        return (
            <>
                <Heading>{frontmatter.title}</Heading>
                <Markdown
                    MDXContent={MDXContent}
                    mdxDir={mdxDir}
                    slug={slug}
                />
            </>
        );
    } catch (err) {
        return notFound();
    }
}

export async function generateStaticParams() {
    const slugs = getPublishedPostSlugs();
    return slugs.map(slug => ({ slug }));
}
