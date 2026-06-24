import { SandpackFiles } from '@codesandbox/sandpack-react';
import { getSandpackFiles } from '../Sandbox/getSandpackFiles';
import { parseMarkdown } from './compile';
import { Markdown } from './index';

interface MarkdownServerProps {
    content: string;
    slug: string;
    mdxDir?: string;
}

// Extract sandbox names from MDX content
function extractSandboxNames(content: string): string[] {
    // Match both name="..." and name={'...'}
    const sandboxRegex = /<Sandbox[^>]*name\s*=\s*(?:['"]([^'"]+)['"]|\{['"]([^'"]+)['"]\})/g;
    const names: string[] = [];
    let match;

    while ((match = sandboxRegex.exec(content)) !== null) {
        // match[1] for name="...", match[2] for name={'...'}
        names.push(match[1] || match[2]);
    }

    return names;
}

export async function MarkdownServer({ content, slug, mdxDir }: MarkdownServerProps) {
    const { frontmatter, MDXContent } = await parseMarkdown(content);

    // Extract sandbox names and preload files
    const sandboxNames = extractSandboxNames(content);
    const sandboxFiles: Record<string, SandpackFiles> = {};

    for (const name of sandboxNames) {
        try {
            const files = await getSandpackFiles({ slug, name, template: 'react-ts' });
            sandboxFiles[name] = files;
        } catch (err) {
            console.error(`Failed to load sandbox files for ${name}:`, err);
        }
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
