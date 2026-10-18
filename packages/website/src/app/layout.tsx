import type { Metadata } from 'next';

import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/constants';
import { inter, interTight, playwriteNo, sourceCodePro } from '@/lib/typography/fonts';

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

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="de"
            className={`${inter.variable} ${interTight.variable} ${sourceCodePro.variable} ${playwriteNo.variable}`}
            // Site chrome keeps the default fonts; posts override them per preset on their own wrapper
            style={
                {
                    '--font-heading': 'var(--ff-inter)',
                    '--font-body': 'var(--ff-inter-tight)',
                    '--font-code': 'var(--ff-source-code-pro)',
                    '--font-italic': 'var(--ff-playwrite-no)',
                } as React.CSSProperties
            }
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
