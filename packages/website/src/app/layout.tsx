import type { Metadata } from 'next';
import { Playwrite_NO, Source_Code_Pro, Source_Sans_3, Source_Serif_4 } from 'next/font/google';

import { Colophon } from '@/components/Colophon';

import { Page } from '@/components/Page';
import { Container } from '@samisdat/ui-components/Container';
import { WtalPanorama } from '@samisdat/wtal-panorama';
import '@samisdat/wtal-panorama/style.css';

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

import { Navi } from '@/components/Navi';
import { Scrolling } from '@/components/Scrolling';
import '@samisdat/ui-components/globalStyle';

export const metadata: Metadata = {
    metadataBase: new URL('https://samisdat.org'),
    title: {
        default: 'samisdat',
        template: '%s · samisdat',
    },
    description:
        'Persönliches Blog von Bastian Pertz — Webentwicklung, Fotografie und Wuppertal.',
};

const sourceSerif = Source_Serif_4({
    subsets: ['latin'],
    variable: '--font-serif',
});

const sourceSans = Source_Sans_3({
    subsets: ['latin'],
    variable: '--font-sans',
});

const sourceCode = Source_Code_Pro({
    subsets: ['latin'],
    variable: '--font-code',
});

const playwrite = Playwrite_NO({
    variable: '--font-italic',
    weight: 'variable',
    display: 'swap',
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="de"
            className={`${sourceSerif.variable} ${sourceSans.variable} ${sourceCode.variable} ${playwrite.variable}`}
        >
            <body>
                <Scrolling />
                <Page>
                    <WtalPanorama />
                    <Navi />
                    <Container>{children}</Container>
                </Page>
            </body>
        </html>
    );
}
