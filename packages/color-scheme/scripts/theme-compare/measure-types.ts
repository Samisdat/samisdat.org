import type { Mode } from '../../src/contrast';
import type { ThemeRegistrationAny } from 'shiki';

export type Variant = {
    family: string;
    mode: Mode;
    /** Bundled Shiki theme id or a full theme object. */
    theme: string | ThemeRegistrationAny;
};

export type Pair = [string, string];

export type Entry = {
    color: string;
    /** Share of the sample's non-blank characters. */
    weight: number;
    wcag: number;
    /** OKLCH lightness. */
    l: number;
    chroma: number;
    hue: number;
};

export type Correspondence = {
    roles: number;
    /** Spearman rank correlation of the WCAG ratio per role, dark vs. light. */
    spearman: number;
    /** Weighted mean |ratio(dark) - ratio(light)| over all roles. */
    meanAbsDiffWcag: number;
};

export type Metrics = {
    key: string;
    family: string;
    mode: Mode;
    theme: string;
    background: string;
    colors: number;
    accents: number;
    wcag: { min: number; median: number; share45: number; share7: number };
    distance: { min: number; pair: Pair | null; below008: number; pairs: number };
    accentDistance: { min: number; pair: Pair | null; below008: number; pairs: number; minDeltaE2000: number };
    cvd: Record<'protan' | 'deutan' | 'tritan', { min: number; pair: Pair | null; below004: number }>;
    lightness: { mean: number; sd: number; range: number };
    correspondence?: Correspondence;
    palette: Entry[];
};
