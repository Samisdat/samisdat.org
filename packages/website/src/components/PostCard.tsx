import { styled } from '@linaria/react';
import Image from 'next/image';
import Link from 'next/link';

import type { Post } from '@/lib/posts';
import { Stack } from '@samisdat/ui-components/Stack';
import { breakpoints } from '../../../ui-components/src/tokens/breakpoints';

const Card = styled.article`
    padding-block: 1.5rem;
    border-bottom: 1px solid var(--color-border-muted);
`;

const ImageWrapper = styled.div`
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    border-radius: 4px;

    @media (min-width: ${breakpoints.medium}) {
        aspect-ratio: 3 / 4;
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
            <Stack
                container
                directionSmall="column"
                directionMedium="row"
                sticky
                gap="2rem"
            >
                {imgSrc && (
                    <Stack>
                        <ImageWrapper>
                            <Image
                                src={imgSrc}
                                alt={title}
                                fill
                                sizes="(min-width: 768px) 50vw, 100vw"
                                style={{ objectFit: 'cover' }}
                            />
                        </ImageWrapper>
                    </Stack>
                )}
                <Stack>
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
                </Stack>
            </Stack>
        </Card>
    );
};
