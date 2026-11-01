import localFont from 'next/font/local';

// --- default preset ("inter") --------------------------------------------------------------

export const inter = localFont({
    src: [
        {
            path: '../../../node_modules/@fontsource-variable/inter/files/inter-latin-opsz-normal.woff2',
            weight: '100 900',
            style: 'normal',
        },
        {
            path: '../../../node_modules/@fontsource-variable/inter/files/inter-latin-opsz-italic.woff2',
            weight: '100 900',
            style: 'italic',
        },
    ],
    variable: '--ff-inter',
    display: 'swap',
    adjustFontFallback: 'Arial',
    fallback: ['system-ui', '-apple-system', 'sans-serif'],
    preload: true,
});

export const interTight = localFont({
    src: [
        {
            path: '../../../node_modules/@fontsource-variable/inter-tight/files/inter-tight-latin-wght-normal.woff2',
            weight: '100 900',
            style: 'normal',
        },
        {
            path: '../../../node_modules/@fontsource-variable/inter-tight/files/inter-tight-latin-wght-italic.woff2',
            weight: '100 900',
            style: 'italic',
        },
    ],
    variable: '--ff-inter-tight',
    display: 'swap',
    adjustFontFallback: 'Arial',
    fallback: ['system-ui', '-apple-system', 'sans-serif'],
    preload: true,
});

export const sourceCodePro = localFont({
    src: [
        {
            path: '../../../node_modules/@fontsource-variable/source-code-pro/files/source-code-pro-latin-wght-normal.woff2',
            weight: '200 900',
            style: 'normal',
        },
        {
            path: '../../../node_modules/@fontsource-variable/source-code-pro/files/source-code-pro-latin-wght-italic.woff2',
            weight: '200 900',
            style: 'italic',
        },
    ],
    variable: '--ff-source-code-pro',
    display: 'swap',
    adjustFontFallback: false,
    fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
    preload: true,
});

export const playwriteNo = localFont({
    src: [
        {
            path: '../../../node_modules/@fontsource-variable/playwrite-no/files/playwrite-no-fallback-wght-normal.woff2',
            weight: '100 400',
            style: 'normal',
        },
    ],
    variable: '--ff-playwrite-no',
    display: 'swap',
    adjustFontFallback: false,
    fallback: ['cursive'],
    preload: true,
});
