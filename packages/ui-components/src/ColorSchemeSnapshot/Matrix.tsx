"use client";

import { styled } from "@linaria/react";
import type { FC } from "react";
import { cs, useSnapshot } from "./frame";
import { Block, LevelBadge, Scroll, label, ratio, BlockHeader, type BlockProps } from "./ui";

const Table = styled.table`
  border-collapse: separate;
  border-spacing: 5px;
  width: 100%;
  min-width: 36rem;

  th {
    font-family: var(--font-mono, ui-monospace, Menlo, monospace);
    font-size: 0.6875rem;
    font-weight: 400;
    color: var(--cs-text-secondary);
    text-align: left;
    white-space: nowrap;
  }

  td {
    border: 1px solid var(--cs-border-default);
    border-radius: 9px;
    padding: 0.5rem 0.55rem 0.55rem;
    vertical-align: top;
  }
`;

const Sample = styled.span`
  display: block;
  font-size: 1.375rem;
  font-weight: 700;
  line-height: 1;
`;

const Value = styled.span`
  display: block;
  margin: 0.4rem 0;
  font-size: 0.75rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--cs-text-emphasis);
`;

export const SnapshotMatrix: FC<BlockProps> = (props) => {
  const { data, m } = useSnapshot();

  const tokenOf = (id: string) => m.tokens.find((t) => t.id === id);
  // Mirrors the contrast matrix: exempt surfaces take no text, `neutral-only` and `ink` only the neutral text.
  const isRequired = (fg: string, s: string) => {
    const t = tokenOf(s);
    if (!t || t.exempt) return false;
    return t.textTier === "full" || fg === "text.default" || fg === "text.emphasis";
  };
  // Surfaces with the same color and tier share one column (dark: raised, highlight, selection).
  const columns = data.surfaces.reduce<{ ids: string[]; hex: string; tier?: string }[]>((acc, id) => {
    const tier = tokenOf(id)?.textTier;
    const col = acc.find((c) => c.hex === m.colors[id] && c.tier === tier);
    if (col) col.ids.push(id);
    else acc.push({ ids: [id], hex: m.colors[id], tier });
    return acc;
  }, []);

  return (
    <Block>
      <BlockHeader {...props} />
      <Scroll>
        <Table>
          <thead>
            <tr>
              <td style={{ border: 0, padding: 0 }}>
                <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden" }}>Vordergrund auf Fläche</span>
              </td>
              {columns.map((c) => (
                <th key={c.ids[0]} scope="col">
                  {c.ids.map(label).join(" · ")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.texts.map((fg) => (
              <tr key={fg}>
                <th scope="row">{label(fg)}</th>
                {columns.map(({ ids: [s] }) => {
                  const r = m.contrast[fg][s];
                  if (!isRequired(fg, s)) {
                    return (
                      <td key={s} style={{ background: "transparent", opacity: 0.5 }} aria-label="nicht vorgesehen">
                        <Value>–</Value>
                      </td>
                    );
                  }
                  return (
                    <td key={s} style={{ background: cs(s) }}>
                      <Sample style={{ color: cs(fg) }} aria-hidden="true">
                        Aa
                      </Sample>
                      <Value>{ratio(r.w)}</Value>
                      <LevelBadge level={r.wl} />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </Table>
      </Scroll>
    </Block>
  );
};
