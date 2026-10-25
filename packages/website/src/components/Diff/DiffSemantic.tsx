import { styled } from '@linaria/react';
import { FC, Fragment } from 'react';

import type { Entry, SemanticReport } from '@/lib/diff/semantic';

const STATUS: Record<Entry['status'], string> = {
    added: 'neu',
    removed: 'entfernt',
    changed: 'geändert',
    renamed: 'umbenannt',
};

const Wrap = styled.div`
    border-radius: 8px;
    background: var(--color-syntax-background, var(--color-surface-emphasis));
    font-family: var(--font-body);
    font-size: 15px;
    letter-spacing: 0;
    line-height: 1.5;
    color: var(--color-text-default);

    .head {
        padding: 10px 16px;
        border-bottom: 1px solid var(--color-border-muted);
        font-family: var(--font-code);
        font-size: 13px;
        color: var(--color-text-muted);
    }

    .head b {
        color: var(--color-text-emphasis);
    }

    ul {
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .entry {
        display: grid;
        grid-template-columns: 6.5rem minmax(0, 1fr) auto;
        column-gap: 12px;
        padding: 8px 16px;
        border-bottom: 1px solid var(--color-border-muted);
    }

    .entry:last-child {
        border-bottom: 0;
    }

    .badge {
        align-self: start;
        padding: 0 8px;
        border: 1px solid currentcolor;
        border-radius: 4px;
        font-size: 13px;
        text-align: center;
    }

    .entry[data-status='added'] .badge {
        color: var(--color-ink-jade);
    }

    .entry[data-status='removed'] .badge {
        color: var(--color-ink-ruby);
    }

    .entry[data-status='changed'] .badge {
        color: var(--color-ink-sapphire);
    }

    .entry[data-status='renamed'] .badge {
        color: var(--color-ink-amethyst);
    }

    .decl {
        font-family: var(--font-code);
        font-size: 13px;
        color: var(--color-text-emphasis);
    }

    .kind {
        color: var(--color-text-muted);
    }

    .lines {
        font-family: var(--font-code);
        font-size: 12px;
        color: var(--color-text-muted);
        white-space: nowrap;
    }

    .notes {
        grid-column: 2 / -1;
        margin-top: 2px;
        color: var(--color-text-secondary, var(--color-text-default));
    }

    .notes li::before {
        content: '· ';
    }

    code {
        font-family: var(--font-code);
        font-size: 12.5px;
        color: var(--color-text-emphasis);
    }

    @media (width <= 40rem) {
        .entry {
            grid-template-columns: 1fr;
        }

        .notes {
            grid-column: 1;
        }
    }
`;

/** Renders `code` spans inside a note. */
const Note: FC<{ text: string }> = ({ text }) => (
    <>
        {text.split(/`([^`]+)`/).map((part, i) => (
            <Fragment key={i}>{i % 2 ? <code>{part}</code> : part}</Fragment>
        ))}
    </>
);

/** The change by declaration: what was added, removed, renamed or changed, and what moved or repeated. */
export const DiffSemantic: FC<{ report: SemanticReport; file: string; language: string }> = ({
    report,
    file,
    language,
}) => (
    <Wrap
        role="group"
        aria-label={`Diff nach Deklarationen: ${file}`}
    >
        <div className="head">
            <b>{file}</b> · {language} · {report.entries.length} Deklarationen betroffen, {report.unchanged} unverändert
        </div>
        <ul>
            {report.entries.map((entry, i) => (
                <li
                    className="entry"
                    data-status={entry.status}
                    key={i}
                >
                    <span className="badge">{STATUS[entry.status]}</span>
                    <span className="decl">
                        <span className="kind">{entry.kind}</span>{' '}
                        {entry.oldName ? `${entry.oldName} → ${entry.name}` : entry.name}
                    </span>
                    <span className="lines">
                        {entry.lines[0] === entry.lines[1]
                            ? `Z. ${entry.lines[0]}`
                            : `Z. ${entry.lines[0]}–${entry.lines[1]}`}
                    </span>
                    {entry.notes.length > 0 ? (
                        <ul className="notes">
                            {entry.notes.map(note => (
                                <li key={note}>
                                    <Note text={note} />
                                </li>
                            ))}
                        </ul>
                    ) : null}
                </li>
            ))}
        </ul>
    </Wrap>
);
