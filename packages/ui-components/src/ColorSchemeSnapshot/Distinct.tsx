"use client";

import { styled } from "@linaria/react";
import type { FC } from "react";
import { useSnapshot } from "./frame";
import { Block, BlockHead, Hint, Mono, Title, label } from "./ui";

/** Lint gate for ink pairs, ΔE OK (see `scripts/lint-distinct.ts`). */
const MIN_DELTA_E = 0.08;
const SHOWN = 5;

const Lists = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: 1rem 2rem;
`;

const Pairs = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 0.8125rem;
  font-variant-numeric: tabular-nums;
  li {
    display: flex;
    gap: 0.75rem;
    align-items: baseline;
  }
  strong {
    min-width: 3rem;
    color: var(--cs-text-emphasis);
  }
`;

const Names = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr));
  gap: 0.35rem 1rem;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 0.8125rem;
  li {
    display: flex;
    gap: 0.5rem;
    align-items: baseline;
  }
`;

export const SnapshotDistinct: FC = () => {
  const { data, m } = useSnapshot();

  const closest = (matrix: number[][]) =>
    data.inks
      .flatMap((a, i) => data.inks.slice(i + 1).map((b, k) => ({ a, b, v: matrix[i][i + 1 + k] })))
      .sort((x, y) => x.v - y.v)
      .slice(0, SHOWN);

  const lists = [
    { title: "Farbabstand (ΔE OK)", pairs: closest(m.cvd.delta.normal), hint: `Schwelle im Lint: ${MIN_DELTA_E.toFixed(2).replace(".", ",")}` },
    { title: "Namensabstand (c3)", pairs: closest(m.names.hellinger), hint: "nur Anzeige, keine Schwelle" },
  ];

  return (
    <Block>
      <BlockHead>
        <div>
          <Title>Unterscheidbarkeit</Title>
          <Hint>
            Die engsten Tintenpaare nach zwei Maßen. Farbabstand: wahrnehmbarer Abstand in OKLab, der Lint verlangt mindestens {MIN_DELTA_E.toFixed(2).replace(".", ",")}. Namensabstand nach dem c3-Modell
            (Heer &amp; Stone 2012, Hellinger): 0 heißt, alle nennen die Farben gleich, 1 heißt, die Namen überlappen gar nicht.
          </Hint>
        </div>
      </BlockHead>
      <Lists>
        {lists.map((l) => (
          <div key={l.title}>
            <Hint>
              {l.title} · {l.hint}
            </Hint>
            <Pairs>
              {l.pairs.map((p) => (
                <li key={`${p.a}~${p.b}`}>
                  <strong>{p.v.toFixed(3).replace(".", ",")}</strong>
                  <Mono>
                    {label(p.a)} ~ {label(p.b)}
                  </Mono>
                </li>
              ))}
            </Pairs>
          </div>
        ))}
      </Lists>
      <Names>
        {m.names.inks.map((n) => (
          <li key={n.id}>
            <Mono style={{ color: `var(--cs-${n.id.replace(".", "-")})`, minWidth: "4.5rem" }}>{label(n.id)}</Mono>
            <span>{n.top.map((t) => `${t.term} ${Math.round(t.p * 100)} %`).join(", ")}</span>
          </li>
        ))}
      </Names>
    </Block>
  );
};
