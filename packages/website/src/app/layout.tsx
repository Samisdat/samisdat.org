import '@samisdat/wtal-panorama/style.css';
import '@fortawesome/fontawesome-svg-core/styles.css';

import { config } from '@fortawesome/fontawesome-svg-core';
import { Container } from '@samisdat/ui-components/Container';
import { BottomDockContainer, DockProvider, TopDockContainer } from '@samisdat/ui-components/Docks';
import { WtalPanorama } from '@samisdat/wtal-panorama';

import { Colophon } from '@/components/Colophon';
import { Page } from '@/components/Page';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/constants';
import { presetSizeStyle } from '@/lib/typography/data';
import { FLUID_ROOT_VARS } from '@/lib/typography/fluid';
import { inter, interTight, playwriteNo, sourceCodePro } from '@/lib/typography/fonts';
import { getDefaultPreset } from '@/lib/typography/presets';

import type { Metadata } from 'next';
config.autoAddCss = false;

import '@samisdat/ui-components/globalStyle';

import { Navi } from '@/components/Navi';
import { Scrolling } from '@/components/Scrolling';

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
            // Site chrome keeps the default fonts and takes the sizes of the default preset (fluid, driven by --t);
            // posts override both per preset on their own wrapper
            style={
                {
                    ...FLUID_ROOT_VARS,
                    ...presetSizeStyle(getDefaultPreset()),
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
