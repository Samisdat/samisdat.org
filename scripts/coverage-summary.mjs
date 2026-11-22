#!/usr/bin/env node
// Merges the per-package coverage-summary.json files into one table and a combined total.
// Run `pnpm coverage` to produce the inputs, or `pnpm coverage:report` to print from existing ones.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packagesDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../packages');
const metrics = ['statements', 'branches', 'functions', 'lines'];

const rows = [];
for (const name of readdirSync(packagesDir).sort()) {
    const file = path.join(packagesDir, name, 'coverage', 'coverage-summary.json');
    if (!existsSync(file)) continue;
    rows.push({ name, total: JSON.parse(readFileSync(file, 'utf8')).total });
}

if (rows.length === 0) {
    console.error('No coverage-summary.json found. Run `pnpm coverage` first.');
    process.exit(1);
}

const pct = (covered, total) => (total === 0 ? '-' : `${((covered / total) * 100).toFixed(2)}%`);
const line = (label, cells) => `| ${label.padEnd(14)} | ${cells.map((c) => c.padStart(18)).join(' | ')} |`;

const out = [
    line('package', metrics),
    line('-'.repeat(14), metrics.map(() => '-'.repeat(18))),
];
const sum = Object.fromEntries(metrics.map((m) => [m, { covered: 0, total: 0 }]));
for (const { name, total } of rows) {
    out.push(
        line(
            name,
            metrics.map((m) => `${pct(total[m].covered, total[m].total)} (${total[m].covered}/${total[m].total})`),
        ),
    );
    for (const m of metrics) {
        sum[m].covered += total[m].covered;
        sum[m].total += total[m].total;
    }
}
out.push(
    line(
        'combined',
        metrics.map((m) => `${pct(sum[m].covered, sum[m].total)} (${sum[m].covered}/${sum[m].total})`),
    ),
);
console.log(out.join('\n'));
