/**
 * Fill distinguishability lint: the opaque fills `highlight` (CursorLine,
 * file-tree row, picker selection) and `selection` (Visual, Search) must be
 * visibly different from the two grounds they sit on, `syntax.background`
 * (editor) and `surface.default` (sidebars, floats), and `selection` must be
 * at least as strong as `highlight` so a selection inside the cursor line
 * stays visible.
 *
 * The contrast matrix only checks text on these fills; a fill that is readable
 * but nearly the ground color (light mode used to give ΔE OK 0.06) passes it.
 * Threshold: ΔE OK (OKLab, Euclidean) >= MIN_FILL_DELTA_E, compared unrounded.
 *
 * nvim (dark only, the theme is not emitted for light): `nvim.cursorline` and
 * `nvim.visual` against the same two grounds, and against each other so a
 * Visual selection inside the cursor line stays visible.
 */
import { differenceEuclidean, parse } from 'culori';

import { semantic } from '../generated/semantic';
import { modes } from '../src/contrast';
import { MIN_FILL_DELTA_E, MIN_NVIM_FILL_DELTA_E } from './thresholds';

const FILLS = ['highlight', 'selection'] as const;
const NVIM_FILLS = ['nvim.cursorline', 'nvim.visual'] as const;
const GROUNDS = ['syntax.background', 'surface.default'] as const;
const deltaE = differenceEuclidean('oklab');

const errors: string[] = [];
let checked = 0;

for (const mode of modes) {
    const values = semantic[mode] as Record<string, string>;
    const distance = (a: string, b: string) => deltaE(parse(values[a])!, parse(values[b])!);

    for (const fill of FILLS) {
        for (const ground of GROUNDS) {
            const d = distance(fill, ground);
            checked++;
            const min = MIN_FILL_DELTA_E[mode][fill];
            if (d < min) {
                errors.push(`${mode}: ${fill} on ${ground} ΔE OK ${d.toFixed(4)} < ${min}`);
            }
        }
    }
    for (const ground of GROUNDS) {
        const strong = distance('selection', ground);
        const weak = distance('highlight', ground);
        checked++;
        if (strong < weak) {
            errors.push(
                `${mode}: selection (ΔE OK ${strong.toFixed(4)}) weaker than highlight (${weak.toFixed(4)}) on ${ground}`
            );
        }
    }
    if (mode === 'dark') {
        for (const fill of NVIM_FILLS) {
            for (const ground of GROUNDS) {
                const d = distance(fill, ground);
                checked++;
                if (d < MIN_NVIM_FILL_DELTA_E.ground) {
                    errors.push(
                        `${mode}: ${fill} on ${ground} ΔE OK ${d.toFixed(4)} < ${MIN_NVIM_FILL_DELTA_E.ground}`
                    );
                }
            }
        }
        const between = distance('nvim.cursorline', 'nvim.visual');
        checked++;
        if (between < MIN_NVIM_FILL_DELTA_E.between) {
            errors.push(
                `${mode}: nvim.visual vs nvim.cursorline ΔE OK ${between.toFixed(4)} < ${MIN_NVIM_FILL_DELTA_E.between}`
            );
        }
        console.log(
            `${mode}: ` +
                NVIM_FILLS.map(f => `${f} ${GROUNDS.map(g => distance(f, g).toFixed(3)).join('/')}`).join(', ') +
                `, visual vs cursorline ${between.toFixed(3)}`
        );
    }
    console.log(
        `${mode}: ` +
            FILLS.map(f => `${f} ${GROUNDS.map(g => distance(f, g).toFixed(3)).join('/')}`).join(', ') +
            ` (ΔE OK on ${GROUNDS.join('/')})`
    );
}

if (errors.length > 0) {
    console.error(`\nFill distinguishability check failed:\n${errors.map(e => `  ${e}`).join('\n')}`);
    process.exit(1);
}
console.log(
    `Fill distinguishability check passed (${checked} checks; gates dark ${MIN_FILL_DELTA_E.dark.highlight}/${MIN_FILL_DELTA_E.dark.selection}, light ${MIN_FILL_DELTA_E.light.highlight}/${MIN_FILL_DELTA_E.light.selection} highlight/selection)`
);
