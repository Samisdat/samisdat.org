import { notFound } from 'next/navigation';

import { PostArticle } from '@/components/PostArticle';
import { getAllSandboxSlugs, loadSandboxEntry, SANDBOX_DIR } from '@/lib/sandbox';

import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const entry = loadSandboxEntry(slug);

    return { title: entry?.frontmatter.title, robots: { index: false, follow: false } };
}

export default async function SandboxPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const entry = loadSandboxEntry(slug);

    if (!entry) {
        return notFound();
    }

    return (
        <PostArticle
            contentDir={SANDBOX_DIR}
            {...entry}
        />
    );
}

export async function generateStaticParams() {
    return getAllSandboxSlugs().map(slug => ({ slug }));
}
