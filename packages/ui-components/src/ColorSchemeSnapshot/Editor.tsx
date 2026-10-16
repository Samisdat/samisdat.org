"use client";

import { styled } from "@linaria/react";
import { Fragment, type FC } from "react";
import { cs, useSnapshot } from "./frame";
import { Block, BlockHead, Hint, Mono, Title } from "./ui";
import { Tokens } from "./Code";

const Window = styled.div`
  display: grid;
  grid-template-columns: 11rem 1fr;
  border: 1px solid var(--cs-border-default);
  border-radius: 12px;
  overflow: hidden;
  font-family: var(--font-mono, ui-monospace, Menlo, monospace);
  font-size: 0.8125rem;
  line-height: 1.7;

  @media (width <= 40rem) {
    grid-template-columns: 1fr;
  }
`;

const Tree = styled.div`
  padding: 0.5rem 0;
  border-right: 1px solid var(--cs-border-default);
  overflow: hidden;

  > div {
    padding: 0 0.75rem;
    white-space: nowrap;
  }

  @media (width <= 40rem) {
    display: none;
  }
`;

const Pane = styled.div`
  display: grid;
  grid-template-rows: 1fr auto;
  min-width: 0;
`;

const Code = styled.div`
  padding: 0.5rem 0;
  overflow-x: auto;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1rem 2.5rem 1fr;
  width: max-content;
  min-width: 100%;

  > span:nth-child(2) {
    text-align: right;
    padding-right: 0.75rem;
    user-select: none;
  }

  > span:last-child {
    white-space: pre;
    padding-right: 1.25rem;
  }
`;

const Status = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.15rem 0.75rem;
  font-size: 0.75rem;
`;

const FILES = [
  { name: "▾ src", dir: true },
  { name: "  tokens/", dir: true },
  { name: "    dark.ts", selected: true },
  { name: "    light.ts" },
  { name: "  index.ts" },
  { name: "  theme.ts" },
  { name: "package.json" },
];

/** Gutter marks: line index -> diff token. */
const MARKS: Record<number, "ink.jade" | "ink.sapphire" | "ink.ruby"> = { 3: "ink.jade", 4: "ink.jade", 8: "ink.sapphire", 14: "ink.ruby" };

export const SnapshotEditor: FC = () => {
  const { m } = useSnapshot();
  const { code, fills } = m;
  const lines = code.theme.slice(0, 16);
  const cursor = 8;
  const selectedLine = 10;

  return (
    <Block>
      <BlockHead>
        <div>
          <Title>Im Editor</Title>
          <Hint>
            So sitzen die Tokens in Neovim: Cursorzeile (<Mono>highlight</Mono>), Auswahl (<Mono>selection</Mono>),
            Dateibaum, Diff-Markierungen am Rand. Abstand zur Fläche (ΔE OK):{" "}
            {fills.map((f) => `${f.token} ${f.toSyntax.toFixed(2).replace(".", ",")} / ${f.toSurface.toFixed(2).replace(".", ",")}`).join(", ")}{" "}
            (Code-Hintergrund / Seite). Das Lint verlangt mindestens 0,1.
          </Hint>
        </div>
      </BlockHead>
      <Window aria-hidden="true">
        <Tree style={{ background: cs("surface.default"), color: cs("text.secondary") }}>
          {FILES.map((f) => (
            <div
              key={f.name}
              style={{
                background: f.selected ? cs("highlight") : undefined,
                color: f.selected ? cs("text.default") : f.dir ? cs("ink.sapphire") : undefined,
                whiteSpace: "pre",
              }}
            >
              {f.name}
            </div>
          ))}
        </Tree>
        <Pane style={{ background: code.bg, color: code.fg }}>
          <Code>
            {lines.map((line, i) => (
              <Row key={i} style={{ background: i === cursor ? cs("highlight") : undefined }}>
                <span style={{ background: MARKS[i] ? cs(MARKS[i]) : undefined, width: 4, justifySelf: "start" }} />
                <span style={{ color: i === cursor ? cs("text.default") : cs("text.subtle") }}>{i + 1}</span>
                <span>
                  {i === selectedLine ? (
                    <Fragment>
                      {line.map((t, k) => (
                        <span
                          key={k}
                          style={{
                            color: t.f ?? code.fg,
                            fontStyle: t.s === "italic" ? "italic" : undefined,
                            background: k >= 1 && k <= 4 ? cs("selection") : undefined,
                          }}
                        >
                          {t.c}
                        </span>
                      ))}
                    </Fragment>
                  ) : (
                    <Tokens line={line} fallback={code.fg} />
                  )}
                  {line.length === 0 ? " " : null}
                </span>
              </Row>
            ))}
          </Code>
          <Status style={{ background: cs("surface.emphasis"), color: cs("text.secondary"), borderTop: `1px solid ${cs("border.default")}` }}>
            <span>dark.ts</span>
            <span>
              {cursor + 1}:1 <span style={{ color: cs("ink.turquoise") }}>● 0</span> <span style={{ color: cs("ink.copper") }}>▲ 1</span>
            </span>
          </Status>
        </Pane>
      </Window>
    </Block>
  );
};
