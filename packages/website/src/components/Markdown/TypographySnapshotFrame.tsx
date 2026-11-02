import { createHash } from 'crypto';
import fs from 'fs';
import path from 'path';

import { TypographySnapshot } from '../TypographySnapshot';

import type { TypographySnapshot as Data } from '@/lib/typography/snapshot-types';

const SNAPSHOTS_DIR = path.join(process.cwd(), 'content/typography-snapshots');
const NODE_MODULES = path.join(process.cwd(), 'node_modules');
const SAFE_ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const verified = new Set<string>();

/** A font file that changed since the snapshot would silently change an old post: fail the build, warn in dev. */
function verifyFonts(data: Data) {
    if (verified.has(data.id)) {
        return;
    }
    const changed = data.fonts
        .flatMap(font => font.files)
        .filter(({ file, sha256 }) => {
            const hash = createHash('sha256')
                .update(fs.readFileSync(path.join(NODE_MODULES, file)))
                .digest('hex');
            return hash !== sha256;
        })
        .map(({ file }) => file);

    if (changed.length > 0) {
        const message = `Typography snapshot ${data.id}: font files changed since the snapshot was taken: ${changed.join(', ')}`;
        if (process.env.NODE_ENV === 'production') {
            throw new Error(message);
        }
        console.warn(`[typography] ${message}`);
    }
    verified.add(data.id);
}

/**
 * Loads a frozen typography snapshot (`pnpm snapshot:typography <id>`) and renders it as a framed specimen.
 * Fails hard when the file is missing.
 */
export function TypographySnapshotFrame({ id }: { id: string }) {
    if (!SAFE_ID_RE.test(id)) {
        throw new Error(`Invalid typography snapshot id: ${id}`);
    }

    const data = JSON.parse(fs.readFileSync(path.join(SNAPSHOTS_DIR, `${id}.json`), 'utf8')) as Data;
    verifyFonts(data);

    return <TypographySnapshot data={data} />;
}
