/**
 * Freezes the typography presets into one JSON file for a blog post:
 * `pnpm snapshot:typography <id> [colorSnapshotId]` writes content/typography-snapshots/<id>.json.
 *
 * It records the preset table, the font files (sha256) and the color values of both modes
 * (copied from a color snapshot, default: the newest in content/snapshots). The post component
 * renders only this file, so an old post does not change when presets, fonts or colors change later.
 */
import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { DEFAULT_PRESET_ID } from '../src/lib/typography/ids';
import { PRESET_DATA, presetFonts } from '../src/lib/typography/data';
import type { SnapshotFont, TypographySnapshot } from '../src/lib/typography/snapshot-types';

const root = new URL('..', import.meta.url).pathname;
const id = process.argv[2];

if (!id || !/^[a-z0-9-]+$/.test(id)) {
    console.error('usage: pnpm snapshot:typography <id> [colorSnapshotId]   (lowercase, digits, dashes; e.g. 2026-10)');
    process.exit(1);
}

const colorsDir = join(root, 'content/snapshots');
const colorId =
    process.argv[3] ??
    readdirSync(colorsDir)
        .filter(name => name.endsWith('.json'))
        .map(name => name.replace(/\.json$/, ''))
        .sort()
        .at(-1);

if (!colorId) {
    throw new Error('no color snapshot found in content/snapshots');
}

const color = JSON.parse(readFileSync(join(colorsDir, `${colorId}.json`), 'utf8'));
const git = (args: string) => execSync(`git ${args}`, { encoding: 'utf8' }).trim();

// Every font registered as --ff-<dir> is declared in fonts.ts with literal paths into node_modules
// (@fontsource packages). The files are read from there, so the recorded hashes follow the lockfile.
const fontMap = new Map<string, string>();
for (const preset of PRESET_DATA) {
    for (const { name, cssVar } of presetFonts(preset)) {
        fontMap.set(cssVar, name);
    }
}

const fontsSource = readFileSync(join(root, 'src/lib/typography/fonts.ts'), 'utf8');
const filesByVar = new Map<string, string[]>();
for (const block of fontsSource.split('localFont(').slice(1)) {
    const cssVar = /variable:\s*'(--ff-[^']+)'/.exec(block)?.[1];
    if (cssVar) {
        const files = [...block.matchAll(/path:\s*'(?:\.\.\/)+node_modules\/([^']+)'/g)].map(match => match[1]);
        filesByVar.set(cssVar, files);
    }
}

const fonts: SnapshotFont[] = [...fontMap].map(([cssVar, name]) => {
    const declared = filesByVar.get(cssVar);
    if (!declared?.length) {
        throw new Error(`no font files found in fonts.ts for ${cssVar}`);
    }
    const files = [...declared].sort().map(file => ({
        file,
        sha256: createHash('sha256').update(readFileSync(join(root, 'node_modules', file))).digest('hex'),
    }));
    return { name, cssVar, files };
});

const snapshot: TypographySnapshot = {
    version: 2,
    id,
    date: new Date().toISOString().slice(0, 10),
    git: { commit: git('rev-parse --short HEAD'), dirty: git('status --porcelain').length > 0 },
    defaultPreset: DEFAULT_PRESET_ID,
    presets: [...PRESET_DATA],
    fonts,
    colors: { source: colorId, dark: color.modes.dark.colors, light: color.modes.light.colors },
};

const out = join(root, 'content/typography-snapshots', `${id}.json`);
mkdirSync(join(root, 'content/typography-snapshots'), { recursive: true });
writeFileSync(out, `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(`wrote ${out} (${fonts.length} fonts, ${PRESET_DATA.length} presets, colors from ${colorId})`);
