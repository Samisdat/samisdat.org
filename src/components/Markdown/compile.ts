import { compile, run } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';

import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import { Frontmatter } from './Frontmatter';

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
