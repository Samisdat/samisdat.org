import type { Metadata } from 'next';

import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/constants';
import { Inter, Inter_Tight, Playwrite_NO, Source_Code_Pro } from 'next/font/google';

import { Colophon } from '@/components/Colophon';

import { Page } from '@/components/Page';
import { Container } from '@samisdat/ui-components/Container';
import { BottomDockContainer, DockProvider, TopDockContainer } from '@samisdat/ui-components/Docks';
import { WtalPanorama } from '@samisdat/wtal-panorama';
import '@samisdat/wtal-panorama/style.css';

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

import { Navi } from '@/components/Navi';
import { Scrolling } from '@/components/Scrolling';
import '@samisdat/ui-components/globalStyle';

export const metadata: Metadata = {
    title: {
        default: SITE_NAME,
        template: `%s · ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    metadataBase: new URL(SITE_URL),
    alternates: {
        types: {
            'application/rss+xml': '/feed.xml',
        },
    },
    robots: {
        index: false,
        follow: false,
    },
};

// Variable fonts: Google serves the full wght axis, next/font cannot narrow it
const inter = Inter({
    subsets: ['latin', 'latin-ext'],
    variable: '--font-heading',
    display: 'swap',
    fallback: ['system-ui', '-apple-system', 'sans-serif'],
});

const interTight = Inter_Tight({
    subsets: ['latin', 'latin-ext'],
    variable: '--font-body',
    style: ['normal', 'italic'],
    display: 'swap',
    fallback: ['system-ui', '-apple-system', 'sans-serif'],
});

// Keywords are set at wght 650, so the variable axis is required
const sourceCode = Source_Code_Pro({
    subsets: ['latin', 'latin-ext'],
    variable: '--font-code',
    display: 'swap',
});

const playwrite = Playwrite_NO({
    variable: '--font-italic',
    weight: '400',
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
            className={`${inter.variable} ${interTight.variable} ${sourceCode.variable} ${playwrite.variable}`}
        >
            <body>
                <Scrolling />
                <DockProvider>
                    <Page>
                        <WtalPanorama />
                        <Navi />
                        <Container>{children}</Container>
                        <Colophon />
                    </Page>
                    <TopDockContainer />
                    <BottomDockContainer />
                </DockProvider>
            </body>
        </html>
    );
}
