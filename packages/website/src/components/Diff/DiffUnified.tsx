import { styled } from '@linaria/react';
import { FC } from 'react';

import type { UnifiedHunk } from '@/lib/diff/types';

// Like the terminal: colored text on the code background, no filled rows
const Pre = styled.div`
    overflow-x: auto;
    border-radius: 8px;
    background: var(--color-syntax-background, var(--color-surface-emphasis));
    font-family: var(--font-code);
    font-size: 13px;
    letter-spacing: 0;
    line-height: 1.7;
    color: var(--color-text-default);

    &:focus-visible {
        outline: 2px solid var(--color-border-focus);
        outline-offset: 2px;
    }

    .patch {
        width: max-content;
        min-width: 100%;
        padding: 8px 0;
    }

    .line {
        padding: 0 16px;
        white-space: pre;
    }

    .meta {
        font-weight: 700;
        color: var(--color-text-emphasis);
    }

    .hunk {
        color: var(--color-ink-turquoise);
    }

    .hunk .ctx {
        color: var(--color-text-default);
    }

    .line[data-prefix='+'] {
        color: var(--color-syntax-diff-plus, var(--color-ink-jade));
    }

    .line[data-prefix='-'] {
        color: var(--color-syntax-diff-minus, var(--color-ink-ruby));
    }

    &[data-plain='true'] .meta {
        font-weight: 400;
        color: inherit;
    }

    &[data-plain='true'] .hunk,
    &[data-plain='true'] .line[data-prefix] {
        color: inherit;
    }
`;

/** What `git diff` prints: the file header, then hunks with context, `-` lines before `+` lines. `plain` is `--no-color`. */
export const DiffUnified: FC<{ header?: string[]; hunks: UnifiedHunk[]; label: string; plain?: boolean }> = ({
    header = [],
    hunks,
    label,
    plain = false,
}) => (
    <Pre
        role="group"
        aria-label={label}
        tabIndex={0}
        data-plain={plain}
    >
        <div className="patch">
            {header.map(line => (
                <div
                    className="line meta"
                    key={line}
                >
                    {line}
                </div>
            ))}
            {hunks.map(hunk => (
                <div key={hunk.header}>
                    <div className="line hunk">
                        {hunk.header}
                        {hunk.context ? <span className="ctx"> {hunk.context}</span> : null}
                    </div>
                    {hunk.lines.map((line, i) => (
                        <div
                            className="line"
                            data-prefix={line.prefix}
                            key={i}
                        >
                            {line.prefix}
                            {line.text}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    </Pre>
);
