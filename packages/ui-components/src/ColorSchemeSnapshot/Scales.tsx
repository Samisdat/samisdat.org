"use client";

import { styled } from "@linaria/react";
import { useMemo, type FC } from "react";
import { cs, useSnapshot } from "./frame";
import { Block, BlockHead, Hint, Mono, Scroll, Title } from "./ui";

const Grid = styled.div`
  display: grid;
  grid-template-columns: 5.5rem repeat(11, minmax(3.2rem, 1fr));
  gap: 3px;
  min-width: 46rem;
  font-size: 0.6875rem;
`;

const Cell = styled.div`
  min-height: 2.6rem;
  border-radius: 6px;
  padding: 0.2rem 0.3rem;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  line-height: 1.15;
  word-break: break-all;
`;

const Head = styled.div`
  font-family: var(--font-mono, ui-monospace, Menlo, monospace);
  color: var(--cs-text-secondary);
  align-self: center;
  text-align: center;
`;

const USED = /^\{color\.([a-z]+)\.(\d+)\}$/;

export const SnapshotScales: FC = () => {
  const { data, m } = useSnapshot();
  const steps = Object.keys(data.scales.aubergine);

  const users = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const t of m.tokens) {
      const hit = t.raw ? USED.exec(t.raw) : null;
      if (!hit) continue;
      const key = `${hit[1]}.${hit[2]}`;
      map.set(key, [...(map.get(key) ?? []), t.id]);
    }
    return map;
  }, [m.tokens]);

  return (
    <Block>
      <BlockHead>
        <div>
          <Title>Die Skalen</Title>
          <Hint>
            Die Primitive: zwölf Farbtöne in elf Stufen. Jede Stufe, die im gewählten Modus ein Token trägt, ist mit dem
            Token beschriftet. Aliase wie <Mono>status.danger</Mono> zeigen auf ein Ink und tauchen hier nicht auf.
          </Hint>
        </div>
      </BlockHead>
      <Scroll>
        <Grid>
          <div />
          {steps.map((s) => (
            <Head key={s}>{s}</Head>
          ))}
          {Object.entries(data.scales).flatMap(([hue, row]) => [
            <Head key={`${hue}-name`} style={{ textAlign: "left" }}>
              {hue}
            </Head>,
            ...steps.map((step) => {
              const ids = users.get(`${hue}.${step}`);
              return (
                <Cell
                  key={`${hue}-${step}`}
                  title={ids ? ids.join(", ") : `${hue}.${step}`}
                  style={{
                    background: row[step],
                    color: `color-mix(in oklab, ${row[step]} 15%, ${Number.parseInt(row[step].slice(1, 3), 16) > 140 ? "#000" : "#fff"})`,
                    outline: ids ? `2px solid ${cs("text.emphasis")}` : undefined,
                    outlineOffset: -2,
                  }}
                >
                  {ids ? ids[0] : ""}
                  {ids && ids.length > 1 ? ` +${ids.length - 1}` : ""}
                </Cell>
              );
            }),
          ])}
        </Grid>
      </Scroll>
    </Block>
  );
};
