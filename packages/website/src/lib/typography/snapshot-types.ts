/** Format of a typography snapshot (content/typography-snapshots/<id>.json). Bump `version` on breaking changes (2: preset sizes are { min, max } px). */
import type { Preset } from './data';
import type { PresetId } from './ids';

export type SnapshotFont = {
    name: string;
    cssVar: string;
    /** Font files below node_modules/ (fontsource packages), with the hash they had when the snapshot was taken. */
    files: { file: string; sha256: string }[];
};

export type TypographySnapshot = {
    version: 2;
    id: string;
    /** ISO date. */
    date: string;
    git: { commit: string; dirty: boolean };
    defaultPreset: PresetId;
    presets: Preset[];
    fonts: SnapshotFont[];
    /** Semantic color tokens of both modes, copied from the color snapshot `source`. */
    colors: { source: string; dark: Record<string, string>; light: Record<string, string> };
};
