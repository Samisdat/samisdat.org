import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize as serializeMdx } from 'next-mdx-remote/serialize';
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

const shikiOptions = {
    theme: 'vitesse-light',
};

export interface Frontmatter {
    title: string;
    date: string;
    published: boolean;
}

export const serialize = async (source: string) => {
    const parsed: MDXRemoteSerializeResult<Frontmatter, Record<string, unknown>> = await serializeMdx<Frontmatter>(
        source,
        {
            parseFrontmatter: true,
            mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                    rehypeSlug,
                    [rehypeAutolinkHeadings, { properties: { className: ['anchor'] } }],
                    [rehypePrettyCode, shikiOptions],
                    rehypeAccessibleEmojis,
                ],
            },
        }
    );

    return parsed;
};
