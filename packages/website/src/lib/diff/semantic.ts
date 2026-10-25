import ts from 'typescript';

import { lineOps, pairLines, similarity } from './build';
import { changedTokens, tokenDiff, tokenize } from './tokens';

// A diff that knows the syntax tree. This one is built on the TypeScript parser, which stands in for tree-sitter:
// both give the top-level declarations of a file, and that is all this view needs.

export type Decl = { kind: string; name: string; text: string; from: number; to: number };

export type Entry = {
    status: 'added' | 'removed' | 'changed' | 'renamed';
    kind: string;
    name: string;
    oldName?: string;
    /** Line range in the new file (in the old file for removed declarations). */
    lines: [number, number];
    notes: string[];
};

export type SemanticReport = { entries: Entry[]; unchanged: number };

/** Two declarations count as the same one (possibly renamed) from this token similarity on. */
const MATCH_THRESHOLD = 0.5;
/** A removed line counts as moved when an added line elsewhere is at least this similar. */
const MOVE_THRESHOLD = 0.7;
/** A paired line with more changed tokens than this is a rewrite, not a replacement worth naming. */
const REPLACEMENT_MAX_TOKENS = 6;

const quote = (text: string) => `\`${text}\``;

export function parseDecls(source: string): Decl[] {
    const file = ts.createSourceFile('file.ts', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
    const lines = source.split('\n');

    return file.statements.map((node): Decl => {
        const start = file.getLineAndCharacterOfPosition(node.getStart(file, true)).line;
        const end = file.getLineAndCharacterOfPosition(node.getEnd()).line;
        let kind = 'statement';
        let name = '';

        if (ts.isImportDeclaration(node)) {
            kind = 'import';
            name = node.moduleSpecifier.getText(file);
        } else if (ts.isInterfaceDeclaration(node)) {
            kind = 'interface';
            name = node.name.text;
        } else if (ts.isTypeAliasDeclaration(node)) {
            kind = 'type';
            name = node.name.text;
        } else if (ts.isFunctionDeclaration(node)) {
            kind = 'function';
            name = node.name?.text ?? '';
        } else if (ts.isVariableStatement(node)) {
            kind = 'const';
            name = node.declarationList.declarations[0].name.getText(file);
        }

        return { kind, name, text: lines.slice(start, end + 1).join('\n'), from: start + 1, to: end + 1 };
    });
}

type Pair = { old: Decl; new: Decl };

/** Matches old and new declarations: identical ones first, then by similarity, so a rename follows its body. */
function matchDecls(oldDecls: Decl[], newDecls: Decl[]) {
    const pairs: Pair[] = [];
    const freeOld = new Set(oldDecls);
    const freeNew = new Set(newDecls);

    for (const o of oldDecls) {
        const same = [...freeNew].find(n => n.kind === o.kind && n.name === o.name && n.text === o.text);
        if (same) {
            pairs.push({ old: o, new: same });
            freeOld.delete(o);
            freeNew.delete(same);
        }
    }

    const scored = [...freeOld].flatMap(o =>
        [...freeNew]
            .filter(n => n.kind === o.kind)
            .map(n => ({ o, n, score: similarity(o.text, n.text) + (o.name === n.name ? 0.15 : 0) }))
    );
    scored.sort((a, b) => b.score - a.score);
    for (const { o, n, score } of scored) {
        if (score < MATCH_THRESHOLD || !freeOld.has(o) || !freeNew.has(n)) continue;
        pairs.push({ old: o, new: n });
        freeOld.delete(o);
        freeNew.delete(n);
    }

    return { pairs, removed: [...freeOld], added: [...freeNew] };
}

type LineChanges = {
    replacements: Map<string, number>;
    deletions: Map<string, number>;
    removedLines: string[];
    addedLines: string[];
};

/** What changed inside one declaration: named replacements, and the lines that have no counterpart. */
function lineChanges(oldText: string, newText: string): LineChanges {
    const oldLines = oldText.split('\n');
    const newLines = newText.split('\n');
    const result: LineChanges = { replacements: new Map(), deletions: new Map(), removedLines: [], addedLines: [] };
    const tally = (map: Map<string, number>, key: string) => map.set(key, (map.get(key) ?? 0) + 1);

    const ops = lineOps(oldLines, newLines);
    for (let i = 0; i < ops.length;) {
        if (ops[i].type === 'same') {
            i++;
            continue;
        }
        const removed: string[] = [];
        const added: string[] = [];
        while (i < ops.length && ops[i].type !== 'same') {
            const op = ops[i];
            if (op.type === 'del') removed.push(oldLines[op.a]);
            if (op.type === 'add') added.push(newLines[op.b]);
            i++;
        }

        for (const pairing of pairLines(removed, added)) {
            if (pairing.type === 'del') {
                result.removedLines.push(removed[pairing.a]);
                continue;
            }
            if (pairing.type === 'add') {
                result.addedLines.push(added[pairing.b]);
                continue;
            }

            const o = removed[pairing.a];
            const n = added[pairing.b];
            if (o.replace(/\s+/g, '') === n.replace(/\s+/g, '')) continue;
            const segs = tokenDiff(o.trim(), n.trim());
            if (changedTokens(segs) > REPLACEMENT_MAX_TOKENS) {
                result.removedLines.push(o);
                result.addedLines.push(n);
                continue;
            }
            for (let s = 0; s < segs.length; s++) {
                if (segs[s].kind === 'same') continue;
                const next = segs[s + 1];
                if (segs[s].kind === 'old' && next?.kind === 'new') {
                    // A lone bracket turning into something else is layout, not a replacement worth naming
                    if (!/^[{}()[\];,]$/.test(segs[s].text.trim())) {
                        tally(result.replacements, `${segs[s].text.trim()} → ${next.text.trim()}`);
                    }
                    s++;
                } else if (segs[s].kind === 'old') {
                    tally(result.deletions, segs[s].text.trim());
                }
            }
        }
    }
    return result;
}

const count = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

export function analyze(oldSource: string, newSource: string): SemanticReport {
    const { pairs, removed, added } = matchDecls(parseDecls(oldSource), parseDecls(newSource));
    const changes = new Map<Pair, LineChanges>();
    const entries: Entry[] = [];

    for (const pair of pairs) {
        if (pair.old.name === pair.new.name && pair.old.text === pair.new.text) continue;
        changes.set(pair, lineChanges(pair.old.text, pair.new.text));
    }

    // Lines that vanished in one declaration and turn up, similar, in another one. A declaration is identified by `id`,
    // not by its name: a renamed one is still the same declaration.
    type Place = { id: string; name: string; lines: string[] };
    const sources: Place[] = [
        ...[...changes].map(([pair, c]) => ({
            id: `p${pairs.indexOf(pair)}`,
            name: pair.new.name,
            lines: c.removedLines,
        })),
        ...removed.map((decl, i) => ({ id: `r${i}`, name: decl.name, lines: decl.text.split('\n') })),
    ];
    const targets: Place[] = [
        ...[...changes].map(([pair, c]) => ({
            id: `p${pairs.indexOf(pair)}`,
            name: pair.new.name,
            lines: c.addedLines,
        })),
        ...added.map((decl, i) => ({ id: `a${i}`, name: decl.name, lines: decl.text.split('\n') })),
    ];
    type Move = { from: Place; to: Place; n: number; identical: boolean };
    const moves = new Map<string, Move>();
    const taken = new Set<string>();
    for (const source of sources) {
        for (const line of source.lines) {
            if (tokenize(line).filter(t => !/^\s+$/.test(t)).length < 3 || /^\s*(\/\/|\/?\*)/.test(line)) continue;
            let best: { target: Place; text: string; score: number } | undefined;
            for (const target of targets) {
                if (target.id === source.id) continue;
                for (const candidate of target.lines) {
                    const score = similarity(line, candidate);
                    if (
                        score >= MOVE_THRESHOLD &&
                        !taken.has(`${target.id}\0${candidate}`) &&
                        (!best || score > best.score)
                    ) {
                        best = { target, text: candidate, score };
                    }
                }
            }
            if (!best) continue;
            taken.add(`${best.target.id}\0${best.text}`);
            const key = `${source.id}\0${best.target.id}`;
            const move = moves.get(key) ?? { from: source, to: best.target, n: 0, identical: true };
            move.n++;
            move.identical &&= line.trim() === best.text.trim();
            moves.set(key, move);
        }
    }
    const idOfPair = (pair: Pair) => `p${pairs.indexOf(pair)}`;

    for (const pair of pairs) {
        const c = changes.get(pair);
        if (!c) continue;

        const notes: string[] = [];
        for (const [text, n] of [...c.replacements].sort((a, b) => b[1] - a[1]).slice(0, 3)) {
            const [from, to] = text.split(' → ');
            notes.push(`${quote(from)} → ${quote(to)}${n > 1 ? ` (${n}×)` : ''}`);
        }
        for (const [text, n] of [...c.deletions].sort((a, b) => b[1] - a[1]).slice(0, 2)) {
            notes.push(`${quote(text)} entfernt${n > 1 ? ` (${n}×)` : ''}`);
        }
        for (const move of moves.values()) {
            if (move.from.id === idOfPair(pair)) {
                notes.push(
                    `${count(move.n, 'Zeile', 'Zeilen')} nach ${quote(move.to.name)} verschoben${move.identical ? '' : ' und angepasst'}`
                );
            }
            if (move.to.id === idOfPair(pair)) {
                notes.push(
                    `${count(move.n, 'Zeile', 'Zeilen')} aus ${quote(move.from.name)} übernommen${move.identical ? '' : ', angepasst'}`
                );
            }
        }
        const moved = [...moves.values()].filter(m => m.from.id === idOfPair(pair)).reduce((n, m) => n + m.n, 0);
        const gone = c.removedLines.length - moved;
        if (gone > 0) notes.push(`${count(gone, 'Zeile', 'Zeilen')} entfernt`);
        const fresh =
            c.addedLines.length -
            [...moves.values()].filter(m => m.to.id === idOfPair(pair)).reduce((n, m) => n + m.n, 0);
        if (fresh > 0) notes.push(`${count(fresh, 'Zeile', 'Zeilen')} neu`);

        entries.push({
            status: pair.old.name === pair.new.name ? 'changed' : 'renamed',
            kind: pair.new.kind,
            name: pair.new.name,
            oldName: pair.old.name === pair.new.name ? undefined : pair.old.name,
            lines: [pair.new.from, pair.new.to],
            notes,
        });
    }

    added.forEach((decl, i) => {
        const notes = [...moves.values()]
            .filter(move => move.to.id === `a${i}`)
            .map(
                move =>
                    `${count(move.n, 'Zeile', 'Zeilen')} aus ${quote(move.from.name)} übernommen${move.identical ? '' : ', angepasst'}`
            );
        entries.push({ status: 'added', kind: decl.kind, name: decl.name, lines: [decl.from, decl.to], notes });
    });
    for (const decl of removed) {
        entries.push({ status: 'removed', kind: decl.kind, name: decl.name, lines: [decl.from, decl.to], notes: [] });
    }

    entries.sort(
        (a, b) => (a.status === 'removed' ? 1 : 0) - (b.status === 'removed' ? 1 : 0) || a.lines[0] - b.lines[0]
    );
    return { entries, unchanged: pairs.length - changes.size };
}
