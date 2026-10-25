'use client';

import { styled } from '@linaria/react';
import { FC, ReactNode, useState } from 'react';

import type { Item, Line, Part } from '@/lib/diff/types';

const Wrap = styled.div`
    --row: 1.7em;

    border-radius: 8px;
    background: var(--color-syntax-background, var(--color-surface-emphasis));
    font-family: var(--font-code);
    font-size: 13px;
    letter-spacing: 0;
    line-height: var(--row);
    color: var(--color-text-default);

    .code:focus-visible {
        outline: 2px solid var(--color-border-focus);
        outline-offset: 2px;
    }

    .code {
        overflow-x: auto;
    }

    .inner {
        width: max-content;
        min-width: 100%;
    }

    .row {
        display: grid;
        grid-template-columns: 3px 3.4em minmax(0, 1fr);
        min-height: var(--row);
    }

    .ln {
        padding-right: 10px;
        text-align: right;
        color: var(--color-text-muted);
        user-select: none;
    }

    .cd {
        padding: 0 16px 0 8px;
        white-space: pre;
    }

    /* Left gutter: the kind of change */
    .row[data-k='add'] > .mk {
        background: var(--color-ink-jade);
    }

    .row[data-k='chg'] > .mk {
        background: var(--color-ink-sapphire);
    }

    .row[data-k='ws'] > .mk {
        background: var(--color-border-muted);
    }

    .row[data-k='ghost'] > .mk {
        background: var(--color-ink-ruby);
    }

    .row[data-k='ws'] .cd {
        color: var(--color-text-subtle);
    }

    .chip {
        display: inline-flex;
        border-radius: 4px;
        overflow: hidden;
        vertical-align: baseline;
    }

    .chip .o {
        padding: 0 4px;
        background: var(--color-diff-delete);
        color: var(--color-text-muted);
        text-decoration: line-through;
    }

    .chip .x {
        padding: 0 3px;
        background: var(--color-border-muted);
        color: var(--color-text-emphasis);
        user-select: none;
    }

    .chip .x::before {
        content: '→';
    }

    .chip .nw {
        padding: 0 4px;
        background: var(--color-diff-add);
        color: var(--color-syntax-diff-plus, var(--color-ink-jade));
    }

    .gone {
        padding: 0 4px;
        border: 1px dashed var(--color-syntax-diff-minus, var(--color-ink-ruby));
        border-radius: 4px;
        color: var(--color-syntax-diff-minus, var(--color-ink-ruby));
        text-decoration: line-through;
    }

    .sr {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
    }

    .old {
        text-decoration: line-through;
        background: var(--color-diff-delete);
        border-radius: 3px;
        color: var(--color-text-muted);
    }

    .new {
        background: var(--color-diff-add);
        border-radius: 3px;
        color: var(--color-syntax-diff-plus, var(--color-ink-jade));
    }

    /*
     * Removed lines: collapsed they are one line, opened they sit in a dashed frame and a label. Both are drawn outside
     * the layout (pseudo-elements and an absolutely placed label), so opening a block moves nothing: the first line
     * stays where the collapsed line was.
     */
    .ghostbox {
        position: relative;
        margin-inline-end: 12px;
        border-right: 1px dashed
            color-mix(in srgb, var(--color-syntax-diff-minus, var(--color-ink-ruby)) 70%, transparent);
    }

    .ghostbox::before,
    .ghostbox::after {
        content: '';
        position: absolute;
        inset-inline: 0;
        height: 0;
        border-top: 1px dashed
            color-mix(in srgb, var(--color-syntax-diff-minus, var(--color-ink-ruby)) 70%, transparent);
        pointer-events: none;
    }

    .ghostbox::before {
        top: 0;
    }

    .ghostbox::after {
        bottom: 0;
    }

    .boxlabel {
        position: absolute;
        top: -0.8em;
        right: 12px;
        z-index: 1;
        padding: 0 8px;
        border-radius: 4px;
        background: var(--color-syntax-background, var(--color-surface-emphasis));
        font-family: var(--font-body);
        font-size: 12px;
        line-height: 1.6;
        color: var(--color-syntax-diff-minus, var(--color-ink-ruby));
        pointer-events: none;
    }

    .row[data-k='ghost'] .ln::before,
    button.ghost[aria-expanded='true'] .ln::before {
        content: '−';
        color: var(--color-syntax-diff-minus, var(--color-ink-ruby));
    }

    .ghost-text {
        opacity: 0.6;
    }

    button.fold,
    button.ghost {
        display: grid;
        grid-template-columns: 3px 3.4em minmax(0, 1fr);
        width: 100%;
        padding: 0;
        border: 0;
        background: none;
        font: inherit;
        text-align: left;
        color: var(--color-text-subtle);
        cursor: pointer;
    }

    button.fold .cd,
    button.ghost .cd {
        font-style: italic;
    }

    button.ghost .mk {
        background: var(--color-ink-ruby);
    }

    /* Opened: the first removed line is the switch back, it reads like the lines below it */
    button.ghost[aria-expanded='true'] .cd {
        font-style: normal;
    }

    button.fold:hover .cd,
    button.ghost:hover .cd {
        color: var(--color-ink-turquoise);
    }

    button.fold:focus-visible,
    button.ghost:focus-visible {
        outline: 2px solid var(--color-border-focus);
        outline-offset: -2px;
    }

    .fold em {
        margin-inline-start: 1.5em;
        font-style: normal;
        color: var(--color-text-muted);
    }
`;

const text = (parts: Part[]) => parts.map(part => part.t).join('');

/** Plain parts, in their syntax colors; marked parts as the classic old/new marks. */
const PlainParts: FC<{ parts: Part[] }> = ({ parts }) => (
    <>
        {parts.map((part, i) =>
            part.k ? (
                <span
                    className={part.k}
                    key={i}
                >
                    {part.t}
                </span>
            ) : (
                <span
                    key={i}
                    style={part.c ? { color: part.c } : undefined}
                >
                    {part.t}
                </span>
            )
        )}
    </>
);

/**
 * A changed line: each replacement shows what stood there and what stands there now, side by side as one chip;
 * a deleted token is a dashed chip, an inserted one is marked green.
 */
const ChipParts: FC<{ parts: Part[] }> = ({ parts }) => {
    const out: ReactNode[] = [];
    for (let i = 0; i < parts.length;) {
        const part = parts[i];
        const key = i;
        const next = (until: (p: Part) => boolean) => {
            const start = i;
            while (i < parts.length && until(parts[i])) i++;
            return parts.slice(start, i);
        };

        if (part.g !== undefined) {
            const group = part.g;
            const was = next(p => p.g === group && p.k === 'old');
            const now = next(p => p.g === group && p.k === 'new');
            out.push(
                <span
                    className="chip"
                    key={key}
                >
                    <span className="o">{text(was)}</span>
                    <span
                        className="x"
                        aria-hidden="true"
                    />
                    <span className="sr">wird zu</span>
                    <span className="nw">{text(now)}</span>
                </span>
            );
        } else if (part.k === 'old') {
            out.push(
                <span
                    className="gone"
                    key={key}
                >
                    {text(next(p => p.k === 'old' && p.g === undefined))}
                </span>
            );
        } else if (part.k === 'new') {
            out.push(
                <span
                    className="new"
                    key={key}
                >
                    {text(next(p => p.k === 'new' && p.g === undefined))}
                </span>
            );
        } else {
            out.push(
                <span
                    key={key}
                    style={part.c ? { color: part.c } : undefined}
                >
                    {part.t}
                </span>
            );
            i++;
        }
    }
    return <>{out}</>;
};

const Parts: FC<{ parts: Part[]; chips?: boolean }> = ({ parts, chips }) =>
    chips ? <ChipParts parts={parts} /> : <PlainParts parts={parts} />;

const Row: FC<{ kind: string; no?: number; parts?: Part[]; textClass?: string; chips?: boolean }> = ({
    kind,
    no,
    parts,
    textClass,
    chips,
}) => (
    <div
        className="row"
        data-k={kind}
    >
        <span
            className="mk"
            aria-hidden="true"
        />
        <span className="ln">{no}</span>
        <span className={`cd ${textClass ?? ''}`}>
            {parts ? (
                <Parts
                    parts={parts}
                    chips={chips}
                />
            ) : null}
        </span>
    </div>
);

const LineRow: FC<{ line: Line }> = ({ line }) => (
    <Row
        kind={line.kind}
        no={line.no}
        parts={line.parts}
        chips={line.kind === 'chg'}
    />
);

const toggle = <T,>(set: Set<T>, value: T): Set<T> => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    return next;
};

const lines = (count: number) => `${count} ${count === 1 ? 'Zeile' : 'Zeilen'}`;

export const DiffIntegrated: FC<{ items: Item[]; file: string }> = ({ items, file }) => {
    const [openFolds, setOpenFolds] = useState<Set<number>>(new Set());
    const [openGhosts, setOpenGhosts] = useState<Set<string>>(new Set());

    return (
        <Wrap
            role="group"
            aria-label={`Integrierter Diff: ${file}`}
        >
            <div
                className="code"
                tabIndex={0}
            >
                <div className="inner">
                    {items.map((item, i) => {
                        if (item.type === 'lines') {
                            return item.lines.map(line => (
                                <LineRow
                                    key={line.no}
                                    line={line}
                                />
                            ));
                        }

                        if (item.type === 'fold') {
                            if (!openFolds.has(i)) {
                                return (
                                    <button
                                        type="button"
                                        className="fold"
                                        key={i}
                                        aria-expanded="false"
                                        onClick={() => setOpenFolds(toggle(openFolds, i))}
                                    >
                                        <span
                                            className="mk"
                                            aria-hidden="true"
                                        />
                                        <span className="ln">{item.lines[0].no}</span>
                                        <span className="cd">
                                            {item.label}
                                            <em>{lines(item.lines.length)} unverändert</em>
                                        </span>
                                    </button>
                                );
                            }
                            // Expanded: the first line is the switch back
                            return item.lines.map((line, n) =>
                                n === 0 ? (
                                    <button
                                        type="button"
                                        className="fold"
                                        key={line.no}
                                        aria-expanded="true"
                                        onClick={() => setOpenFolds(toggle(openFolds, i))}
                                    >
                                        <span
                                            className="mk"
                                            aria-hidden="true"
                                        />
                                        <span className="ln">{line.no}</span>
                                        <span className="cd">
                                            <Parts parts={line.parts} />
                                        </span>
                                    </button>
                                ) : (
                                    <LineRow
                                        key={line.no}
                                        line={line}
                                    />
                                )
                            );
                        }

                        return item.rows.map((row, n) => {
                            if (row.type === 'line') {
                                return (
                                    <LineRow
                                        key={`${i}-${n}`}
                                        line={row.line}
                                    />
                                );
                            }

                            if (row.type === 'old') {
                                return (
                                    <Row
                                        key={`${i}-${n}`}
                                        kind="ghost"
                                        parts={row.line.parts}
                                    />
                                );
                            }

                            const key = `${i}-${n}`;
                            const onClick = () => setOpenGhosts(toggle(openGhosts, key));

                            // Collapsed: one line that only says how many lines were removed
                            if (!openGhosts.has(key)) {
                                return (
                                    <button
                                        type="button"
                                        className="ghost"
                                        key={key}
                                        aria-expanded="false"
                                        onClick={onClick}
                                    >
                                        <span
                                            className="mk"
                                            aria-hidden="true"
                                        />
                                        <span className="ln" />
                                        <span className="cd">− {lines(row.lines.length)} entfernt</span>
                                    </button>
                                );
                            }

                            // Expanded: the first removed line is the switch back
                            return (
                                <div
                                    className="ghostbox"
                                    key={key}
                                >
                                    <span className="boxlabel">− {lines(row.lines.length)} entfernt</span>
                                    {row.lines.map((line, m) =>
                                        m === 0 ? (
                                            <button
                                                type="button"
                                                className="ghost"
                                                key={`${key}-${m}`}
                                                aria-expanded="true"
                                                onClick={onClick}
                                            >
                                                <span
                                                    className="mk"
                                                    aria-hidden="true"
                                                />
                                                <span className="ln" />
                                                <span className="cd ghost-text">
                                                    <Parts parts={line.parts} />
                                                </span>
                                            </button>
                                        ) : (
                                            <Row
                                                key={`${key}-${m}`}
                                                kind="ghost"
                                                parts={line.parts}
                                                textClass="ghost-text"
                                            />
                                        )
                                    )}
                                </div>
                            );
                        });
                    })}
                </div>
            </div>
        </Wrap>
    );
};
