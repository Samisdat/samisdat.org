import { PostArticle } from '@/components/PostArticle';
import { loadPost } from '@/lib/posts';
import { isValidPreviewToken } from '@/lib/preview';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

// Rendered per request: the token is checked on the server, nothing is prebuilt.
export const dynamic = 'force-dynamic';

interface PreviewParams {
    params: Promise<{ slug: string; token: string }>;
}

const loadPreview = async (params: PreviewParams['params']) => {
    const { slug, token } = await params;

    if (!isValidPreviewToken(slug, token)) {
        return null;
    }

    const post = loadPost(slug);
    return post ? { slug, post } : null;
};

export async function generateMetadata({ params }: PreviewParams): Promise<Metadata> {
    const preview = await loadPreview(params);

    return {
        ...(preview && { title: `Vorschau: ${preview.post.frontmatter.title}` }),
        robots: { index: false, follow: false, nocache: true },
        referrer: 'no-referrer',
    };
}

export default async function PreviewPage({ params }: PreviewParams) {
    const preview = await loadPreview(params);

    if (!preview) {
        return notFound();
    }

    return (
        <PostArticle
            slug={preview.slug}
            {...preview.post}
        />
    );
}
