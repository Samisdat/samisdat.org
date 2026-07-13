import { MarkdownServer } from '@/components/Markdown/MarkdownServer';
import { Heading } from '@samisdat/ui-components/Heading';

import { faHand } from '@fortawesome/free-regular-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';

import { parseMarkdown } from '@/components/Markdown/compile';
import { getAllPosts, getAllPublishedPosts } from '@/lib/posts';
import { NoNoNo } from '../components/NoNoNo';
import { YesYesYes } from '../components/YesYesYes';

export default async function Home() {
    const slug = 'home';

    const mdxDir = path.join(process.cwd(), 'content');
    const mdxPath = path.join(mdxDir, `${slug}.mdx`);

    const content = await fs.readFile(mdxPath, 'utf-8');

    const { frontmatter } = await parseMarkdown(content);

    return (
        <>
            <Heading>
                <YesYesYes />
                <NoNoNo />
                <FontAwesomeIcon icon={faHand} />
                {frontmatter.title}
            </Heading>
            <MarkdownServer
                content={content}
                slug={slug}
                mdxDir={mdxDir}
            />

            <h2>Posts</h2>
            <ul>
                {(process.env.NODE_ENV === 'development'
                    ? getAllPosts()
                    : getAllPublishedPosts()
                ).map((post) => (
                    <li key={post.slug}>
                        <Link href={`/posts/${post.slug}`}>
                            {post.frontmatter.title}
                        </Link>{' '}
                        <time
                            dateTime={post.frontmatter.date.toISOString()}
                        >
                            {post.frontmatter.date.toLocaleDateString(
                                'de-DE',
                                {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                },
                            )}
                        </time>
                    </li>
                ))}
            </ul>
        </>
    );
}
