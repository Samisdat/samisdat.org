import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Heading } from '@samisdat/ui-components/Heading';

import { PostLayout } from '@/components/PostLayout';
import { getAllSandboxEntries, isSandboxEnabled } from '@/lib/sandbox';

import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sandbox',
    robots: { index: false, follow: false },
};

export default function SandboxIndex() {
    if (!isSandboxEnabled()) {
        return notFound();
    }

    return (
        <PostLayout>
            <Heading level={1}>Sandbox</Heading>
            <ul>
                {getAllSandboxEntries().map(({ slug, frontmatter }) => (
                    <li key={slug}>
                        <Link href={`/sandbox/${slug}`}>{frontmatter.title}</Link>
                    </li>
                ))}
            </ul>
        </PostLayout>
    );
}
