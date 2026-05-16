import { compile, run } from '@mdx-js/mdx';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as runtime from 'react/jsx-runtime';

import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';

import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';

import { Frontmatter } from './Frontmatter';

const __dirname = dirname(fileURLToPath(import.meta.url));
const shikiOptions = {
    /*theme: 'tokyo-night',*/
    theme: JSON.parse(readFileSync(join(__dirname, 'samisdat-color-theme.json'), 'utf-8')),
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
