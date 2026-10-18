// Kept free of next/font imports so plain Node code (posts.ts, vitest) can use it.

export const PRESET_IDS = [
    'current',
    'inter',
    'tight-inter',
    'editorial',
    'plex',
    'instrument',
    'bricolage',
    'literata',
    'garamond',
    'geist',
    'recursive',
    'alegreya',
    'bodoni',
] as const;

export type PresetId = (typeof PRESET_IDS)[number];

export const DEFAULT_PRESET_ID: PresetId = 'inter';

export const isPresetId = (id: unknown): id is PresetId => (PRESET_IDS as readonly unknown[]).includes(id);
