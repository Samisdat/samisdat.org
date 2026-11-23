'use client';

import { styled } from '@linaria/react';
import { type ReactNode, useId, useRef } from 'react';

import { useScrollFades } from './useScrollFades';

/**
 * Inside ColorSchemeSnapshot the frozen `--cs-*` tokens win; everywhere else
 * the site's `--color-*` tokens apply.
 */
const SegmentedRoot = styled.fieldset`
    display: inline-flex;
    max-inline-size: 100%;
    margin: 0;
    padding: 0;
    border: 1px solid var(--cs-border-muted, var(--color-border-muted));
    border-radius: 999px;
    min-inline-size: 0;

    /* One row, never wraps: overflow scrolls inside the pill. Padding leaves room for the focus ring. */
    .scroller {
        display: flex;
        flex: 1;
        gap: 2px;
        min-inline-size: 0;
        padding: 3px;
        overflow-x: auto;
        overscroll-behavior-x: contain;
        scrollbar-width: none;
        scroll-padding-inline: 2rem;
        border-radius: inherit;
    }

    .scroller::-webkit-scrollbar {
        display: none;
    }

    .scroller > label {
        flex: none;
    }

    /* Fade only on the side that still hides content */
    .scroller[data-fade-start='true'] {
        mask-image: linear-gradient(to right, transparent, #000 1.5rem);
    }

    .scroller[data-fade-end='true'] {
        mask-image: linear-gradient(to left, transparent, #000 1.5rem);
    }

    .scroller[data-fade-start='true'][data-fade-end='true'] {
        mask-image: linear-gradient(to right, transparent, #000 1.5rem, #000 calc(100% - 1.5rem), transparent);
    }

    @media (prefers-reduced-motion: no-preference) {
        .scroller {
            scroll-behavior: smooth;
        }
    }

    legend {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip-path: inset(50%);
    }

    label {
        position: relative;
    }

    input {
        position: absolute;
        inset: 0;
        margin: 0;
        opacity: 0;
        cursor: pointer;
    }

    span {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.25rem 0.7rem;
        border-radius: 999px;
        font-size: 0.8125rem;
        font-weight: 600;
        color: var(--cs-text-secondary, var(--color-text-secondary));
    }

    span.icon {
        padding-inline: 0.5rem;
    }

    input:checked + span {
        background: var(--cs-surface-raised, var(--color-surface-raised));
        color: var(--cs-text-emphasis, var(--color-text-emphasis));
    }

    input:focus-visible + span {
        outline: 2px solid var(--cs-border-focus, var(--color-border-focus));
        outline-offset: 1px;
    }
`;

export type SegmentedProps<T extends string> = {
    /** Accessible group name, rendered as a visually hidden legend. */
    label: string;
    value: T;
    /** An option with an `icon` shows only the icon; `label` stays its accessible name and tooltip. */
    options: readonly { value: T; label: string; icon?: ReactNode }[];
    onChange: (value: T) => void;
};

export function Segmented<T extends string>({ label, value, options, onChange }: SegmentedProps<T>) {
    const name = useId();
    const scrollerRef = useRef<HTMLDivElement>(null);
    useScrollFades(scrollerRef, value, options.length);
    return (
        <SegmentedRoot>
            <legend>{label}</legend>
            <div
                className="scroller"
                ref={scrollerRef}
            >
                {options.map(o => (
                    <label key={o.value}>
                        <input
                            type="radio"
                            name={name}
                            value={o.value}
                            checked={o.value === value}
                            onChange={() => onChange(o.value)}
                            aria-label={o.icon ? o.label : undefined}
                            title={o.icon ? o.label : undefined}
                        />
                        <span className={o.icon ? 'icon' : undefined}>{o.icon ?? o.label}</span>
                    </label>
                ))}
            </div>
        </SegmentedRoot>
    );
}
