import { styled } from '@linaria/react';
import { shikiTheme } from '@samisdat/ui-components/utils/shikiTheme';
import { createHash } from 'crypto';
import { readFileSync } from 'fs';
import path from 'path';
import { getSingletonHighlighter } from 'shiki';

import { parseAnsi } from '@/lib/diff/ansi';
import { buildItems, unifiedDiff } from '@/lib/diff/build';
import { analyze } from '@/lib/diff/semantic';
import type { ColorToken } from '@/lib/diff/types';

import { DiffIntegrated } from './DiffIntegrated';
import { DiffSemantic } from './DiffSemantic';
import { DiffTerminal } from './DiffTerminal';
import { DiffUnified } from './DiffUnified';

const DIR = path.join(process.cwd(), 'content/diff-demo');

/** Highlighting a fixture is the slow part, and the same fixtures appear in several steps: do it once per text. */
const highlighted = new Map<string, Promise<ColorToken[][]>>();

function highlight(code: string): Promise<ColorToken[][]> {
    let tokens = highlighted.get(code);
    if (!tokens) {
        tokens = (async () => {
            const highlighter = await getSingletonHighlighter({ themes: [shikiTheme], langs: ['tsx'] });
            const result = highlighter.codeToTokens(code, { lang: 'tsx', theme: shikiTheme.name! });
            return result.tokens.map(line => line.map(({ content, color }) => ({ text: content, color })));
        })();
        highlighted.set(code, tokens);
    }
    return tokens;
}

/** The abbreviated hash git stores a file's content under (`git hash-object`). */
const blobHash = (content: string): string =>
    createHash('sha1')
        .update(`blob ${Buffer.byteLength(content)}\0`)
        .update(content)
        .digest('hex')
        .slice(0, 7);

/**
 * Recorded output of `difft` for the whole story, content/diff-demo/story/difft.ansi:
 * `difft --color always --background dark --display side-by-side --width 120 <v0> <v8>`
 */
export function DifftasticDemo({ file }: { file: string }) {
    const raw = readFileSync(path.join(DIR, 'story', 'difft.ansi'), 'utf8');

    return (
        <DiffTerminal
            lines={parseAnsi(raw)}
            label={`Difftastic: ${file}`}
        />
    );
}

/** The change by declaration, as a diff that knows the syntax tree could show it (here built on the TypeScript parser). */
export function SemanticDemo({ file }: { file: string }) {
    const before = readVersion(0);
    const after = readVersion(STEPS);

    return (
        <DiffSemantic
            report={analyze(before, after)}
            file={file}
            language="TypeScript"
        />
    );
}

/** Version n of the story file: v0 is where it starts, v8 where it ends (content/diff-demo/story/vN.txt). */
const readVersion = (n: number): string => readFileSync(path.join(DIR, 'story', `v${n}.txt`), 'utf8');

const Step = styled.figure`
    display: grid;
    gap: 12px;
    margin: 0;

    figcaption {
        margin-block-end: -6px;
        font-family: var(--font-body);
        font-size: 14px;
        letter-spacing: 0;
        color: var(--color-text-muted);
    }
`;

const STEPS = 8;

/**
 * A part of the story, told twice: the classic diff without color, then the integrated view. The story is one
 * made-up file in eight small steps (content/diff-demo/story/v0..v8.txt): v0 is where it starts, v8 where it ends.
 * `step` is one step, `from` and `to` a range of versions (0 to 8 is the whole change). Only the diffs asked for with
 * `header` show the file header, the others leave it out to stay readable.
 */
export async function DiffStepDemo({
    step,
    from = step === undefined ? 0 : step - 1,
    to = step ?? STEPS,
    file,
    header = false,
}: {
    step?: number;
    from?: number;
    to?: number;
    file: string;
    header?: boolean;
}) {
    if (![from, to].every(Number.isInteger) || from < 0 || to > STEPS || from >= to) {
        throw new Error(`Invalid diff range: ${from}..${to}`);
    }
    const before = readVersion(from);
    const after = readVersion(to);
    const [beforeTokens, afterTokens] = await Promise.all([highlight(before), highlight(after)]);
    const which = to - from === 1 ? `Schritt ${to}` : `Schritte ${from + 1} bis ${to}`;

    return (
        <Step>
            <figcaption>Klassisch, ohne Farbe</figcaption>
            <DiffUnified
                plain
                header={
                    header
                        ? [
                              `diff --git a/${file} b/${file}`,
                              `index ${blobHash(before)}..${blobHash(after)} 100644`,
                              `--- a/${file}`,
                              `+++ b/${file}`,
                          ]
                        : undefined
                }
                hunks={unifiedDiff(before, after)}
                label={`Klassisches Diff, ${which}`}
            />
            <figcaption>Integriert</figcaption>
            <DiffIntegrated
                items={buildItems(before, after, beforeTokens, afterTokens)}
                file={file}
            />
        </Step>
    );
}
