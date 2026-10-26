import {
    changedTokens,
    changeRuns,
    coloredSegs,
    colorSlice,
    lcsPairs,
    plainParts,
    splitSegs,
    tokenDiff,
    tokenize,
    type Seg,
} from './tokens';
import type { ColorToken, Item, Line, Part, RemovedLine, UnifiedHunk } from './types';

const PAIR_THRESHOLD = 0.35;
/** A line shows its changes inline, each replacement as old and new together, up to this many places and changed tokens. */
const INLINE_MAX_RUNS = 3;
const INLINE_MAX_TOKENS = 10;
/** Unchanged lines kept visible around a change; longer runs fold. */
const CONTEXT = 2;

const splitLines = (text: string): string[] => {
    const lines = text.split('\n');
    return lines.at(-1) === '' ? lines.slice(0, -1) : lines;
};

type Op = { type: 'same'; a: number; b: number } | { type: 'del'; a: number } | { type: 'add'; b: number };

/** Line diff: the lines both versions have in common stay, everything else is deleted or added. */
export function lineOps(a: string[], b: string[]): Op[] {
    const ops: Op[] = [];
    let i = 0;
    let j = 0;
    for (const [mi, mj] of lcsPairs(a, b)) {
        while (i < mi) ops.push({ type: 'del', a: i++ });
        while (j < mj) ops.push({ type: 'add', b: j++ });
        ops.push({ type: 'same', a: i++, b: j++ });
    }
    while (i < a.length) ops.push({ type: 'del', a: i++ });
    while (j < b.length) ops.push({ type: 'add', b: j++ });
    return ops;
}

/** Similarity of two lines by their non-whitespace tokens (Dice coefficient); 1 when only whitespace differs. */
export function similarity(a: string, b: string): number {
    const words = (line: string) => tokenize(line).filter(token => !/^\s+$/.test(token));
    const left = words(a);
    const right = words(b);
    if (left.length + right.length === 0) return 1;
    const pool = new Map<string, number>();
    for (const word of right) pool.set(word, (pool.get(word) ?? 0) + 1);
    let common = 0;
    for (const word of left) {
        const free = pool.get(word) ?? 0;
        if (free > 0) {
            common++;
            pool.set(word, free - 1);
        }
    }
    return (2 * common) / (left.length + right.length);
}

type Pairing = { type: 'pair'; a: number; b: number } | { type: 'del'; a: number } | { type: 'add'; b: number };

/** Aligns the deleted and the added lines of one change (Needleman-Wunsch): similar lines pair up, the rest stays deleted or added. */
export function pairLines(oldLines: string[], newLines: string[]): Pairing[] {
    const n = oldLines.length;
    const m = newLines.length;
    const sim = oldLines.map(o => newLines.map(x => similarity(o, x)));
    const score = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));

    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            const s = sim[i - 1][j - 1];
            score[i][j] = Math.max(
                score[i - 1][j],
                score[i][j - 1],
                s >= PAIR_THRESHOLD ? score[i - 1][j - 1] + s : -Infinity
            );
        }
    }

    const reversed: Pairing[] = [];
    let i = n;
    let j = m;
    while (i > 0 || j > 0) {
        const s = i > 0 && j > 0 ? sim[i - 1][j - 1] : 0;
        if (i > 0 && j > 0 && s >= PAIR_THRESHOLD && score[i][j] === score[i - 1][j - 1] + s) {
            reversed.push({ type: 'pair', a: --i, b: --j });
        } else if (i > 0 && (j === 0 || score[i][j] === score[i - 1][j])) {
            reversed.push({ type: 'del', a: --i });
        } else {
            reversed.push({ type: 'add', b: --j });
        }
    }
    const ordered = reversed.reverse();

    // Between two pairs, removed lines come before added ones
    const result: Pairing[] = [];
    let gap: Pairing[] = [];
    const flush = () => {
        result.push(...gap.filter(p => p.type === 'del'), ...gap.filter(p => p.type === 'add'));
        gap = [];
    };
    for (const p of ordered) {
        if (p.type === 'pair') {
            flush();
            result.push(p);
        } else {
            gap.push(p);
        }
    }
    flush();
    return result;
}

const sameParts = (tokens: ColorToken[]): Part[] => plainParts(tokens);

/** One row of a change, in the order of the new file: a line of the new file, or a removed line. */
type Built = { line: Line } | { removed: RemovedLine } | { old: RemovedLine };

function buildChange(
    oldLines: string[],
    newLines: string[],
    oldTokens: ColorToken[][],
    newTokens: ColorToken[][],
    removed: number[],
    added: number[]
): Built[] {
    return pairLines(
        removed.map(i => oldLines[i]),
        added.map(j => newLines[j])
    ).flatMap((pairing): Built[] => {
        if (pairing.type === 'del') {
            const a = removed[pairing.a];
            return [{ removed: { no: a + 1, parts: sameParts(oldTokens[a]) } }];
        }
        if (pairing.type === 'add') {
            const b = added[pairing.b];
            return [{ line: { no: b + 1, kind: 'add', parts: sameParts(newTokens[b]) } }];
        }

        const a = removed[pairing.a];
        const b = added[pairing.b];
        const whitespaceOnly = oldLines[a].replace(/\s+/g, '') === newLines[b].replace(/\s+/g, '');
        if (whitespaceOnly) {
            return [{ line: { no: b + 1, kind: 'ws', parts: sameParts(newTokens[b]) } }];
        }

        // The indentation is not a change worth marking; the new line keeps its own
        const oldIndent = oldLines[a].length - oldLines[a].trimStart().length;
        const newIndent = newLines[b].length - newLines[b].trimStart().length;
        const segs: Seg[] = tokenDiff(oldLines[a].slice(oldIndent), newLines[b].slice(newIndent));

        // Beyond that the old line stands above the new one, as in a classic diff.
        // A line that only gains text has nothing to put above it, so it stays inline however much it gains.
        const onlyInsertions = segs.every(seg => seg.kind !== 'old');
        if (!onlyInsertions && (changeRuns(segs) > INLINE_MAX_RUNS || changedTokens(segs) > INLINE_MAX_TOKENS)) {
            const sides = splitSegs(segs, oldTokens[a], newTokens[b], oldIndent, newIndent);
            return [{ old: { no: a + 1, parts: sides.old } }, { line: { no: b + 1, kind: 'add', parts: sides.new } }];
        }

        const indent = colorSlice(newTokens[b], 0, newIndent);
        return [
            {
                line: {
                    no: b + 1,
                    kind: 'chg',
                    parts: [...indent, ...coloredSegs(segs, oldTokens[a], newTokens[b], oldIndent, newIndent)],
                },
            },
        ];
    });
}

const firstStatement = (lines: Line[]): string => {
    const first = lines.find(line => line.parts.some(part => part.t.trim() !== ''));
    return first
        ? first.parts
              .map(part => part.t)
              .join('')
              .trim()
        : '';
};

/**
 * The integrated view of a change: the new file read top to bottom, with the changes where they happen.
 * Tokens come from a highlighter (one array per line), or are plain text when no colors are wanted.
 */
export function buildItems(
    oldText: string,
    newText: string,
    oldTokens?: ColorToken[][],
    newTokens?: ColorToken[][]
): Item[] {
    const oldLines = splitLines(oldText);
    const newLines = splitLines(newText);
    const oldColored = oldTokens ?? oldLines.map(text => [{ text }]);
    const newColored = newTokens ?? newLines.map(text => [{ text }]);
    const ops = lineOps(oldLines, newLines);

    // Group the ops into unchanged runs and changes
    type Group = { same: Line[] } | { removed: number[]; added: number[] };
    const groups: Group[] = [];
    for (const op of ops) {
        const last = groups.at(-1);
        if (op.type === 'same') {
            const line: Line = { no: op.b + 1, kind: 'same', parts: sameParts(newColored[op.b]) };
            if (last && 'same' in last) last.same.push(line);
            else groups.push({ same: [line] });
        } else {
            const change = last && 'removed' in last ? last : groups[groups.push({ removed: [], added: [] }) - 1];
            if (op.type === 'del' && 'removed' in change) change.removed.push(op.a);
            if (op.type === 'add' && 'added' in change) change.added.push(op.b);
        }
    }

    const items: Item[] = [];
    groups.forEach((group, index) => {
        if ('same' in group) {
            const first = index === 0;
            const last = index === groups.length - 1;
            const head = first ? 0 : CONTEXT;
            const tail = last ? 0 : CONTEXT;
            // A fold hiding fewer than three lines saves nothing
            if (group.same.length <= head + tail + 2) {
                items.push({ type: 'lines', lines: group.same });
                return;
            }
            const hidden = group.same.slice(head, group.same.length - tail);
            if (head) items.push({ type: 'lines', lines: group.same.slice(0, head) });
            items.push({ type: 'fold', label: firstStatement(hidden), lines: hidden });
            if (tail) items.push({ type: 'lines', lines: group.same.slice(group.same.length - tail) });
            return;
        }

        const rows: Extract<Item, { type: 'change' }>['rows'] = [];
        for (const row of buildChange(oldLines, newLines, oldColored, newColored, group.removed, group.added)) {
            if ('line' in row) {
                rows.push({ type: 'line', line: row.line });
                continue;
            }
            if ('old' in row) {
                rows.push({ type: 'old', line: row.old });
                continue;
            }
            const previous = rows.at(-1);
            if (previous?.type === 'ghost') previous.lines.push(row.removed);
            else rows.push({ type: 'ghost', lines: [row.removed] });
        }

        items.push({ type: 'change', rows });
    });

    return items;
}

/** The classic unified diff: hunks with context lines, removed lines before added ones. */
export function unifiedDiff(oldText: string, newText: string, context = 3): UnifiedHunk[] {
    const oldLines = splitLines(oldText);
    const newLines = splitLines(newText);
    const ops = lineOps(oldLines, newLines);
    const changed = ops.map((op, i) => (op.type === 'same' ? -1 : i)).filter(i => i >= 0);
    if (changed.length === 0) return [];

    // Ranges of ops that belong into one hunk
    const ranges: [number, number][] = [];
    for (const i of changed) {
        const from = Math.max(0, i - context);
        const to = Math.min(ops.length - 1, i + context);
        const last = ranges.at(-1);
        if (last && from <= last[1] + 1) last[1] = to;
        else ranges.push([from, to]);
    }

    return ranges.map(([from, to]) => {
        const slice = ops.slice(from, to + 1);
        const oldStart = slice.find(op => op.type !== 'add');
        const newStart = slice.find(op => op.type !== 'del');
        const oldCount = slice.filter(op => op.type !== 'add').length;
        const newCount = slice.filter(op => op.type !== 'del').length;
        const start = (op: Op | undefined, side: 'a' | 'b', fallback: number) =>
            op && side in op ? (op as unknown as Record<string, number>)[side] + 1 : fallback;
        const oldFrom = oldCount === 0 ? 0 : start(oldStart, 'a', 0);
        // Like git, name the enclosing declaration: the last line before the hunk that starts with a letter, $ or _
        const context = oldLines
            .slice(0, Math.max(0, oldFrom - 1))
            .reverse()
            .find(line => /^[A-Za-z$_]/.test(line));
        const header = `@@ -${oldFrom},${oldCount} +${newCount === 0 ? 0 : start(newStart, 'b', 0)},${newCount} @@`;

        // Within a run of changes the removed lines come first
        const lines: UnifiedHunk['lines'] = [];
        let pendingAdds: string[] = [];
        for (const op of slice) {
            if (op.type === 'add') {
                pendingAdds.push(newLines[op.b]);
                continue;
            }
            if (op.type === 'del') {
                lines.push({ prefix: '-', text: oldLines[op.a] });
                continue;
            }
            lines.push(...pendingAdds.map(text => ({ prefix: '+' as const, text })));
            pendingAdds = [];
            lines.push({ prefix: ' ', text: newLines[op.b] });
        }
        lines.push(...pendingAdds.map(text => ({ prefix: '+' as const, text })));
        return { header, context: context?.slice(0, 80), lines };
    });
}
