import type { Metadata, Viewport } from 'next';

import { SITE_AUTHOR, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/constants';
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
import { StructuredData } from '@/components/StructuredData';
import '@samisdat/ui-components/globalStyle';
import type { Person, WebSite, WithContext } from 'schema-dts';

const allowIndex = process.env.NEXT_PUBLIC_ALLOW_INDEX === 'true';

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
        canonical: '/',
    },
    robots: {
        index: allowIndex,
        follow: allowIndex,
    },
};

export const viewport: Viewport = {
    themeColor: '#ffffff',
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

const websiteSchema: WithContext<WebSite> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    author: {
        '@type': 'Person',
        name: SITE_AUTHOR,
    },
};

const personSchema: WithContext<Person> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE_AUTHOR,
    url: SITE_URL,
};

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
            <head>
                <StructuredData data={websiteSchema} />
                <StructuredData data={personSchema} />
            </head>
            <body>
                <Scrolling />
                <Page>
                    <WtalPanorama />
                    <Navi />
                    <Container>{children}</Container>
                    <Colophon />
                </Page>
            </body>
        </html>
    );
}
