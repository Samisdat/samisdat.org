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
        <br />
        Wetterdaten von{' '}
        <a
            href="https://open-meteo.com/"
            rel="noopener"
        >
            Open-Meteo.com
        </a>{' '}
        (
        <a
            href="https://creativecommons.org/licenses/by/4.0/"
            rel="noopener"
        >
            CC BY 4.0
        </a>)
        {' · '}
        Sterne: <a href="https://www.astronexus.com/hyg">HYG-Datenbank</a> (
        <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>,{' '}
        <Link
            href="/stars/LICENSE.txt"
            prefetch={false}
        >
            Änderungen
        </Link>
        )
    </FooterWrapper>
);
