import type { CSSProperties } from 'react';

import type { PresetId } from './ids';

// Pure data (no next/font), so plain Node scripts can read it, e.g. the snapshot script.

/** `cssVar` is the custom property the font registry (fonts.ts) declares, e.g. --ff-inter. */
export type Font = { name: string; cssVar: string };

const font = (name: string, cssVar: string): Font => ({ name, cssVar });

// Wrapper names, one per registered font; the label shows up in the specimen's font line
const Inter = font('Inter', '--ff-inter');
const InterTight = font('Inter Tight', '--ff-inter-tight');
const SourceCodePro = font('Source Code Pro', '--ff-source-code-pro');
const PlaywriteNO = font('Playwrite NO', '--ff-playwrite-no');
const SourceSans = font('Source Sans 3', '--ff-source-sans-3');
const SourceSerif = font('Source Serif 4', '--ff-source-serif-4');
const Fraunces = font('Fraunces', '--ff-fraunces');
const Newsreader = font('Newsreader', '--ff-newsreader');
const JetBrainsMono = font('JetBrains Mono', '--ff-jetbrains-mono');
const PlexSans = font('IBM Plex Sans', '--ff-ibm-plex-sans');
const PlexSerif = font('IBM Plex Serif', '--ff-ibm-plex-serif');
const PlexMono = font('IBM Plex Mono', '--ff-ibm-plex-mono');
const Schibsted = font('Schibsted Grotesk', '--ff-schibsted-grotesk');
const InstrumentSans = font('Instrument Sans', '--ff-instrument-sans');
const InstrumentSerif = font('Instrument Serif', '--ff-instrument-serif');
const MartianMono = font('Martian Mono', '--ff-martian-mono');
const Bricolage = font('Bricolage Grotesque', '--ff-bricolage-grotesque');
const AtkinsonNext = font('Atkinson Hyperlegible Next', '--ff-atkinson-hyperlegible-next');
const AtkinsonMono = font('Atkinson Hyperlegible Mono', '--ff-atkinson-hyperlegible-mono');
const Literata = font('Literata', '--ff-literata');
const FiraCode = font('Fira Code', '--ff-fira-code');
const Cormorant = font('Cormorant Garamond', '--ff-cormorant-garamond');
const EBGaramond = font('EB Garamond', '--ff-eb-garamond');
const CourierPrime = font('Courier Prime', '--ff-courier-prime');
const Geist = font('Geist', '--ff-geist');
const GeistMono = font('Geist Mono', '--ff-geist-mono');
const Recursive = font('Recursive', '--ff-recursive');
const AlegreyaSans = font('Alegreya Sans', '--ff-alegreya-sans');
const Alegreya = font('Alegreya', '--ff-alegreya');
const FiraMono = font('Fira Mono', '--ff-fira-mono');
const Bodoni = font('Bodoni Moda', '--ff-bodoni-moda');
const LibreFranklin = font('Libre Franklin', '--ff-libre-franklin');
const DMMono = font('DM Mono', '--ff-dm-mono');

export interface Preset {
    id: PresetId;
    label: string;
    head: {
        font: Font;
        weight: number;
        tracking: string;
        size: string;
        /** h2/h3 sizes; default to the ratios of the site (0.74 / 0.53 of the h1 size) */
        h2?: string;
        h3?: string;
        variations?: string;
    };
    body: {
        font: Font;
        size: string;
        tracking: string;
        leadWeight: number;
        lineHeight?: number;
        variations?: string;
    };
    mono: { font: Font; size: string; keywordWeight: number; variations?: string };
    em: { font: Font; style: 'normal' | 'italic'; weight: number; size: string; variations?: string };
}

export const PRESET_DATA: readonly Preset[] = [
    {
        id: 'current',
        label: 'current',
        // The site as on main: Source Serif 4 / Source Sans 3 at 20px, 1.6 line height,
        // 0.01em tracking on everything, h1-h3 at 3 / 2.75 / 2.25rem (root is 20px)
        head: { font: SourceSerif, weight: 700, tracking: '0.01em', size: '60px', h2: '55px', h3: '45px' },
        body: { font: SourceSans, size: '20px', tracking: '0.01em', leadWeight: 400, lineHeight: 1.6 },
        mono: { font: SourceCodePro, size: '16px', keywordWeight: 700 },
        em: { font: PlaywriteNO, style: 'normal', weight: 400, size: '1em' },
    },
    {
        id: 'inter',
        label: 'inter',
        head: { font: Inter, weight: 700, tracking: '-0.03em', size: '42px' },
        body: { font: InterTight, size: '16px', tracking: '0.01em', leadWeight: 500 },
        mono: { font: SourceCodePro, size: '14.5px', keywordWeight: 650 },
        em: { font: PlaywriteNO, style: 'normal', weight: 400, size: '0.95em' },
    },
    {
        id: 'tight-inter',
        label: 'tight-inter',
        head: { font: InterTight, weight: 700, tracking: '-0.02em', size: '42px' },
        // font-optical-sizing is auto by default, so Inter's opsz axis follows the size
        body: { font: Inter, size: '16px', tracking: '0em', leadWeight: 500 },
        mono: { font: SourceCodePro, size: '14.5px', keywordWeight: 650 },
        em: { font: PlaywriteNO, style: 'normal', weight: 400, size: '0.95em' },
    },
    {
        id: 'editorial',
        label: 'editorial',
        head: { font: Fraunces, weight: 700, tracking: '-0.02em', size: '42px' },
        body: { font: Newsreader, size: '17px', tracking: '0em', leadWeight: 400 },
        mono: { font: JetBrainsMono, size: '14px', keywordWeight: 700 },
        em: { font: Newsreader, style: 'italic', weight: 400, size: '1em' },
    },
    {
        id: 'plex',
        label: 'plex',
        head: { font: PlexSans, weight: 700, tracking: '-0.02em', size: '40px' },
        body: { font: PlexSerif, size: '16px', tracking: '0em', leadWeight: 400 },
        mono: { font: PlexMono, size: '14px', keywordWeight: 600 },
        em: { font: PlexSerif, style: 'italic', weight: 400, size: '1em' },
    },
    {
        id: 'instrument',
        label: 'instrument',
        head: { font: Schibsted, weight: 800, tracking: '-0.035em', size: '42px' },
        body: { font: InstrumentSans, size: '16px', tracking: '0em', leadWeight: 400 },
        mono: { font: MartianMono, size: '13px', keywordWeight: 700 },
        em: { font: InstrumentSerif, style: 'italic', weight: 400, size: '1.15em' },
    },
    {
        id: 'bricolage',
        label: 'bricolage',
        head: { font: Bricolage, weight: 800, tracking: '-0.03em', size: '42px' },
        body: { font: AtkinsonNext, size: '16px', tracking: '0em', leadWeight: 400 },
        mono: { font: AtkinsonMono, size: '14.5px', keywordWeight: 700 },
        em: { font: Fraunces, style: 'italic', weight: 400, size: '1em' },
    },
    {
        id: 'literata',
        label: 'literata',
        head: { font: Literata, weight: 700, tracking: '-0.02em', size: '40px' },
        body: { font: Literata, size: '16px', tracking: '0em', leadWeight: 400 },
        mono: { font: FiraCode, size: '14px', keywordWeight: 700 },
        em: { font: Literata, style: 'italic', weight: 400, size: '1em' },
    },
    {
        id: 'garamond',
        label: 'garamond',
        head: { font: Cormorant, weight: 700, tracking: '-0.01em', size: '48px' },
        body: { font: EBGaramond, size: '18.5px', tracking: '0em', leadWeight: 400 },
        mono: { font: CourierPrime, size: '14.5px', keywordWeight: 700 },
        em: { font: EBGaramond, style: 'italic', weight: 400, size: '1em' },
    },
    {
        id: 'geist',
        label: 'geist',
        head: { font: Geist, weight: 700, tracking: '-0.04em', size: '42px' },
        body: { font: Geist, size: '16px', tracking: '0em', leadWeight: 400 },
        mono: { font: GeistMono, size: '14px', keywordWeight: 700 },
        em: { font: InstrumentSerif, style: 'italic', weight: 400, size: '1.15em' },
    },
    {
        id: 'recursive',
        label: 'recursive',
        head: { font: Recursive, weight: 800, tracking: '-0.02em', size: '42px', variations: '"CASL" 1, "MONO" 0' },
        body: { font: Recursive, size: '16px', tracking: '0em', leadWeight: 400, variations: '"CASL" 0, "MONO" 0' },
        mono: { font: Recursive, size: '14px', keywordWeight: 700, variations: '"MONO" 1, "CASL" 0' },
        em: {
            font: Recursive,
            style: 'normal',
            weight: 400,
            size: '1em',
            variations: '"CASL" 1, "slnt" -15, "CRSV" 1, "MONO" 0',
        },
    },
    {
        id: 'alegreya',
        label: 'alegreya',
        head: { font: AlegreyaSans, weight: 800, tracking: '-0.02em', size: '42px' },
        body: { font: Alegreya, size: '17.5px', tracking: '0em', leadWeight: 400 },
        mono: { font: FiraMono, size: '14px', keywordWeight: 500 },
        em: { font: Alegreya, style: 'italic', weight: 400, size: '1em' },
    },
    {
        id: 'bodoni',
        label: 'bodoni',
        head: { font: Bodoni, weight: 700, tracking: '-0.01em', size: '46px' },
        body: { font: LibreFranklin, size: '16px', tracking: '0em', leadWeight: 400 },
        mono: { font: DMMono, size: '14px', keywordWeight: 500 },
        em: { font: Bodoni, style: 'italic', weight: 500, size: '1.05em' },
    },
];

/** The preset as the CSS variables the components read (see Heading, Typo, Lead, globalstyle). */
export function presetStyle(preset: Preset): CSSProperties {
    const { head, body, mono, em } = preset;
    const vars: Record<string, string | number> = {
        '--f-head': `var(${head.font.cssVar})`,
        '--hw': head.weight,
        '--hls': head.tracking,
        '--hz': head.size,
        // h2 is not part of the preset table; it keeps the ratio of the site (31px at 42px)
        '--h2z': head.h2 ?? 'calc(var(--hz) * 0.74)',
        '--h3z': head.h3 ?? 'calc(var(--hz) * 0.53)',
        '--v-head': head.variations ?? 'normal',
        '--f-body': `var(${body.font.cssVar})`,
        '--bz': body.size,
        '--blh': body.lineHeight ?? 1.65,
        '--bls': body.tracking,
        '--lw': body.leadWeight,
        '--v-body': body.variations ?? 'normal',
        '--f-mono': `var(${mono.font.cssVar})`,
        '--mz': mono.size,
        '--kw': mono.keywordWeight,
        '--v-mono': mono.variations ?? 'normal',
        '--f-em': `var(${em.font.cssVar})`,
        '--es': em.style,
        '--ew': em.weight,
        '--ez': em.size,
        '--v-em': em.variations ?? 'normal',
    };
    return vars as CSSProperties;
}

export const presetFonts = (preset: Preset): Font[] => [
    preset.head.font,
    preset.body.font,
    preset.mono.font,
    preset.em.font,
];

/** Font names of a preset for the specimen's caption. */
export function presetFontNames(preset: Preset) {
    return {
        head: preset.head.font.name,
        body: preset.body.font.name,
        mono: preset.mono.font.name,
        em: preset.em.font.name,
    };
}
