import { Heading } from '@/components/Heading';

import { faHand } from '@fortawesome/free-regular-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { promises as fs } from 'fs';
import path from 'path';

import {parseMarkdown} from "../components/Markdown/compile";

export default async function Home() {
    const slug = 'home';

    const mdxDir = path.join(process.cwd(), 'content');
    const mdxPath = path.join(mdxDir, `${slug}.mdx`);

    const content = await fs.readFile(mdxPath, 'utf-8');

    const {frontmatter, MDXContent} = await parseMarkdown(content);

    return (
        <>

            <Heading>
                <FontAwesomeIcon icon={faHand} />
                {frontmatter.title}
            </Heading>
            <MDXContent
            />
        </>
    );
}
