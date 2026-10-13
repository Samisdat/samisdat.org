"use client";

import { styled } from "@linaria/react";
import type { WcagLevel } from "@samisdat/color-scheme/snapshot-types";
import { useId, type CSSProperties, type FC, type ReactNode } from "react";
import { cs } from "./frame";

export const Block = styled.section`
  display: grid;
  gap: 0.75rem;
  min-width: 0;
`;

export const BlockHead = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.75rem 1.5rem;
`;

export const Title = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: var(--cs-text-emphasis);
`;

export const Hint = styled.p`
  margin: 0.25rem 0 0;
  max-width: 62ch;
  font-size: 0.875rem;
  color: var(--cs-text-secondary);
`;

export const Mono = styled.span`
  font-family: var(--font-mono, ui-monospace, Menlo, monospace);
  font-size: 0.8em;
`;

export const Hidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
`;

export const Scroll = styled.div`
  overflow-x: auto;
  max-width: 100%;
`;

export const Panel = styled.div`
  border: 1px solid var(--cs-border-default);
  border-radius: 12px;
  padding: 0.75rem;
  transition: background-color 0.3s;
`;

const SegmentedRoot = styled.fieldset`
  display: inline-flex;
  flex-wrap: wrap;
  gap: 2px;
  margin: 0;
  padding: 3px;
  border: 1px solid var(--cs-border-default);
  border-radius: 999px;
  background: var(--cs-surface-emphasis);
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
    color: var(--cs-text-secondary);
  }
  input:checked + span {
    background: var(--cs-surface-subtle);
    color: var(--cs-text-emphasis);
  }
  input:focus-visible + span {
    outline: 2px solid var(--cs-border-focus);
    outline-offset: 1px;
  }
`;

type SegmentedProps<T extends string> = {
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

const BadgeRoot = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  padding: 0.15em 0.6em 0.15em 0.5em;
  border: 1px solid var(--status);
  border-radius: 999px;
  background: var(--cs-surface-emphasis);
  color: var(--label);
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.3;
  white-space: nowrap;
  &::before {
    content: "";
    width: 0.5em;
    height: 0.5em;
    border-radius: 50%;
    background: var(--status);
  }
`;

type Tone = "good" | "ok" | "warn" | "bad";
const tones: Record<Tone, { status: string; label: string }> = {
  good: { status: cs("status.success"), label: cs("ink.green") },
  ok: { status: cs("status.info"), label: cs("ink.blue") },
  warn: { status: cs("status.warning"), label: cs("ink.orange") },
  bad: { status: cs("status.danger"), label: cs("ink.red") },
};

export const Badge: FC<{ tone: Tone; children: ReactNode }> = ({ tone, children }) => (
  <BadgeRoot style={{ "--status": tones[tone].status, "--label": tones[tone].label } as CSSProperties}>{children}</BadgeRoot>
);

const wcagTone: Record<WcagLevel, [Tone, string]> = {
  aaa: ["good", "AAA"],
  aa: ["ok", "AA"],
  large: ["warn", "Nur groß"],
  fail: ["bad", "Zu schwach"],
};
export const LevelBadge: FC<{ level: WcagLevel }> = ({ level }) => {
  const [tone, text] = wcagTone[level];
  return <Badge tone={tone}>{text}</Badge>;
};

export const label = (tokenId: string) =>
  tokenId === "syntax.background" ? "code" : tokenId.replace(/^(surface|ink|text|border)\./, "");

/** Short ratio text, German decimal comma. */
export const ratio = (value: number) => `${value.toFixed(2).replace(".", ",")}:1`;
