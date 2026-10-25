import { styled } from '@linaria/react';
import { FC } from 'react';

import type { AnsiSpan } from '@/lib/diff/ansi';

// The terminal's colors, mapped to the colors of the site so both color modes stay readable
const COLORS: Record<number, string> = {
    1: 'var(--color-syntax-diff-minus, var(--color-ink-ruby))',
    2: 'var(--color-syntax-diff-plus, var(--color-ink-jade))',
    3: 'var(--color-ink-gold)',
    4: 'var(--color-ink-sapphire)',
    5: 'var(--color-ink-amethyst)',
    6: 'var(--color-ink-turquoise)',
};

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

    .term {
        width: max-content;
        min-width: 100%;
        margin: 0;
        padding: 8px 16px;
        font: inherit;
        white-space: pre;
    }

    .dim {
        opacity: 0.6;
    }
`;

const style = (span: AnsiSpan) => ({
    color: span.fg ? COLORS[span.fg] : undefined,
    fontWeight: span.bold ? 700 : undefined,
    fontStyle: span.italic ? ('italic' as const) : undefined,
    textDecoration: span.underline ? 'underline' : undefined,
});

/** Terminal output as it was recorded, colors mapped to the site's. */
export const DiffTerminal: FC<{ lines: AnsiSpan[][]; label: string }> = ({ lines, label }) => (
    <Pre
        role="group"
        aria-label={label}
        tabIndex={0}
    >
        <pre className="term">
            {lines.map((line, i) => (
                <div key={i}>
                    {line.map((span, j) => (
                        <span
                            className={span.dim ? 'dim' : undefined}
                            key={j}
                            style={style(span)}
                        >
                            {span.text}
                        </span>
                    ))}
                    {line.length === 0 ? '​' : null}
                </div>
            ))}
        </pre>
    </Pre>
);
