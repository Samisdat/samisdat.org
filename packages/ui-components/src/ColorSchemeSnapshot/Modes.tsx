"use client";

import { styled } from "@linaria/react";
import type { FC } from "react";
import { useSnapshot } from "./frame";
import { Block, BlockHead, Hint, Mono, Scroll, Title, label, ratio } from "./ui";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(15rem, 1fr));
  gap: 0.75rem;
  min-width: 32rem;
`;

const Side = styled.div`
  border: 1px solid var(--cs-border-default);
  border-radius: 12px;
  padding: 0.75rem;
  display: grid;
  gap: 0.35rem;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 5.5rem 1fr 2.75rem;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
`;

const Track = styled.div`
  height: 0.55rem;
  border-radius: 999px;
  background: var(--track);
  > div {
    height: 100%;
    border-radius: 999px;
  }
`;

const Stats = styled.dl`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 2rem;
  margin: 0;
  dt {
    font-size: 0.75rem;
    color: var(--cs-text-secondary);
  }
  dd {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--cs-text-emphasis);
    font-variant-numeric: tabular-nums;
  }
`;

const rho = (v: number) => v.toFixed(2).replace(".", ",");

export const SnapshotModes: FC = () => {
  const { data } = useSnapshot();
  const { correspondence } = data;

  return (
    <Block>
      <BlockHead>
        <div>
          <Title>Dunkel und Hell nebeneinander</Title>
          <Hint>
            Gleiche Rolle, beide Modi, jeweils auf dem Code-Hintergrund des Modus. Die Balken zeigen das WCAG-Verhältnis, also wie
            kräftig die Tinte lesbar ist. Die Seite folgt dem Schalter oben nicht, hier stehen immer beide.
          </Hint>
        </div>
      </BlockHead>
      <Scroll>
        <Grid>
          {(["dark", "light"] as const).map((mode) => {
            const m = data.modes[mode];
            const bg = m.colors["syntax.background"];
            return (
              <Side key={mode} style={{ background: bg, borderColor: m.colors["border.default"], color: m.colors["text.default"] }}>
                <strong style={{ color: m.colors["text.emphasis"] }}>{mode === "dark" ? "Dunkel" : "Hell"}</strong>
                {data.inks.map((ink) => {
                  const r = m.contrast[ink]["syntax.background"];
                  return (
                    <Row key={ink}>
                      <Mono style={{ color: m.colors[ink] }}>{label(ink)}</Mono>
                      <Track style={{ "--track": m.colors["surface.default"] } as React.CSSProperties}>
                        <div style={{ width: `${Math.min(100, (r.w / 14) * 100)}%`, background: m.colors[ink] }} />
                      </Track>
                      <Mono>{ratio(r.w)}</Mono>
                    </Row>
                  );
                })}
              </Side>
            );
          })}
        </Grid>
      </Scroll>
      {correspondence ? (
        <Stats>
          <div>
            <dt>Rangkorrelation ρ der Lesbarkeit je Rolle</dt>
            <dd>{rho(correspondence.spearman)}</dd>
          </div>
          <div>
            <dt>mittlere Abweichung |Δ Verhältnis|</dt>
            <dd>{correspondence.meanAbsDiffWcag.toFixed(1).replace(".", ",")}</dd>
          </div>
          <div>
            <dt>verglichene Rollen</dt>
            <dd>{correspondence.roles}</dd>
          </div>
        </Stats>
      ) : null}
    </Block>
  );
};
