"use client";

import { styled } from "@linaria/react";
import { useMemo, useState, type FC } from "react";
import { cs, useSnapshot } from "./frame";
import { Badge, Block, Hint, Mono, Scroll, label, BlockHeader, type BlockProps } from "./ui";
import { Segmented } from "../Segmented";

type Vision = "normal" | "protan" | "deutan" | "tritan";

const VISIONS: { value: Vision; label: string }[] = [
  { value: "normal", label: "Normal" },
  { value: "protan", label: "Protan (Rot fehlt)" },
  { value: "deutan", label: "Deutan (Grün fehlt)" },
  { value: "tritan", label: "Tritan (Blau fehlt)" },
];

/** Closer than this in ΔE OK counts as hard to tell apart (see lint-cvd). */
const HARD = 0.04;

const Swatches = styled.ol`
  display: grid;
  grid-template-columns: repeat(10, minmax(2.6rem, 1fr));
  gap: 0.25rem;
  min-width: 30rem;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    display: grid;
    gap: 0.3rem;
    justify-items: center;
    font-family: var(--font-mono, ui-monospace, Menlo, monospace);
    font-size: 0.6875rem;
    color: var(--cs-text-secondary);
  }

  i {
    width: 100%;
    height: 3rem;
    border-radius: 8px;
    border: 1px solid var(--cs-border-default);
  }
`;

const Pairs = styled.ol`
  display: grid;
  gap: 0.4rem;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-size: 0.8125rem;
  }

  i {
    width: 1.1rem;
    height: 1.1rem;
    border-radius: 4px;
    border: 1px solid var(--cs-border-default);
  }

  b {
    font-variant-numeric: tabular-nums;
    min-width: 3.5rem;
  }
`;

export const SnapshotCvd: FC<BlockProps> = (props) => {
  const { data, m } = useSnapshot();
  const [vision, setVision] = useState<Vision>("deutan");
  const seen = vision === "normal" ? data.inks.map((i) => m.colors[i]) : m.cvd.simulated[vision];

  const pairs = useMemo(() => {
    const matrix = m.cvd.delta[vision];
    return data.inks
      .flatMap((a, i) => data.inks.slice(i + 1).map((b, k) => ({ a, b, ia: i, ib: i + 1 + k, d: matrix[i][i + 1 + k] })))
      .sort((x, y) => x.d - y.d)
      .slice(0, 6);
  }, [data.inks, m, vision]);

  return (
    <Block>
      <BlockHeader {...props} aside={
        <Segmented label="Sehtyp" value={vision} onChange={setVision} options={VISIONS} />
      }
      />
      <Scroll>
        <Swatches style={{ background: cs("syntax.background"), padding: "0.75rem", borderRadius: 12 }}>
          {data.inks.map((ink, i) => (
            <li key={ink}>
              <i style={{ background: seen[i] }} />
              {label(ink)}
            </li>
          ))}
        </Swatches>
      </Scroll>
      <Pairs>
        {pairs.map((p) => (
          <li key={`${p.a}|${p.b}`}>
            <i style={{ background: seen[p.ia] }} />
            <i style={{ background: seen[p.ib] }} />
            <b>{p.d.toFixed(3).replace(".", ",")}</b>
            <Mono>
              {label(p.a)} ~ {label(p.b)}
            </Mono>
            {p.d < HARD ? <Badge tone="bad">kaum zu trennen</Badge> : p.d < 0.06 ? <Badge tone="warn">eng</Badge> : null}
          </li>
        ))}
      </Pairs>
      <Hint>Unter {HARD.toString().replace(".", ",")} fließen zwei Farben praktisch zusammen.</Hint>
    </Block>
  );
};
