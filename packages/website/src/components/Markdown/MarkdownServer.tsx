import { SandpackFiles } from '@codesandbox/sandpack-react';
import { getSandpackFiles } from '../Sandbox/getSandpackFiles';
import { parseMarkdown } from './compile';
import { Markdown } from './index';

interface MarkdownServerProps {
    content: string;
    slug: string;
    mdxDir?: string;
}

export async function MarkdownServer({ content, slug, mdxDir }: MarkdownServerProps) {
    const { frontmatter, MDXContent, sandboxNames } = await parseMarkdown(content);

    // Preload sandbox files - fail hard if any are missing
    const sandboxFiles: Record<string, SandpackFiles> = {};

    for (const name of sandboxNames) {
        const files = await getSandpackFiles({ slug, name, template: 'react-ts' });
        sandboxFiles[name] = files;
    }

    return (
        <Markdown
            MDXContent={MDXContent}
            slug={slug}
            mdxDir={mdxDir}
            sandboxFiles={sandboxFiles}
        />
    );
}
