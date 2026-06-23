import { compile, run } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';

import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';

import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';

import { getTextMateColorSchema } from '@samisdat/ui-components/utils/getTextMateColorSchema';

import { Frontmatter } from './Frontmatter';

const theme = getTextMateColorSchema('dark');

console.log(theme);

const shikiOptions = {
    theme,
};

interface ParseMarkdownResult {
    MDXContent: React.ComponentType;
    frontmatter: Frontmatter;
}

export const parseMarkdown = async (markdown: string): Promise<ParseMarkdownResult> => {
    if (!markdown || typeof markdown !== 'string') {
        throw new Error('Invalid markdown input: expected non-empty string');
    }

    try {
        const code = String(
            await compile(markdown, {
                outputFormat: 'function-body',
                remarkPlugins: [
                    remarkFrontmatter,
                    // Export frontmatter as named export 'frontmatter'
                    [remarkMdxFrontmatter, { name: 'frontmatter' }],
                    remarkGfm, // GitHub Flavored Markdown (tables, task lists, strikethrough, etc.)
                ],
                rehypePlugins: [
                    rehypeSlug, // Add IDs to headings for deep linking
                    [rehypeAutolinkHeadings, { properties: { className: ['anchor'] } }], // Add clickable anchor links to headings
                    [rehypePrettyCode, shikiOptions], // Syntax highlighting with Shiki
                    rehypeAccessibleEmojis, // Make emojis accessible for screen readers
                ],
            })
        );

        // Run the compiled code with the runtime and get the default export
        const { default: MDXContent, frontmatter } = await run(code, {
            ...runtime,
            baseUrl: import.meta.url,
        });

        return {
            MDXContent,
            frontmatter: (frontmatter ?? {}) as Frontmatter,
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to parse markdown: ${errorMessage}`);
    }
};
