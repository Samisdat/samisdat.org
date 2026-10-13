import { ColorSchemeSnapshot } from '@samisdat/ui-components/ColorSchemeSnapshot';
import type { Snapshot } from '@samisdat/color-scheme/snapshot-types';
import fs from 'fs';
import path from 'path';
import type { ReactNode } from 'react';

const SNAPSHOTS_DIR = path.join(process.cwd(), 'content/snapshots');
const SAFE_ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Loads a frozen color scheme snapshot (`pnpm --filter @samisdat/color-scheme snapshot <id>`)
 * and renders it as the frame for the snapshot blocks. Fails hard when the file is missing.
 */
export function SnapshotFrame({ id, children }: { id: string; children?: ReactNode }) {
    if (!SAFE_ID_RE.test(id)) {
        throw new Error(`Invalid snapshot id: ${id}`);
    }

    const file = path.join(SNAPSHOTS_DIR, `${id}.json`);
    const data = JSON.parse(fs.readFileSync(file, 'utf8')) as Snapshot;

    return <ColorSchemeSnapshot data={data}>{children}</ColorSchemeSnapshot>;
}
