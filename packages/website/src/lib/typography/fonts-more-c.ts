import localFont from 'next/font/local';

export const recursive = localFont({
    src: [
        {
            path: '../../../node_modules/@fontsource-variable/recursive/files/recursive-latin-full-normal.woff2',
            weight: '300 1000',
            style: 'normal',
        },
    ],
    variable: '--ff-recursive',
    display: 'swap',
    adjustFontFallback: false,
    fallback: ['system-ui', '-apple-system', 'sans-serif'],
    preload: false,
});

export const alegreyaSans = localFont({
    src: [
        {
            path: '../../../node_modules/@fontsource/alegreya-sans/files/alegreya-sans-latin-400-normal.woff2',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../../../node_modules/@fontsource/alegreya-sans/files/alegreya-sans-latin-700-normal.woff2',
            weight: '700',
            style: 'normal',
        },
        {
            path: '../../../node_modules/@fontsource/alegreya-sans/files/alegreya-sans-latin-800-normal.woff2',
            weight: '800',
            style: 'normal',
        },
    ],
    variable: '--ff-alegreya-sans',
    display: 'swap',
    adjustFontFallback: 'Arial',
    fallback: ['system-ui', '-apple-system', 'sans-serif'],
    preload: false,
});

export const alegreya = localFont({
    src: [
        {
            path: '../../../node_modules/@fontsource-variable/alegreya/files/alegreya-latin-wght-normal.woff2',
            weight: '400 900',
            style: 'normal',
        },
        {
            path: '../../../node_modules/@fontsource-variable/alegreya/files/alegreya-latin-wght-italic.woff2',
            weight: '400 900',
            style: 'italic',
        },
    ],
    variable: '--ff-alegreya',
    display: 'swap',
    adjustFontFallback: 'Times New Roman',
    fallback: ['Georgia', 'serif'],
    preload: false,
});

export const firaMono = localFont({
    src: [
        {
            path: '../../../node_modules/@fontsource/fira-mono/files/fira-mono-latin-400-normal.woff2',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../../../node_modules/@fontsource/fira-mono/files/fira-mono-latin-500-normal.woff2',
            weight: '500',
            style: 'normal',
        },
    ],
    variable: '--ff-fira-mono',
    display: 'swap',
    adjustFontFallback: false,
    fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
    preload: false,
});

export const bodoniModa = localFont({
    src: [
        {
            path: '../../../node_modules/@fontsource-variable/bodoni-moda/files/bodoni-moda-latin-opsz-normal.woff2',
            weight: '400 900',
            style: 'normal',
        },
        {
            path: '../../../node_modules/@fontsource-variable/bodoni-moda/files/bodoni-moda-latin-opsz-italic.woff2',
            weight: '400 900',
            style: 'italic',
        },
    ],
    variable: '--ff-bodoni-moda',
    display: 'swap',
    adjustFontFallback: 'Times New Roman',
    fallback: ['Georgia', 'serif'],
    preload: false,
});

export const libreFranklin = localFont({
    src: [
        {
            path: '../../../node_modules/@fontsource-variable/libre-franklin/files/libre-franklin-latin-wght-normal.woff2',
            weight: '100 900',
            style: 'normal',
        },
        {
            path: '../../../node_modules/@fontsource-variable/libre-franklin/files/libre-franklin-latin-wght-italic.woff2',
            weight: '100 900',
            style: 'italic',
        },
    ],
    variable: '--ff-libre-franklin',
    display: 'swap',
    adjustFontFallback: 'Arial',
    fallback: ['system-ui', '-apple-system', 'sans-serif'],
    preload: false,
});

export const dmMono = localFont({
    src: [
        {
            path: '../../../node_modules/@fontsource/dm-mono/files/dm-mono-latin-400-normal.woff2',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../../../node_modules/@fontsource/dm-mono/files/dm-mono-latin-500-normal.woff2',
            weight: '500',
            style: 'normal',
        },
    ],
    variable: '--ff-dm-mono',
    display: 'swap',
    adjustFontFallback: false,
    fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
    preload: false,
});
