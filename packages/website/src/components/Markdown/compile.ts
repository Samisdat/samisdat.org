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

import { getSingletonHighlighter } from 'shiki';
import { remarkScholion } from '@samisdat/scholion/remark';
import { scholionTransformer } from '@samisdat/scholion/transformer';
import { placeholderTransformer } from '@samisdat/scholion/placeholder-transformer'
import { collapseTransformer } from '@samisdat/scholion/collapse-transformer';
import { shikiTheme, styledGrammarLangs } from '@samisdat/ui-components/utils/shikiTheme';

import { Frontmatter } from './Frontmatter';
import { remarkSandboxCollector } from './remarkSandboxCollector';

const shikiOptions = {
    theme: shikiTheme,
    keepBackground: false,
    transformers: [scholionTransformer(), placeholderTransformer(), collapseTransformer()],
    getHighlighter: (options: Parameters<typeof getSingletonHighlighter>[0]) =>
        getSingletonHighlighter({
            ...options,
            langs: [...(options?.langs ?? []), ...styledGrammarLangs],
        }),
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
                    [remarkMdxFrontmatter, { name: 'frontmatter' }],
                    remarkGfm,
                    remarkBreaks,
                    [remarkSandboxCollector, { sandboxNames }],
                    remarkScholion,
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
