import localFont from 'next/font/local';

// next/font needs statically analysable calls with literal options, so every font is declared
// here by hand. Files come from the @fontsource(-variable)/* packages (pinned by the lockfile), all SIL OFL.
// Only the latin subset is used. Variable fonts keep the axes the presets use (wght, plus opsz where
// the family has it).
//
// preload: only the fonts of the default preset ("inter") are preloaded. @font-face rules of all
// the others exist on the page too, but the browser fetches a file only once a glyph uses it.
//
// adjustFontFallback: next can only derive metrics for Arial / Times New Roman. Monospace and
// script faces have no matching system face, so they run without size-adjust.
// Option values must be written out as literals (no shared constants), the font loader checks that.

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
