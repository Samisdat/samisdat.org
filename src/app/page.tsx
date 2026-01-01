import { Heading } from '@/components/Heading';

import { faHand } from '@fortawesome/free-regular-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Markdown } from '@/components/Markdown';
import { Frontmatter, serialize } from '@/components/Markdown/serialise';
import { promises as fs } from 'fs';
import path from 'path';

export default async function Home() {
    const slug = 'home';

    const mdxDir = path.join(process.cwd(), 'content');
    const mdxPath = path.join(mdxDir, `${slug}.mdx`);

    const content = await fs.readFile(mdxPath, 'utf-8');

    const serializedSource = await serialize(content);
    const frontmatter = serializedSource.frontmatter as unknown as Frontmatter;

    return (
        <>
            <Heading>
                <FontAwesomeIcon icon={faHand} />
                {frontmatter.title}
            </Heading>
            <Markdown
                serializedSource={serializedSource}
                mdxDir={mdxDir}
                slug={slug}
            />
        </>
    );
}
