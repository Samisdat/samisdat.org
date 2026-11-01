import { MarkdownServer } from '@/components/Markdown/MarkdownServer';
import { PostLayout } from '@/components/PostLayout';
import type { Frontmatter } from '@/lib/posts';
import { Heading } from '@samisdat/ui-components/Heading';
import path from 'path';

interface PostArticleProps {
    slug: string;
    frontmatter: Frontmatter;
    source: string;
}

/** Renders a post body. Shared by /posts/[slug] and the preview route. */
export const PostArticle = ({ slug, frontmatter, source }: PostArticleProps) => (
    <PostLayout typography={frontmatter.typography}>
        <Heading level={1}>{frontmatter.title}</Heading>
        <MarkdownServer
            content={source}
            mdxDir={path.join(process.cwd(), 'content/posts')}
            slug={slug}
        />
    </PostLayout>
);
