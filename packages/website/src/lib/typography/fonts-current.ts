import localFont from 'next/font/local';

// --- "current" preset: the site as on main ---------------------------------------------

export const sourceSans3 = localFont({
    src: [
        {
            path: '../../../node_modules/@fontsource-variable/source-sans-3/files/source-sans-3-latin-wght-normal.woff2',
            weight: '200 900',
            style: 'normal',
        },
        {
            path: '../../../node_modules/@fontsource-variable/source-sans-3/files/source-sans-3-latin-wght-italic.woff2',
            weight: '200 900',
            style: 'italic',
        },
    ],
    variable: '--ff-source-sans-3',
    display: 'swap',
    adjustFontFallback: 'Arial',
    fallback: ['system-ui', '-apple-system', 'sans-serif'],
    preload: false,
});

export const sourceSerif4 = localFont({
    src: [
        {
            path: '../../../node_modules/@fontsource-variable/source-serif-4/files/source-serif-4-latin-opsz-normal.woff2',
            weight: '200 900',
            style: 'normal',
        },
        {
            path: '../../../node_modules/@fontsource-variable/source-serif-4/files/source-serif-4-latin-opsz-italic.woff2',
            weight: '200 900',
            style: 'italic',
        },
    ],
    variable: '--ff-source-serif-4',
    display: 'swap',
    adjustFontFallback: 'Times New Roman',
    fallback: ['Georgia', 'serif'],
    preload: false,
});
