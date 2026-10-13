"use client";

import { styled } from "@linaria/react";
import type { FC } from "react";
import { useSnapshot } from "./frame";
import { Badge, Block, BlockHead, Hint, Mono, Title } from "./ui";

const List = styled.ul`
  display: grid;
  gap: 0.6rem;
  margin: 0;
  padding: 0;
  list-style: none;
  li {
    display: grid;
    gap: 0.25rem;
    padding: 0.6rem 0.75rem;
    border: 1px solid var(--cs-border-default);
    border-left-width: 4px;
    border-radius: 8px;
    font-size: 0.875rem;
  }
  p {
    margin: 0;
    color: var(--cs-text-secondary);
  }
`;

export const SnapshotExceptions: FC = () => {
  const { m } = useSnapshot();
  return (
    <Block>
      <BlockHead>
        <div>
          <Title>Bewusste Ausnahmen</Title>
          <Hint>
            Was bewusst unter der Regel liegt, mit der Begründung aus den Token-Dateien. Eine Ausnahme ist ein
            Grenzwert, den du dir selbst nennst, kein Versehen.
          </Hint>
        </div>
      </BlockHead>
      {m.exceptions.length === 0 ? (
        <Hint>In diesem Modus gibt es keine.</Hint>
      ) : (
        <List>
          {m.exceptions.map((e) => (
            <li key={`${e.kind}-${e.id}`} style={{ borderLeftColor: "var(--cs-ink-orange)" }}>
              <div>
                <Mono>{e.id}</Mono>{" "}
                <Badge tone="warn">ohne Prüfung</Badge>
              </div>
              {e.reason ? <p>{e.reason}</p> : null}
            </li>
          ))}
        </List>
      )}
    </Block>
  );
};
