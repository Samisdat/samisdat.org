import { styled } from '@linaria/react';
import { FC, HTMLAttributes } from 'react';
import Link from 'next/link';

const PostExcerptStyled = styled.article`
    background: lime;
`;

export type PostExcerptProps = HTMLAttributes<HTMLDivElement> & {};
export const PostExcerpt: FC<PostExcerptProps> = ({ children, ...props }) => {
    return (
        <PostExcerptStyled {...props}>
            <header>
                <h2>
                    <Link href="/posts/titel-des-posts">Titel des Posts</Link>
                </h2>
                <time dateTime="2025-10-10">10. Oktober 2025</time>
            </header>
            <p className="excerpt">
                Kurzer Teaser-Text (1–3 Sätze), der klar macht, worum es im Artikel geht.
                {children}
            </p>
            <footer>
                <Link
                    className="read-more"
                    href="/posts/titel-des-posts"
                >
                    Weiterlesen →
                </Link>
            </footer>
        </PostExcerptStyled>
    );
};
