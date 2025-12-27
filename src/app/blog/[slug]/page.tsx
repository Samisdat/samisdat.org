import { Heading } from '@/components/Heading';
import { Markdown } from '@/components/Markdown';
import { serialize } from '@/components/Markdown/serialise';
import { promises as fs } from 'fs';
import { compileMDX } from 'next-mdx-remote/rsc';
import path from 'path';

export default async function ProjectPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;

    console.log(slug);

    const mdxPath = path.join(process.cwd(), 'content/posts', `${slug}.mdx`);

    try {
        const content = await fs.readFile(mdxPath, 'utf-8');

        const serializedSource = await serialize(content);

        return (
            <>
                <Heading>{serializedSource.frontmatter.title}</Heading>
                <Markdown serializedSource={serializedSource} />
            </>
        );
    } catch (err) {}
}
