"use client";

import { styled } from "@linaria/react";
import type { WcagLevel } from "@samisdat/color-scheme/snapshot-types";
import { type CSSProperties, type FC, type ReactNode } from "react";
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

/** Editorial text of a block, passed in as markdown children from the post. */
const IntroRoot = styled.div`
  margin: 0.25rem 0 0;
  max-width: 62ch;
  font-size: 0.875rem;
  color: var(--cs-text-secondary);
  p {
    margin: 0 0 0.5rem;
  }
  p:last-child {
    margin-bottom: 0;
  }
  code {
    font-family: var(--font-mono, ui-monospace, Menlo, monospace);
    font-size: 0.8em;
  }
`;

/** Props every snapshot block takes from the post: its heading and the explanatory markdown. */
export type BlockProps = { title?: string; children?: ReactNode };

type HeaderProps = BlockProps & { aside?: ReactNode };

/** Heading and intro of a block, `aside` sits at the right edge (e.g. a segmented control). */
export const BlockHeader: FC<HeaderProps> = ({ title, children, aside }) => (
  <BlockHead>
    <div>
      {title ? <Title>{title}</Title> : null}
      {children ? <IntroRoot>{children}</IntroRoot> : null}
    </div>
    {aside}
  </BlockHead>
);

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
  good: { status: cs("status.success"), label: cs("ink.jade") },
  ok: { status: cs("status.info"), label: cs("ink.sapphire") },
  warn: { status: cs("status.warning"), label: cs("ink.copper") },
  bad: { status: cs("status.danger"), label: cs("ink.ruby") },
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
