import type { SandpackFiles } from '@codesandbox/sandpack-react';
import fs from 'fs';
import path from 'path';
import { createSandpackFiles } from './createSandpackFiles';
import { SandboxProps } from './props';

// Very simple hardening: no ".." etc.
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

    console.log(slug, name, template, sandboxDir);

    if (!isSafeSegment(slug) || !isSafeSegment(name)) {
        throw new Error('Invalid slug or name');
    }

    const baseDir = path.join(sandboxDir, slug, name);

    // Check directory exists
    if (!fs.existsSync(baseDir) || !fs.statSync(baseDir).isDirectory()) {
        console.log('Creating SANDBOX directory');
        await createSandpackFiles({ slug, name, template, dir: baseDir });
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

    console.log(files);

    return files;
};
