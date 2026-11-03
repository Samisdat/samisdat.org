import { styled } from '@linaria/react';

import type { FormulaField } from './formulaWriter';

export const Block = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    min-width: 0;
    font-family: var(--font-mono, ui-monospace, monospace);
    font-size: 0.875rem;
    font-variant-numeric: tabular-nums;

    .formula,
    .jump,
    .measured {
        white-space: pre;
        overflow-x: auto;
    }

    .formula,
    .measured {
        color: var(--color-text-primary, inherit);
    }

    .comment {
        opacity: 0.6;
    }

    .v {
        border-radius: 2px;
    }

    .v-t {
        color: var(--color-ink-turquoise);
    }

    .v-dur {
        color: var(--color-ink-gold);
    }

    .v-frac {
        color: var(--color-ink-sapphire);
    }

    .v-theta {
        color: var(--color-ink-rose);
    }

    /* Reserves the six lines until the highlighter has run. */
    .measured .snippet {
        min-height: 6lh;
    }

    .measured pre {
        margin: 0;
        padding: 0;
        font: inherit;
        overflow: visible;
        background: transparent !important;
    }

    .measured code {
        font: inherit;
    }

    .measured .result {
        color: var(--color-syntax-comment);
        font-style: italic;
    }

    .jump {
        color: var(--color-status-danger);
    }
`;

/** Static token, colored like the live value of the same variable. */
export const Tok = ({ f, children }: { f: FormulaField; children: string }) => (
    <span className={`v-${f}`}>{children}</span>
);

export const V = ({ f, init }: { f: FormulaField; init: string }) => (
    <span
        data-f={f}
        className={`v v-${f}`}
    >
        {init}
    </span>
);

// Continuation of an assignment as a comment, "=" aligned under the one above.
export const Cont = ({ pad }: { pad: number }) => <span className="comment">{`//${' '.repeat(pad)}`}</span>;
