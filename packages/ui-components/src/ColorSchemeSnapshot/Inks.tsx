"use client";

import { styled } from "@linaria/react";
import { useState, type CSSProperties, type FC } from "react";
import { cs, useSnapshot } from "./frame";
import { Block, Hint, LevelBadge, Mono, Panel, Scroll, label, ratio, BlockHeader, type BlockProps } from "./ui";
import { Segmented } from "../Segmented";

const Chart = styled.div`
  position: relative;
  min-width: 34rem;
  padding: 1.75rem 0 0 4.5rem;
`;

const Thresholds = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 1.75rem;
  height: var(--plot);
  pointer-events: none;

  > div {
    position: absolute;
    left: 0;
    right: 0;
    border-top: 1px dashed var(--cs-border-default);
  }

  span {
    position: absolute;
    left: 0;
    bottom: 0.15rem;
    font-size: 0.6875rem;
    color: var(--cs-text-secondary);
    white-space: nowrap;
  }
`;

const Columns = styled.ol`
  position: relative;
  display: grid;
  grid-template-columns: repeat(10, minmax(2.75rem, 1fr));
  gap: 0 0.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Col = styled.li`
  display: grid;
  grid-template-rows: var(--plot) auto auto;
  justify-items: center;
`;

const Well = styled.div`
  position: relative;
  width: 100%;
`;

const Bar = styled.div`
  position: absolute;
  left: 50%;
  bottom: 0;
  width: min(2.4rem, 64%);
  transform: translateX(-50%);
  border-radius: 6px 6px 2px 2px;
  transition: height 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const Value = styled.span`
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--cs-text-emphasis);
`;

const Name = styled.span`
  margin: 0.5rem 0 0.35rem;
  font-family: var(--font-mono, ui-monospace, Menlo, monospace);
  font-size: 0.6875rem;
  color: var(--cs-text-secondary);
`;

const AltRow = styled.li`
  display: grid;
  grid-template-columns: 9.5rem 4.5rem minmax(6rem, 1fr) 4.5rem auto;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.8125rem;

  > i {
    display: block;
    height: 0.9rem;
    border-radius: 4px;
    transition: width 0.4s;
  }
`;

const AltList = styled.ul`
  display: grid;
  gap: 0.4rem;
  margin: 0;
  padding: 0.75rem;
  list-style: none;
  overflow-x: auto;

  > li {
    min-width: 28rem;
  }
`;

const THRESHOLDS = [
  { value: 3, text: "Groß 3:1" },
  { value: 4.5, text: "AA 4,5:1" },
  { value: 7, text: "AAA 7:1" },
];

export const SnapshotInks: FC<BlockProps> = (props) => {
  const { data, m } = useSnapshot();
  const [selected, setSelected] = useState("surface.default");

  // Surfaces with the same color in this mode share one option (dark: raised, highlight, selection).
  const groups = data.inkSurfaces.reduce<{ ids: string[]; hex: string }[]>((acc, id) => {
    const group = acc.find((g) => g.hex === m.colors[id]);
    if (group) group.ids.push(id);
    else acc.push({ ids: [id], hex: m.colors[id] });
    return acc;
  }, []);
  const surface = (groups.find((g) => g.ids.includes(selected)) ?? groups[0]).ids[0];

  const max = Math.max(14, Math.ceil(Math.max(...data.inks.flatMap((i) => data.inkSurfaces.map((s) => m.contrast[i][s].w)))));

  return (
    <Block>
      <BlockHeader {...props} />
      <Segmented
        label="Gemessen auf"
        value={surface}
        onChange={setSelected}
        options={groups.map((g) => ({ value: g.ids[0], label: g.ids.map(label).join(" · ") }))}
      />
      <Panel style={{ background: cs(surface) }}>
        <Scroll>
          <Chart style={{ "--plot": "13rem" } as CSSProperties}>
            <Thresholds>
              {THRESHOLDS.map((t) => (
                <div key={t.text} style={{ bottom: `${(t.value / max) * 100}%` }}>
                  <span style={{ left: "-4.25rem" }}>{t.text}</span>
                </div>
              ))}
            </Thresholds>
            <Columns>
              {data.inks.map((ink) => {
                const r = m.contrast[ink][surface];
                const v = r.w;
                const h = `${(v / max) * 100}%`;
                return (
                  <Col key={ink}>
                    <Well>
                      <Bar style={{ height: h, background: cs(ink) }} aria-hidden="true" />
                      <Value style={{ bottom: `calc(${h} + 0.3rem)` }}>{ratio(v)}</Value>
                    </Well>
                    <Name>{label(ink)}</Name>
                    <LevelBadge level={r.wl} />
                  </Col>
                );
              })}
            </Columns>
          </Chart>
        </Scroll>
      </Panel>
      {m.alternatives ? (
        <Panel style={{ background: cs(surface), padding: 0 }}>
          <AltList>
            {[
              { label: `${label(m.alternatives.ink)} (aktuell)`, hex: m.colors[m.alternatives.ink], r: m.contrast[m.alternatives.ink][surface] },
              ...m.alternatives.items.map((a) => ({ label: a.label, hex: a.hex, r: a.contrast[surface] })),
            ].map((row) => {
              const v = row.r.w;
              return (
                <AltRow key={row.label}>
                  <span>{row.label}</span>
                  <Mono>{row.hex}</Mono>
                  <i style={{ width: `${(v / max) * 100}%`, background: row.hex }} aria-hidden="true" />
                  <strong>{ratio(v)}</strong>
                  <LevelBadge level={row.r.wl} />
                </AltRow>
              );
            })}
          </AltList>
        </Panel>
      ) : null}
      <Hint>
        Fläche: <Mono>{groups.find((g) => g.ids[0] === surface)!.ids.join(" · ")}</Mono>
      </Hint>
    </Block>
  );
};
