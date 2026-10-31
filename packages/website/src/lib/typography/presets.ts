import { PRESET_DATA, presetFonts, type Preset } from './data';
import * as f from './fonts';
import { DEFAULT_PRESET_ID, isPresetId, type PresetId } from './ids';

export { DEFAULT_PRESET_ID, PRESET_IDS, type PresetId } from './ids';
export { presetFontNames, presetStyle, type Font, type Preset } from './data';

export const PRESETS = PRESET_DATA;

// The class next/font generates declares the custom property; looked up by that property's name.
const FONT_CLASS: Record<string, string> = {
    '--ff-inter': f.inter.variable,
    '--ff-inter-tight': f.interTight.variable,
    '--ff-source-code-pro': f.sourceCodePro.variable,
    '--ff-playwrite-no': f.playwriteNo.variable,
    '--ff-source-sans-3': f.sourceSans3.variable,
    '--ff-source-serif-4': f.sourceSerif4.variable,
    '--ff-fraunces': f.fraunces.variable,
    '--ff-newsreader': f.newsreader.variable,
    '--ff-jetbrains-mono': f.jetbrainsMono.variable,
    '--ff-ibm-plex-sans': f.ibmPlexSans.variable,
    '--ff-ibm-plex-serif': f.ibmPlexSerif.variable,
    '--ff-ibm-plex-mono': f.ibmPlexMono.variable,
    '--ff-schibsted-grotesk': f.schibstedGrotesk.variable,
    '--ff-instrument-sans': f.instrumentSans.variable,
    '--ff-instrument-serif': f.instrumentSerif.variable,
    '--ff-martian-mono': f.martianMono.variable,
    '--ff-bricolage-grotesque': f.bricolageGrotesque.variable,
    '--ff-atkinson-hyperlegible-next': f.atkinsonNext.variable,
    '--ff-atkinson-hyperlegible-mono': f.atkinsonMono.variable,
    '--ff-literata': f.literata.variable,
    '--ff-fira-code': f.firaCode.variable,
    '--ff-cormorant-garamond': f.cormorantGaramond.variable,
    '--ff-eb-garamond': f.ebGaramond.variable,
    '--ff-courier-prime': f.courierPrime.variable,
    '--ff-geist': f.geist.variable,
    '--ff-geist-mono': f.geistMono.variable,
    '--ff-recursive': f.recursive.variable,
    '--ff-alegreya-sans': f.alegreyaSans.variable,
    '--ff-alegreya': f.alegreya.variable,
    '--ff-fira-mono': f.firaMono.variable,
    '--ff-bodoni-moda': f.bodoniModa.variable,
    '--ff-libre-franklin': f.libreFranklin.variable,
    '--ff-dm-mono': f.dmMono.variable,
};

const classOf = (cssVar: string): string => {
    const cls = FONT_CLASS[cssVar];
    if (!cls) {
        throw new Error(`[typography] no registered font declares ${cssVar}`);
    }
    return cls;
};

/** Classes that declare the font custom properties of the given fonts (deduplicated). */
export const fontClasses = (fonts: readonly { cssVar: string }[]): string =>
    [...new Set(fonts.map(({ cssVar }) => classOf(cssVar)))].join(' ');

const byId = new Map(PRESETS.map(preset => [preset.id, preset]));

export const getDefaultPreset = (): Preset => byId.get(DEFAULT_PRESET_ID)!;

/** Unknown ids warn (visible in the build log) and fall back to the default; they never throw. */
export function resolvePreset(id?: string | null): Preset {
    if (id == null || id === '') {
        return getDefaultPreset();
    }
    if (isPresetId(id)) {
        return byId.get(id)!;
    }
    console.warn(`[typography] unknown preset "${id}", falling back to "${DEFAULT_PRESET_ID}"`);
    return getDefaultPreset();
}

/** Classes that declare the font custom properties of one preset. */
export const presetFontClasses = (preset: Preset): string => fontClasses(presetFonts(preset));

/** Every registered font; the specimen switches between all presets. */
export const ALL_FONT_CLASSES = Object.values(FONT_CLASS).join(' ');
