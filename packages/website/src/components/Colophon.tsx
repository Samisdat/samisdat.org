import { styled } from '@linaria/react';
import Link from 'next/link';
import { FC, HTMLAttributes } from 'react';

const FooterWrapper = styled.footer`
    padding: var(--space-4, 2rem) 0;
    text-align: center;
    font-size: var(--typo-small-size, 0.875rem);
    color: var(--color-foreground-subtle);

    & a {
        color: var(--color-foreground-subtle);
        text-decoration: underline;
        text-underline-offset: 2px;

        &:hover,
        &:focus-visible {
            color: var(--color-foreground);
        }
    }
`;

export const Colophon: FC<HTMLAttributes<HTMLElement>> = (props) => (
    <FooterWrapper {...props}>
        © {new Date().getFullYear()} samisdat.org · <Link href="/impressum">Impressum</Link>
    </FooterWrapper>
);
