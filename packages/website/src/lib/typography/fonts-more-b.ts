import localFont from 'next/font/local';

export const atkinsonNext = localFont({
    src: [
        {
            path: '../../../node_modules/@fontsource-variable/atkinson-hyperlegible-next/files/atkinson-hyperlegible-next-latin-wght-normal.woff2',
            weight: '200 800',
            style: 'normal',
        },
        {
            path: '../../../node_modules/@fontsource-variable/atkinson-hyperlegible-next/files/atkinson-hyperlegible-next-latin-wght-italic.woff2',
            weight: '200 800',
            style: 'italic',
        },
    ],
    variable: '--ff-atkinson-hyperlegible-next',
    display: 'swap',
    adjustFontFallback: 'Arial',
    fallback: ['system-ui', '-apple-system', 'sans-serif'],
    preload: false,
});

export const atkinsonMono = localFont({
    src: [
        {
            path: '../../../node_modules/@fontsource-variable/atkinson-hyperlegible-mono/files/atkinson-hyperlegible-mono-latin-wght-normal.woff2',
            weight: '200 800',
            style: 'normal',
        },
    ],
    variable: '--ff-atkinson-hyperlegible-mono',
    display: 'swap',
    adjustFontFallback: false,
    fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
    preload: false,
});

export const literata = localFont({
    src: [
        {
            path: '../../../node_modules/@fontsource-variable/literata/files/literata-latin-opsz-normal.woff2',
            weight: '200 900',
            style: 'normal',
        },
        {
            path: '../../../node_modules/@fontsource-variable/literata/files/literata-latin-opsz-italic.woff2',
            weight: '200 900',
            style: 'italic',
        },
    ],
    variable: '--ff-literata',
    display: 'swap',
    adjustFontFallback: 'Times New Roman',
    fallback: ['Georgia', 'serif'],
    preload: false,
});

export const firaCode = localFont({
    src: [
        {
            path: '../../../node_modules/@fontsource-variable/fira-code/files/fira-code-latin-wght-normal.woff2',
            weight: '300 700',
            style: 'normal',
        },
    ],
    variable: '--ff-fira-code',
    display: 'swap',
    adjustFontFallback: false,
    fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
    preload: false,
});

export const cormorantGaramond = localFont({
    src: [
        {
            path: '../../../node_modules/@fontsource-variable/cormorant-garamond/files/cormorant-garamond-latin-wght-normal.woff2',
            weight: '300 700',
            style: 'normal',
        },
    ],
    variable: '--ff-cormorant-garamond',
    display: 'swap',
    adjustFontFallback: 'Times New Roman',
    fallback: ['Georgia', 'serif'],
    preload: false,
});

export const ebGaramond = localFont({
    src: [
        {
            path: '../../../node_modules/@fontsource-variable/eb-garamond/files/eb-garamond-latin-wght-normal.woff2',
            weight: '400 800',
            style: 'normal',
        },
        {
            path: '../../../node_modules/@fontsource-variable/eb-garamond/files/eb-garamond-latin-wght-italic.woff2',
            weight: '400 800',
            style: 'italic',
        },
    ],
    variable: '--ff-eb-garamond',
    display: 'swap',
    adjustFontFallback: 'Times New Roman',
    fallback: ['Georgia', 'serif'],
    preload: false,
});

export const courierPrime = localFont({
    src: [
        {
            path: '../../../node_modules/@fontsource/courier-prime/files/courier-prime-latin-400-normal.woff2',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../../../node_modules/@fontsource/courier-prime/files/courier-prime-latin-700-normal.woff2',
            weight: '700',
            style: 'normal',
        },
    ],
    variable: '--ff-courier-prime',
    display: 'swap',
    adjustFontFallback: false,
    fallback: ['Courier New', 'monospace'],
    preload: false,
});

export const geist = localFont({
    src: [
        {
            path: '../../../node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2',
            weight: '100 900',
            style: 'normal',
        },
        {
            path: '../../../node_modules/@fontsource-variable/geist/files/geist-latin-wght-italic.woff2',
            weight: '100 900',
            style: 'italic',
        },
    ],
    variable: '--ff-geist',
    display: 'swap',
    adjustFontFallback: 'Arial',
    fallback: ['system-ui', '-apple-system', 'sans-serif'],
    preload: false,
});

export const geistMono = localFont({
    src: [
        {
            path: '../../../node_modules/@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2',
            weight: '100 900',
            style: 'normal',
        },
    ],
    variable: '--ff-geist-mono',
    display: 'swap',
    adjustFontFallback: false,
    fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
    preload: false,
});
