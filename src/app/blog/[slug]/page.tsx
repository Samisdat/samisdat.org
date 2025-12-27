import { Heading } from '@/components/Heading';
import { Markdown } from '@/components/Markdown';
import { Frontmatter, serialize } from '@/components/Markdown/serialise';
import fs from 'fs';
import { notFound } from 'next/navigation';
import path from 'path';

export default async function PostPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;

    const mdxDir = path.join(process.cwd(), 'content/posts');
    const mdxPath = path.join(mdxDir, `${slug}.mdx`);

    try {
        const content = fs.readFileSync(mdxPath, 'utf-8');

        const serializedSource = await serialize(content);
        const frontmatter = serializedSource.frontmatter as unknown as Frontmatter;

        if (true !== frontmatter.published) {
            return notFound();
        }

        return (
            <>
                <Heading>{frontmatter.title}</Heading>
                <Markdown
                    serializedSource={serializedSource}
                    mdxDir={mdxDir}
                    slug={slug}
                />
            </>
        );
    } catch (err) {}
}

export async function generateStaticParams() {
    const mdxDir = path.join(process.cwd(), 'content/posts');
    const files = fs.readdirSync(mdxDir);

    const mdxFiles = files.filter(f => f.endsWith('.mdx'));

    const params = await Promise.all(
        mdxFiles.map(async filename => {
            const fullPath = path.join(mdxDir, filename);
            const source = fs.readFileSync(fullPath, 'utf8');

            const mdx = await serialize(source);

            if (mdx.frontmatter?.published === true) {
                return {
                    slug: filename.replace(/\.mdx$/, ''),
                };
            }

            return null;
        })
    );

    console.log(params);

    return params.filter(Boolean) as { slug: string }[];
}
