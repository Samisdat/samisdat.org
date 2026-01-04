import type { SandpackFiles } from '@codesandbox/sandpack-react';
import fs from 'fs';
import path from 'path';

const SANDBOX_ROOT = path.join(process.cwd(), 'sandboxes');

function isSafeSegment(seg: string) {
    // Very simple hardening: no ".." etc.
    return !seg.includes('..') && !path.isAbsolute(seg);
}

export async function getSandpackFiles(opts: { slug: string; name: string; mdxDir: string }): Promise<SandpackFiles> {
    const { slug, name, mdxDir } = opts;

    console.log(slug, name, mdxDir);

    if (!isSafeSegment(slug) || !isSafeSegment(name)) {
        throw new Error('Invalid slug or name');
    }

    const baseDir = path.join(SANDBOX_ROOT, slug, name);

    // Check directory exists
    if (!fs.existsSync(baseDir) || !fs.statSync(baseDir).isDirectory()) {
        throw new Error(`Sandbox directory not found: ${baseDir}`);
    }

    const files: SandpackFiles = {};

    const walk = (dir: string) => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                walk(fullPath);
            } else {
                const relPath = path.relative(baseDir, fullPath);
                // Sandpack möchte Pfade wie "/index.tsx"
                const sandpackPath = '/' + relPath.replace(/\\/g, '/');
                const code = fs.readFileSync(fullPath, 'utf-8');
                files[sandpackPath] = code;
            }
        }
    };

    walk(baseDir);

    return files;
}
