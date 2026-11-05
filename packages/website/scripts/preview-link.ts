/**
 * Prints the preview link for a post: `pnpm preview:link <slug>`.
 *
 * Needs the same PREVIEW_SECRET as the deployment (env or .env.local).
 * The link opens only this one post; a new secret revokes all links.
 */
import { existsSync } from 'node:fs';

import { SITE_URL } from '../src/lib/constants';
import { createPreviewToken } from '../src/lib/preview';

const envFile = new URL('../.env.local', import.meta.url);
if (!process.env.PREVIEW_SECRET && existsSync(envFile)) {
    process.loadEnvFile(envFile);
}

const slug = process.argv[2];
const secret = process.env.PREVIEW_SECRET;

if (!slug) {
    console.error('usage: pnpm preview:link <slug>');
    process.exit(1);
}

if (!secret) {
    console.error('PREVIEW_SECRET fehlt (Umgebung oder packages/website/.env.local)');
    process.exit(1);
}

if (!existsSync(new URL(`../content/posts/${slug}.mdx`, import.meta.url))) {
    console.error(`kein Post content/posts/${slug}.mdx`);
    process.exit(1);
}

console.log(`${SITE_URL}/preview/${slug}/${createPreviewToken(slug, secret)}`);
