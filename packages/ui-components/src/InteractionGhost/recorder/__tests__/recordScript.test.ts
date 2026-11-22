import { describe, expect, it } from 'vitest';

import { defineScript, scriptDevice } from '../../script';
import { evaluate, totalDuration } from '../../timeline';
import { normFromPointer, recordScript, scriptToSnippet } from '../index';

import type { Script } from '../../script';
import type { RecordedEvent } from '../types';

const ev = (type: RecordedEvent['type'], t: number, x: number, y: number): RecordedEvent => ({ type, t, x, y });

const mouseEvents: RecordedEvent[] = [
    ...Array.from({ length: 80 }, (_, i) => ev('move', i * 20, -0.6 + i * 0.015, 0.4 * Math.sin(i / 12))),
    ev('click', 1700, 0.5, 0.3),
    ev('move', 2400, 0.1, 0.1),
    ev('move', 2600, 0.2, 0.2),
];

const roundtrip = (snippet: string): Script =>
    new Function('defineScript', `return ${snippet.replace(/^export const \w+ = /, '')}`)(defineScript);

describe('recordScript', () => {
    const script = recordScript(mouseEvents, 'mouse');

    it('produces a device script', () => {
        expect(scriptDevice(script)).toBe('mouse');
        expect(script.map(s => Object.keys(s)[0])).toEqual(['move', 'click', 'wait', 'move']);
    });

    it('snippet evals back to the same script', () => {
        const snippet = scriptToSnippet(script);
        expect(snippet.startsWith("defineScript('mouse', [\n")).toBe(true);
        expect(snippet.endsWith(']);')).toBe(true);
        const back = roundtrip(snippet);
        expect([...back]).toEqual([...script]);
        expect(scriptDevice(back)).toBe('mouse');
    });

    it('wraps long lines, keeps numbers at two decimals', () => {
        const long = defineScript('pad', [
            {
                pan: Array.from({ length: 12 }, (_, i): [number, number] => [
                    Math.round(-91 + i * 10) / 100,
                    Math.round(33 - i * 5) / 100,
                ]),
                ms: 1234,
            },
            { tap: [0.5, -0.5] },
            { wait: 600 },
            {
                tilt: [
                    [0, 0],
                    [0.5, 0.5],
                ],
                ms: 500,
            },
        ]);
        const snippet = scriptToSnippet(long, 'demo');
        expect(Math.max(...snippet.split('\n').map(l => l.length))).toBeLessThan(100);
        expect(snippet.match(/\d+\.\d{3,}/)).toBeNull();
        expect(snippet.startsWith('export const demo = ')).toBe(true);
        expect([...roundtrip(snippet)]).toEqual([...long]);
    });

    it('handles an empty script', () => {
        expect([...roundtrip(scriptToSnippet(recordScript([], 'pad')))]).toEqual([]);
    });

    it('can be played back with evaluate', () => {
        const total = totalDuration(script);
        expect(total).toBeGreaterThan(0);
        const frame = evaluate(script, total / 4);
        expect(Number.isFinite(frame.norm.x)).toBe(true);
        expect(Number.isFinite(frame.norm.y)).toBe(true);
        const padFrame = evaluate(
            recordScript([ev('down', 0, -0.5, 0), ev('move', 200, 0, 0.3), ev('up', 600, 0.5, 0)], 'pad'),
            400
        );
        expect(padFrame.phase).toBe('pan');
    });
});

describe('normFromPointer', () => {
    const rect = { left: 100, top: 50, width: 200, height: 100 };
    it('maps and clamps', () => {
        expect(normFromPointer(200, 100, rect)).toEqual({ x: 0, y: 0 });
        expect(normFromPointer(100, 50, rect)).toEqual({ x: -1, y: -1 });
        expect(normFromPointer(900, -40, rect)).toEqual({ x: 1, y: -1 });
        expect(normFromPointer(1, 1, { left: 0, top: 0, width: 0, height: 0 })).toEqual({ x: 0, y: 0 });
    });
});
