import { scriptDevice } from '../script';
import { round2 } from './simplify';

import type { Point, Script, Step } from '../script';

const MAX_LINE = 96;
const INDENT = '    ';

const num = (n: number) => String(round2(n));
const pt = ([x, y]: Point) => `[${num(x)}, ${num(y)}]`;

/** Point list packed into lines of at most MAX_LINE characters. */
const pointLines = (points: Point[], indent: string): string[] => {
    const lines: string[] = [];
    let line = '';
    for (const p of points) {
        const piece = `${pt(p)},`;
        if (line !== '' && (indent + line + ' ' + piece).length > MAX_LINE) {
            lines.push(indent + line);
            line = piece;
        } else {
            line = line === '' ? piece : `${line} ${piece}`;
        }
    }
    if (line !== '') {
        lines.push(indent + line);
    }
    return lines;
};

const pathStep = (key: 'pan' | 'move' | 'tilt', points: Point[], ms: number): string[] => {
    const inline = `${INDENT}{ ${key}: [${points.map(pt).join(', ')}], ms: ${num(ms)} },`;
    if (inline.length <= MAX_LINE) {
        return [inline];
    }
    return [
        `${INDENT}{`,
        `${INDENT}${INDENT}${key}: [`,
        ...pointLines(points, INDENT + INDENT + INDENT),
        `${INDENT}${INDENT}],`,
        `${INDENT}${INDENT}ms: ${num(ms)},`,
        `${INDENT}},`,
    ];
};

const stepLines = (step: Step): string[] => {
    if ('tap' in step) {
        return [`${INDENT}{ tap: ${pt(step.tap)} },`];
    }
    if ('click' in step) {
        return [`${INDENT}{ click: ${pt(step.click)} },`];
    }
    if ('pan' in step) {
        return pathStep('pan', step.pan, step.ms);
    }
    if ('move' in step) {
        return pathStep('move', step.move, step.ms);
    }
    if ('tilt' in step) {
        return pathStep('tilt', step.tilt, step.ms);
    }
    return [`${INDENT}{ wait: ${num(step.wait)} },`];
};

/** TypeScript source for a script; with `name` it becomes `export const name = ...`. */
export const scriptToSnippet = (script: Script, name?: string): string => {
    const head = `defineScript('${scriptDevice(script)}', [`;
    const prefix = name ? `export const ${name} = ` : '';
    if (script.length === 0) {
        return `${prefix}${head}]);`;
    }
    return [prefix + head, ...script.flatMap(stepLines), ']);'].join('\n');
};
