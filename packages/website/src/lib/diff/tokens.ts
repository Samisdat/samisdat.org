import type { ColorToken, Part } from './types';

/** Words, whitespace runs and single characters: fine enough to see `a(b)` -> `a(b, c)` as two added tokens. */
export const tokenize = (line: string): string[] => line.match(/\s+|\w+|[^\s\w]/g) ?? [];

/**
 * Longest common subsequence of two sequences, as a list of matched index pairs.
 * Where several matchings are equally long, the default takes the earliest match, which places an insertion as late
 * as it can go, like git does. `preferLater` takes the later of two equal items instead.
 */
export function lcsPairs<T>(a: readonly T[], b: readonly T[], preferLater = false): [number, number][] {
    const rows = a.length + 1;
    const cols = b.length + 1;
    const table = Array.from({ length: rows }, () => new Array<number>(cols).fill(0));

    for (let i = a.length - 1; i >= 0; i--) {
        for (let j = b.length - 1; j >= 0; j--) {
            table[i][j] = a[i] === b[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
        }
    }

    const pairs: [number, number][] = [];
    let i = 0;
    let j = 0;
    while (i < a.length && j < b.length) {
        // On a tie, `preferLater` matches the later of two equal items: `a }` -> `a, b }` then marks `, b` as one run
        if (a[i] === b[j] && (!preferLater || table[i][j + 1] !== table[i][j])) {
            pairs.push([i, j]);
            i++;
            j++;
        } else if (table[i + 1][j] >= table[i][j + 1]) {
            i++;
        } else {
            j++;
        }
    }
    return pairs;
}

export type Seg = { text: string; kind: 'same' | 'old' | 'new' };

/** Token diff of one paired line: tokens only in `oldLine` are `old`, only in `newLine` are `new`. */
export function tokenDiff(oldLine: string, newLine: string): Seg[] {
    const a = tokenize(oldLine);
    const b = tokenize(newLine);
    const segs: Seg[] = [];
    const push = (text: string, kind: Seg['kind']) => {
        const last = segs.at(-1);
        if (last?.kind === kind) {
            last.text += text;
        } else {
            segs.push({ text, kind });
        }
    };

    let i = 0;
    let j = 0;
    for (const [mi, mj] of lcsPairs(a, b, true)) {
        while (i < mi) push(a[i++], 'old');
        while (j < mj) push(b[j++], 'new');
        push(a[i], 'same');
        i++;
        j++;
    }
    while (i < a.length) push(a[i++], 'old');
    while (j < b.length) push(b[j++], 'new');

    return segs;
}

/** Number of separate places in a line where something changed: stretches of old/new tokens between unchanged ones. */
export function changeRuns(segs: Seg[]): number {
    let runs = 0;
    let inRun = false;
    for (const { kind } of segs) {
        if (kind === 'same') {
            inRun = false;
        } else if (!inRun) {
            runs++;
            inRun = true;
        }
    }
    return runs;
}

/** Number of changed tokens in a line, whitespace not counted: what was removed plus what was added. */
export function changedTokens(segs: Seg[]): number {
    return segs
        .filter(seg => seg.kind !== 'same')
        .reduce((n, seg) => n + tokenize(seg.text).filter(token => !/^\s+$/.test(token)).length, 0);
}

/** The part of a highlighted line between two character offsets. */
export function colorSlice(tokens: ColorToken[], from: number, to: number): { t: string; c?: string }[] {
    const out: { t: string; c?: string }[] = [];
    let pos = 0;
    for (const { text, color } of tokens) {
        const start = Math.max(from, pos);
        const end = Math.min(to, pos + text.length);
        if (end > start) {
            out.push({ t: text.slice(start - pos, end - pos), c: color });
        }
        pos += text.length;
    }
    return out;
}

/** Colors a line by its syntax tokens. */
export const plainParts = (tokens: ColorToken[]): Part[] => tokens.map(({ text, color }) => ({ t: text, c: color }));

/**
 * Token-diff segments of a paired line, each colored from the highlighted old or new line it came from.
 * `oldStart` / `newStart` are the character offsets where the diffed text begins (after the indentation).
 */
export function coloredSegs(
    segs: Seg[],
    oldTokens: ColorToken[],
    newTokens: ColorToken[],
    oldStart = 0,
    newStart = 0
): Part[] {
    const parts: Part[] = [];
    let oi = oldStart;
    let ni = newStart;
    let group = 0;
    segs.forEach(({ text, kind }, index) => {
        const length = text.length;
        if (kind === 'old') {
            // An old stretch directly followed by a new one is a replacement: both carry the same group
            const g = segs[index + 1]?.kind === 'new' ? ++group : undefined;
            parts.push(...colorSlice(oldTokens, oi, oi + length).map(part => ({ ...part, k: 'old' as const, g })));
            oi += length;
        } else {
            const g = kind === 'new' && segs[index - 1]?.kind === 'old' ? group : undefined;
            parts.push(
                ...colorSlice(newTokens, ni, ni + length).map(part =>
                    kind === 'new' ? { ...part, k: 'new' as const, g } : part
                )
            );
            ni += length;
            if (kind === 'same') oi += length;
        }
    });
    return parts;
}

/**
 * The two sides of a token diff as separate lines: the old line marks only what was removed, the new line only what
 * was added. For lines with too many changes to read inline, where both lines stand one above the other.
 */
export function splitSegs(
    segs: Seg[],
    oldTokens: ColorToken[],
    newTokens: ColorToken[],
    oldStart = 0,
    newStart = 0
): { old: Part[]; new: Part[] } {
    const oldParts: Part[] = [...colorSlice(oldTokens, 0, oldStart)];
    const newParts: Part[] = [...colorSlice(newTokens, 0, newStart)];
    let oi = oldStart;
    let ni = newStart;
    for (const { text, kind } of segs) {
        const length = text.length;
        if (kind !== 'new') {
            oldParts.push(
                ...colorSlice(oldTokens, oi, oi + length).map(part =>
                    kind === 'old' ? { ...part, k: 'old' as const } : part
                )
            );
            oi += length;
        }
        if (kind !== 'old') {
            newParts.push(
                ...colorSlice(newTokens, ni, ni + length).map(part =>
                    kind === 'new' ? { ...part, k: 'new' as const } : part
                )
            );
            ni += length;
        }
    }
    return { old: oldParts, new: newParts };
}
