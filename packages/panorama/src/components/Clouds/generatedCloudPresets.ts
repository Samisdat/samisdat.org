import type { GeneratedCloudProps } from './GeneratedCloud';
import type { CloudType } from './cloudTypes';

type Look = Pick<GeneratedCloudProps, 'rx' | 'ry' | 'seed' | 'baseFrequency' | 'octaves' | 'scale' | 'blur' | 'relief' | 'flatBase'>;

/**
 * Filter settings per cloud type, sized like the hand-drawn shapes they will replace.
 * High clouds are thin and wispy (high frequency, little blur), low ones heavy and round (low frequency, soft).
 */
export const generatedCloudPresets: Record<Exclude<CloudType, 'nimbostratus'>, Look> = {
    cirrus: { rx: 190, ry: 10, seed: 4, baseFrequency: 0.02, octaves: 4, scale: 50, blur: 5 },
    cirrocumulus: { rx: 130, ry: 16, seed: 9, baseFrequency: 0.03, octaves: 3, scale: 40, blur: 5 },
    altocumulus: { rx: 140, ry: 16, seed: 12, baseFrequency: 0.022, octaves: 4, scale: 50, blur: 7 },
    cumulus: { rx: 130, ry: 40, seed: 3, baseFrequency: 0.016, octaves: 4, scale: 90, blur: 9, relief: 30, flatBase: true },
    stratocumulus: { rx: 230, ry: 24, seed: 6, baseFrequency: 0.014, octaves: 4, scale: 70, blur: 12 },
};
