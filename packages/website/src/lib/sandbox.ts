import fs from 'fs';
import path from 'path';

import matter from 'gray-matter';

import { frontmatterSchema } from './posts';

import type { Frontmatter } from './posts';

export const SANDBOX_DIR = path.join(process.cwd(), 'content/sandbox');

/** Only lowercase alphanumeric slugs with hyphens — prevents path traversal. */
const SAFE_SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Sandbox entries are not posts: no `published` flag needed, it would be meaningless. */
const sandboxSchema = frontmatterSchema.partial({ published: true });

export type SandboxFrontmatter = Omit<Frontmatter, 'published'> & { published?: boolean };

export interface SandboxEntry {
    slug: string;
    frontmatter: SandboxFrontmatter;
    /** Raw .mdx source including the frontmatter block. */
    source: string;
}

/** The sandbox exists only while developing. Production builds never serve or list it. */
export const isSandboxEnabled = () => process.env.NODE_ENV === 'development';

/** Reads on every call: the sandbox is dev only, so edits show up without a cache to invalidate. */
export const loadSandboxEntry = (slug: string): SandboxEntry | null => {
    if (!isSandboxEnabled() || !SAFE_SLUG_RE.test(slug)) {
        return null;
    }

    const fullPath = path.join(SANDBOX_DIR, `${slug}.mdx`);

    if (!fs.existsSync(fullPath)) {
        return null;
    }

    const source = fs.readFileSync(fullPath, 'utf8');

    return { slug, frontmatter: sandboxSchema.parse(matter(source).data), source };
};

export const getAllSandboxSlugs = (): string[] => {
    if (!isSandboxEnabled() || !fs.existsSync(SANDBOX_DIR)) {
        return [];
    }

    return fs
        .readdirSync(SANDBOX_DIR)
        .filter(file => file.endsWith('.mdx'))
        .map(file => file.replace(/\.mdx$/, ''))
        .filter(slug => SAFE_SLUG_RE.test(slug));
};

/** All sandbox entries, newest first. */
export const getAllSandboxEntries = (): SandboxEntry[] =>
    getAllSandboxSlugs()
        .flatMap(slug => loadSandboxEntry(slug) ?? [])
        .sort((a, b) => b.frontmatter.date.getTime() - a.frontmatter.date.getTime());
