import path from 'path';

import { Heading } from '@samisdat/ui-components/Heading';

import { MarkdownServer } from '@/components/Markdown/MarkdownServer';
import { PostLayout } from '@/components/PostLayout';

import type { Frontmatter } from '@/lib/posts';

const POSTS_DIR = path.join(process.cwd(), 'content/posts');

interface PostArticleProps {
    slug: string;
    frontmatter: Pick<Frontmatter, 'title' | 'typography'>;
    source: string;
    /** Where the .mdx file lives, defaults to the posts directory. */
    contentDir?: string;
}

/** Renders a post body. Shared by /posts/[slug], the preview route and the sandbox. */
export const PostArticle = ({ slug, frontmatter, source, contentDir = POSTS_DIR }: PostArticleProps) => (
    <PostLayout typography={frontmatter.typography}>
        <Heading level={1}>{frontmatter.title}</Heading>
        <MarkdownServer
            content={source}
            mdxDir={contentDir}
            slug={slug}
        />
    </PostLayout>
);
