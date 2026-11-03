import { styled } from '@linaria/react';
import Link from 'next/link';
import { FC, HTMLAttributes } from 'react';

const FooterWrapper = styled.footer`
    padding: var(--space-4, 2rem) 0;
    text-align: center;
    font-size: var(--typo-small-size, 0.875rem);
    color: var(--color-text-secondary);

    & a {
        color: var(--color-text-secondary);
        text-decoration: underline;
        text-underline-offset: 2px;

        &:hover,
        &:focus-visible {
            color: var(--color-text-default);
        }
    }
`;

// Evaluated once per server start/build; the footer only shows the year
const YEAR = new Date().getFullYear();

export const Colophon: FC<HTMLAttributes<HTMLElement>> = props => (
    <FooterWrapper {...props}>
        © {YEAR} samisdat.org · <Link href="/impressum">Impressum</Link> · <Link href="/datenschutz">Datenschutz</Link>
    </FooterWrapper>
);
