/**
 * Name distance of the inks (Heer & Stone, c3): are two inks also *named*
 * differently, not just far apart in OKLab? Per mode, prints the most likely
 * names of every `ink.*` and the Hellinger name distance of every ink pair
 * (see name-model.ts), closest pairs first. Measurement only, no gate: whether
 * this becomes a lint is documented in the README ("Farbnamen").
 */
import { semantic } from '../generated/semantic';
import { modes } from '../src/contrast';
import { hellinger, labOf, loadNameModel, nearestCell, topTerms } from './name-model';

const model = loadNameModel();
const percent = (p: number) => `${Math.round(p * 100)} %`;

for (const mode of modes) {
    const values = semantic[mode] as Record<string, string>;
    const inks = Object.keys(values)
        .filter(id => id.startsWith('ink.'))
        .map(id => {
            const { cell, distance } = nearestCell(model, labOf(values[id]));
            return { id, cell, gap: distance, names: topTerms(model, cell, 3) };
        });

    console.log(`\n== ${mode} ==`);
    for (const ink of inks) {
        const names = ink.names.map(n => `${n.term} ${percent(n.p)}`).join(', ');
        console.log(`${ink.id.padEnd(12)} ${names.padEnd(40)} (Abstand zur Modellzelle ΔE ${ink.gap.toFixed(1)})`);
    }

    const pairs = inks.flatMap((a, i) =>
        inks.slice(i + 1).map(b => ({
            a: a.id,
            b: b.id,
            h: hellinger(model, a.cell, b.cell),
            sameName: a.names[0].term === b.names[0].term,
        }))
    );
    pairs.sort((x, y) => x.h - y.h);
    const same = pairs.filter(p => p.sameName);
    console.log(
        `\n${same.length} of ${pairs.length} pairs share their most likely name, smallest name distance ${pairs[0].h.toFixed(3)} (${pairs[0].a} ~ ${pairs[0].b})`
    );
    console.log(`\nclosest name distances (${pairs.length} pairs):`);
    for (const p of pairs.slice(0, 12)) {
        console.log(`${p.a.padEnd(12)} ${p.b.padEnd(12)} H ${p.h.toFixed(3)}${p.sameName ? '  same top name' : ''}`);
    }
}
