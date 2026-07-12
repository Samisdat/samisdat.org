import { compile, run } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';

import remarkBreaks from 'remark-breaks';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';

import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';

import { getTextMateColorSchema } from '@samisdat/ui-components/utils/getTextMateColorSchema';

import { Frontmatter } from './Frontmatter';
import { remarkSandboxCollector } from './remarkSandboxCollector';

const theme = getTextMateColorSchema('dark');

const shikiOptions = {
    theme,
};

interface ParseMarkdownResult {
    MDXContent: React.ComponentType;
    frontmatter: Frontmatter;
    sandboxNames: string[];
}

export const parseMarkdown = async (markdown: string): Promise<ParseMarkdownResult> => {
    if (!markdown || typeof markdown !== 'string') {
        throw new Error('Invalid markdown input: expected non-empty string');
    }

    try {
        // Collect sandbox names from MDX AST
        const sandboxNames: string[] = [];

        const code = String(
            await compile(markdown, {
                outputFormat: 'function-body',
                remarkPlugins: [
                    remarkFrontmatter,
                    // Export frontmatter as named export 'frontmatter'
                    [remarkMdxFrontmatter, { name: 'frontmatter' }],
                    remarkGfm, // GitHub Flavored Markdown (tables, task lists, strikethrough, etc.)
                    remarkBreaks, // Single newline -> <br>; blank line -> new <p>
                    // Collect sandbox names from <Sandbox name="..." /> elements
                    [remarkSandboxCollector, { sandboxNames }],
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
            sandboxNames,
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to parse markdown: ${errorMessage}`);
    }
};
