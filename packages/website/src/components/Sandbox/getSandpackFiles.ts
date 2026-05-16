import type { SandpackFiles } from '@codesandbox/sandpack-react';
import fs from 'fs';
import path from 'path';
import { createSandpackFiles } from './createSandpackFiles';
import { SandboxProps } from './props';

const isSafeSegment = (seg: string) => {
    return !seg.includes('..') && !path.isAbsolute(seg);
};

export const getSandpackFiles = async (opts: {
    slug: string;
    name: string;
    template: SandboxProps['template'];
}): Promise<SandpackFiles> => {
    const { slug, name, template } = opts;

    const sandboxDir = path.join(process.cwd(), 'codesandboxes');

    if (!isSafeSegment(slug) || !isSafeSegment(name)) {
        throw new Error('Invalid slug or name');
    }

    const baseDir = path.join(sandboxDir, slug, name);

    if (!fs.existsSync(baseDir) || !fs.statSync(baseDir).isDirectory()) {
        await createSandpackFiles({ slug, name, template, dir: baseDir });
    }

    const files: SandpackFiles = {};

    // Directories to exclude from Sandpack
    const EXCLUDED_DIRS = new Set(['node_modules', '.git', 'build', 'dist', '.next', 'coverage', '.cache']);

    // Files to exclude from Sandpack
    const EXCLUDED_FILES = new Set([
        'package-lock.json',
        'yarn.lock',
        'pnpm-lock.yaml',
        '.DS_Store',
        '.gitignore',
        '.env',
        '.env.local',
    ]);

    const walk = (dir: string) => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            // Skip excluded directories
            if (entry.isDirectory() && EXCLUDED_DIRS.has(entry.name)) {
                continue;
            }

            // Skip excluded files
            if (entry.isFile() && EXCLUDED_FILES.has(entry.name)) {
                continue;
            }

            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                walk(fullPath);
            } else {
                const relPath = path.relative(baseDir, fullPath);
                const sandpackPath = '/' + relPath.replace(/\\/g, '/');
                const code = fs.readFileSync(fullPath, 'utf-8');
                files[sandpackPath] = code;
            }
        }
    };

    walk(baseDir);

    return files;
};
