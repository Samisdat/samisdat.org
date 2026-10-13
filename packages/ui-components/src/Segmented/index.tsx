"use client";

import { styled } from "@linaria/react";
import { useId } from "react";

/**
 * Inside ColorSchemeSnapshot the frozen `--cs-*` tokens win; everywhere else
 * the site's `--color-*` tokens apply.
 */
const SegmentedRoot = styled.fieldset`
  display: inline-flex;
  flex-wrap: wrap;
  gap: 2px;
  margin: 0;
  padding: 3px;
  border: 1px solid var(--cs-border-muted, var(--color-border-muted));
  border-radius: 999px;
  min-inline-size: 0;
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
    display: block;
    padding: 0.25rem 0.7rem;
    border-radius: 999px;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--cs-text-secondary, var(--color-text-secondary));
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
  options: readonly { value: T; label: string }[];
  onChange: (value: T) => void;
};

export function Segmented<T extends string>({ label, value, options, onChange }: SegmentedProps<T>) {
  const name = useId();
  return (
    <SegmentedRoot>
      <legend>{label}</legend>
      {options.map((o) => (
        <label key={o.value}>
          <input type="radio" name={name} value={o.value} checked={o.value === value} onChange={() => onChange(o.value)} />
          <span>{o.label}</span>
        </label>
      ))}
    </SegmentedRoot>
  );
}
