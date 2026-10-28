// qlty installs prettier and its plugins with npm, which cannot resolve "catalog:".
// The versions are therefore pinned in .qlty/qlty.toml; this check keeps them in sync with the pnpm catalog.
import { readFileSync } from 'node:fs';

const catalog = readFileSync(new URL('../pnpm-workspace.yaml', import.meta.url), 'utf8');
const qlty = readFileSync(new URL('../.qlty/qlty.toml', import.meta.url), 'utf8');

const names = ['prettier', 'prettier-plugin-organize-imports', 'prettier-plugin-multiline-arrays'];

const catalogVersion = name => catalog.match(new RegExp(`^\\s+${name}:\\s*\\^?~?([\\d.]+)\\s*$`, 'm'))?.[1];

const qltyVersions = name => {
    const pattern = name === 'prettier' ? /^version = "([\d.]+)"/gm : new RegExp(`"${name}@([\\d.]+)"`, 'g');
    return [...qlty.matchAll(pattern)].map(match => match[1]);
};

let failed = false;
for (const name of names) {
    const expected = catalogVersion(name);
    const found = qltyVersions(name);
    if (!expected || found.length === 0 || found.some(version => version !== expected)) {
        failed = true;
        console.error(`${name}: catalog ${expected ?? 'missing'}, .qlty/qlty.toml ${found.join(', ') || 'missing'}`);
    }
}

if (failed) {
    console.error('Update the pinned versions in .qlty/qlty.toml to match pnpm-workspace.yaml.');
    process.exit(1);
}
console.log('qlty prettier versions match the pnpm catalog.');
