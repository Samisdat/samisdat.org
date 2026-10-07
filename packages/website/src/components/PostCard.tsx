import { styled } from '@linaria/react';
import Image from 'next/image';
import Link from 'next/link';

import { Post } from '@/lib/posts';
import { breakpoints } from '../../../ui-components/src/tokens/breakpoints';

const Card = styled.article`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-block: 1.5rem;
    border-bottom: 1px solid var(--color-border-muted);

    @media (min-width: ${breakpoints.medium}) {
        flex-direction: row;
        align-items: flex-start;
        gap: 2rem;
    }
`;

const ImageWrapper = styled.div`
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    flex-shrink: 0;
    overflow: hidden;
    border-radius: 4px;

    @media (min-width: ${breakpoints.medium}) {
        width: 200px;
        aspect-ratio: 4 / 3;
    }
`;

const Body = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const Title = styled(Link)`
    font-size: var(--typo-h4-size);
    font-weight: bold;
    color: inherit;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`;

const ReadMore = styled(Link)`
    font-size: var(--typo-small-size, 0.875rem);
    color: var(--color-text-subtle);
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`;

const Excerpt = styled.p`
    margin: 0;
    color: var(--color-text-subtle);
`;

const DateEl = styled.time`
    font-size: var(--typo-small-size, 0.875rem);
    color: var(--color-text-subtle);
`;

function resolveImageSrc(slug: string, image: true | string): string {
    return image === true ? `/posts/${slug}/cover.jpg` : image;
}

export const PostCard = ({ post }: { post: Post }) => {
    const { slug, frontmatter } = post;
    const { title, description, date, image } = frontmatter;
    const imgSrc = image !== undefined ? resolveImageSrc(slug, image) : null;

    return (
        <Card>
            {imgSrc && (
                <ImageWrapper>
                    <Image
                        src={imgSrc}
                        alt={title}
                        fill
                        sizes="(min-width: 768px) 200px, 100vw"
                        style={{ objectFit: 'cover' }}
                    />
                </ImageWrapper>
            )}
            <Body>
                <Title href={`/posts/${slug}`}>{title}</Title>
                {description && <Excerpt>{description}</Excerpt>}
                <DateEl dateTime={date.toISOString()}>
                    {date.toLocaleDateString('de-DE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}
                </DateEl>
                <ReadMore href={`/posts/${slug}`}>Read more</ReadMore>
            </Body>
        </Card>
    );
};
