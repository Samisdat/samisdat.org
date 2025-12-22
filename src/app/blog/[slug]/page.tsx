import { Heading } from '@/components/Heading';
import { promises as fs } from 'fs';
import { compileMDX } from 'next-mdx-remote/rsc';
import path from 'path';

export default async function ProjectPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;

    console.log(slug);

    const mdxPath = path.join(process.cwd(), 'content/posts', `${slug}.mdx`);

    try {
        const content = await fs.readFile(mdxPath, 'utf-8');

        console.log(content);
        const components = {};
        interface Frontmatter {
            title: string;
        }

        const data = await compileMDX<Frontmatter>({
            source: content,
            options: {
                parseFrontmatter: true,
            },
            components,
        });

        console.log(data);

        return (
            <>
                <Heading>{data.frontmatter.title}</Heading>
                {data.content}
            </>
        );
    } catch (err) {}
}
