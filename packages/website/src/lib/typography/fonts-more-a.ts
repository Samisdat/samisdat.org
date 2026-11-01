import localFont from 'next/font/local';

// --- the rest ------------------------------------------------------------------------------

export const fraunces = localFont({
    src: [
        {
            path: '../../../node_modules/@fontsource-variable/fraunces/files/fraunces-latin-opsz-normal.woff2',
            weight: '100 900',
            style: 'normal',
        },
        {
            path: '../../../node_modules/@fontsource-variable/fraunces/files/fraunces-latin-opsz-italic.woff2',
            weight: '100 900',
            style: 'italic',
        },
    ],
    variable: '--ff-fraunces',
    display: 'swap',
    adjustFontFallback: 'Times New Roman',
    fallback: ['Georgia', 'serif'],
    preload: false,
});

export const newsreader = localFont({
    src: [
        {
            path: '../../../node_modules/@fontsource-variable/newsreader/files/newsreader-latin-opsz-normal.woff2',
            weight: '200 800',
            style: 'normal',
        },
        {
            path: '../../../node_modules/@fontsource-variable/newsreader/files/newsreader-latin-opsz-italic.woff2',
            weight: '200 800',
            style: 'italic',
        },
    ],
    variable: '--ff-newsreader',
    display: 'swap',
    adjustFontFallback: 'Times New Roman',
    fallback: ['Georgia', 'serif'],
    preload: false,
});

export const jetbrainsMono = localFont({
    src: [
        {
            path: '../../../node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2',
            weight: '100 800',
            style: 'normal',
        },
    ],
    variable: '--ff-jetbrains-mono',
    display: 'swap',
    adjustFontFallback: false,
    fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
    preload: false,
});

export const ibmPlexSans = localFont({
    src: [
        {
            path: '../../../node_modules/@fontsource-variable/ibm-plex-sans/files/ibm-plex-sans-latin-wght-normal.woff2',
            weight: '100 700',
            style: 'normal',
        },
    ],
    variable: '--ff-ibm-plex-sans',
    display: 'swap',
    adjustFontFallback: 'Arial',
    fallback: ['system-ui', '-apple-system', 'sans-serif'],
    preload: false,
});

export const ibmPlexSerif = localFont({
    src: [
        {
            path: '../../../node_modules/@fontsource/ibm-plex-serif/files/ibm-plex-serif-latin-400-normal.woff2',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../../../node_modules/@fontsource/ibm-plex-serif/files/ibm-plex-serif-latin-600-normal.woff2',
            weight: '600',
            style: 'normal',
        },
        {
            path: '../../../node_modules/@fontsource/ibm-plex-serif/files/ibm-plex-serif-latin-400-italic.woff2',
            weight: '400',
            style: 'italic',
        },
    ],
    variable: '--ff-ibm-plex-serif',
    display: 'swap',
    adjustFontFallback: 'Times New Roman',
    fallback: ['Georgia', 'serif'],
    preload: false,
});

export const ibmPlexMono = localFont({
    src: [
        {
            path: '../../../node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../../../node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-600-normal.woff2',
            weight: '600',
            style: 'normal',
        },
    ],
    variable: '--ff-ibm-plex-mono',
    display: 'swap',
    adjustFontFallback: false,
    fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
    preload: false,
});

export const schibstedGrotesk = localFont({
    src: [
        {
            path: '../../../node_modules/@fontsource-variable/schibsted-grotesk/files/schibsted-grotesk-latin-wght-normal.woff2',
            weight: '400 900',
            style: 'normal',
        },
    ],
    variable: '--ff-schibsted-grotesk',
    display: 'swap',
    adjustFontFallback: 'Arial',
    fallback: ['system-ui', '-apple-system', 'sans-serif'],
    preload: false,
});

export const instrumentSans = localFont({
    src: [
        {
            path: '../../../node_modules/@fontsource-variable/instrument-sans/files/instrument-sans-latin-wght-normal.woff2',
            weight: '400 700',
            style: 'normal',
        },
        {
            path: '../../../node_modules/@fontsource-variable/instrument-sans/files/instrument-sans-latin-wght-italic.woff2',
            weight: '400 700',
            style: 'italic',
        },
    ],
    variable: '--ff-instrument-sans',
    display: 'swap',
    adjustFontFallback: 'Arial',
    fallback: ['system-ui', '-apple-system', 'sans-serif'],
    preload: false,
});

export const instrumentSerif = localFont({
    src: [
        {
            path: '../../../node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../../../node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2',
            weight: '400',
            style: 'italic',
        },
    ],
    variable: '--ff-instrument-serif',
    display: 'swap',
    adjustFontFallback: 'Times New Roman',
    fallback: ['Georgia', 'serif'],
    preload: false,
});

export const martianMono = localFont({
    src: [
        {
            path: '../../../node_modules/@fontsource-variable/martian-mono/files/martian-mono-latin-wght-normal.woff2',
            weight: '100 800',
            style: 'normal',
        },
    ],
    variable: '--ff-martian-mono',
    display: 'swap',
    adjustFontFallback: false,
    fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
    preload: false,
});

export const bricolageGrotesque = localFont({
    src: [
        {
            path: '../../../node_modules/@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-opsz-normal.woff2',
            weight: '200 800',
            style: 'normal',
        },
    ],
    variable: '--ff-bricolage-grotesque',
    display: 'swap',
    adjustFontFallback: 'Arial',
    fallback: ['system-ui', '-apple-system', 'sans-serif'],
    preload: false,
});
