/**
 * Compares the samisdat syntax colors with well-known Shiki themes and writes
 * a ranked report. Run after color changes: `pnpm compare:themes`.
 *
 * Reads generated/shiki/{dark,light}.json (run `pnpm build` first), writes
 * reports/theme-compare/{metrics.json,index.html} (gitignored). Method and
 * limits: scripts/theme-compare/README.md.
 */
import { mkdirSync, writeFileSync } from 'node:fs';

import { columns, pct, variants } from './definition';
import { measureAll, loadSamples, type Metrics } from './measure';
import { render } from './report';

const samples = loadSamples(new URL('./samples/', import.meta.url));
const metrics: Metrics[] = await measureAll(variants, samples);

const out = new URL('../../reports/theme-compare/', import.meta.url);
mkdirSync(out, { recursive: true });
writeFileSync(new URL('metrics.json', out), JSON.stringify(metrics, null, 1));
writeFileSync(new URL('index.html', out), render(metrics, columns));

const own = metrics.filter(m => m.family === 'samisdat');
for (const m of own) {
    console.log(
        m.key.padEnd(16),
        `WCAG≥4.5 ${pct(m.wcag.share45)}`,
        `ΔE accents ${m.accentDistance.min.toFixed(3)}`,
        `CVD p/d/t ${m.cvd.protan.min.toFixed(3)}/${m.cvd.deutan.min.toFixed(3)}/${m.cvd.tritan.min.toFixed(3)}`
    );
}
console.log(`Report: ${new URL('index.html', out).pathname}`);
