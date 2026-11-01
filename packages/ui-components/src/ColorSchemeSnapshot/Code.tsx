'use client';

import { styled } from '@linaria/react';
import { useState, type FC } from 'react';

import { Segmented } from '../Segmented';
import { cs, useSnapshot } from './frame';
import { Block, Hidden, LevelBadge, Mono, Panel, Scroll, ratio, BlockHeader, type BlockProps } from './ui';

import type { CodeLine } from '@samisdat/color-scheme/snapshot-types';

type CodeData = ReturnType<typeof useSnapshot>['m']['code'];

export const Pre = styled.pre`
    margin: 0;
    padding: 1rem 0;
    border-radius: 10px;
    overflow-x: auto;
    font-family: var(--font-mono, ui-monospace, Menlo, monospace);
    font-size: 0.8125rem;
    line-height: 1.7;
    tab-size: 2;
    font-variant-ligatures: none;
`;

export const Line = styled.div`
    display: grid;
    grid-template-columns: 1.75rem 1fr;
    width: max-content;
    min-width: 100%;

    > span:first-child {
        text-align: center;
        user-select: none;
    }

    > span:last-child {
        white-space: pre;
        padding: 0 1.25rem 0 0.5rem;
    }
`;

export const Tokens: FC<{ line: CodeLine; fallback: string }> = ({ line, fallback }) => (
    <>
        {line.map((t, i) => (
            <span
                key={i}
                style={{
                    color: t.f ?? fallback,
                    fontStyle: t.s === 'italic' ? 'italic' : undefined,
                    fontWeight: t.s === 'bold' ? 700 : undefined,
                }}
            >
                {t.c}
            </span>
        ))}
    </>
);

const Legend = styled.table`
    width: 100%;
    min-width: 30rem;
    border-collapse: collapse;
    font-size: 0.8125rem;

    th,
    td {
        padding: 0.3rem 0.5rem;
        text-align: left;
        border-bottom: 1px solid var(--cs-border-muted);
        font-weight: 400;
        white-space: nowrap;
    }

    i {
        display: inline-block;
        width: 0.8rem;
        height: 0.8rem;
        margin-right: 0.5rem;
        border-radius: 3px;
        vertical-align: -1px;
        border: 1px solid var(--cs-border-default);
    }
`;

const ThemeLines = ({ code }: { code: CodeData }) => (
    <Pre style={{ color: code.fg }}>
        <code>
            {code.theme.map((line, i) => (
                <Line key={i}>
                    <span aria-hidden="true" />
                    <span>
                        <Tokens
                            line={line}
                            fallback={code.fg}
                        />
                        {line.length === 0 ? ' ' : null}
                    </span>
                </Line>
            ))}
        </code>
    </Pre>
);

const DiffLines = ({ code }: { code: CodeData }) => (
    <Pre style={{ color: code.fg }}>
        <code>
            {code.diff.map((row, i) => (
                <Line
                    key={i}
                    style={{
                        background:
                            row.kind === 'add' ? cs('diff.add') : row.kind === 'del' ? cs('diff.delete') : undefined,
                    }}
                >
                    <span
                        aria-hidden="true"
                        style={{
                            color: row.kind === 'add' ? cs('syntax.diff-plus') : cs('syntax.diff-minus'),
                        }}
                    >
                        {row.kind === 'add' ? '+' : row.kind === 'del' ? '-' : ''}
                    </span>
                    <span>
                        {row.kind === 'add' ? <Hidden>Hinzugefügt: </Hidden> : null}
                        {row.kind === 'del' ? <Hidden>Entfernt: </Hidden> : null}
                        {row.kind === 'hunk' ? (
                            <span style={{ color: cs('syntax.string-special') }}>{row.line[0].c}</span>
                        ) : (
                            <Tokens
                                line={row.line}
                                fallback={code.fg}
                            />
                        )}
                    </span>
                </Line>
            ))}
        </code>
    </Pre>
);

export const SnapshotCode: FC<BlockProps> = props => {
    const { m } = useSnapshot();
    const [tab, setTab] = useState<'theme' | 'diff'>('theme');
    const { code } = m;

    return (
        <Block>
            <BlockHeader
                {...props}
                aside={
                    <Segmented
                        label="Beispiel"
                        value={tab}
                        onChange={setTab}
                        options={[
                            { value: 'theme', label: 'Theme' },
                            { value: 'diff', label: 'Diff' },
                        ]}
                    />
                }
            />
            <Panel style={{ background: code.bg, padding: 0 }}>
                {tab === 'theme' ? <ThemeLines code={code} /> : <DiffLines code={code} />}
            </Panel>
            <Scroll>
                <Legend>
                    <thead>
                        <tr>
                            <th>Rolle</th>
                            <th>Farbe</th>
                            <th>WCAG</th>
                        </tr>
                    </thead>
                    <tbody>
                        {code.legend.map(e => (
                            <tr key={e.id}>
                                <th scope="row">
                                    <Mono>{e.id.replace('syntax.', '')}</Mono>
                                </th>
                                <td>
                                    <i style={{ background: e.hex }} />
                                    <Mono>{e.hex}</Mono>
                                    {e.raw ? <Mono style={{ color: cs('text.subtle') }}> {e.raw}</Mono> : null}
                                </td>
                                <td>
                                    {ratio(e.w)} <LevelBadge level={e.wl} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Legend>
            </Scroll>
        </Block>
    );
};
