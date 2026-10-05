import type { Meta, StoryObj } from "@storybook/react";
import { styled } from "@linaria/react";
import { modes, type Mode } from "@samisdat/color-scheme";
import {
  contrastMatrixAll,
  SYNTAX_BACKGROUNDS,
  syntaxForegrounds,
  tokensOf,
} from "@samisdat/color-scheme/contrast";
import { APCA_MIN, apcaAbs, apcaMinOf } from "@samisdat/color-scheme/apca";
import { contrastBaseline } from "@samisdat/color-scheme/contrast-baseline";
import { ratio, valueOf } from "./utils";

const Page = styled.div`
  font-family: var(--font-sans);
  color: var(--color-text-default);
  background: var(--color-surface-default);
  padding: 1rem;
`;

const Legend = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
  padding: 0;
  list-style: none;
  font-size: 0.875rem;
`;

const Scroll = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  border-collapse: separate;
  border-spacing: 4px;
  font-size: 0.8125rem;

  th {
    text-align: left;
    font-weight: 600;
    padding: 0.25rem 0.5rem;
    white-space: nowrap;
  }

  thead th {
    vertical-align: bottom;
  }
`;

const Cell = styled.td`
  min-width: 7.5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid transparent;
  vertical-align: top;

  &[data-required="true"] {
    border-color: currentColor;
  }

  &[data-required="false"] {
    opacity: 0.45;
  }

  &[data-apca-fail="true"] {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }

  &[data-exempt="true"] {
    border-style: dashed;
    border-color: currentColor;
  }
`;

const Sample = styled.span`
  display: block;
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.2;
`;

const Ratio = styled.span`
  display: block;
  font-family: var(--font-code);
  font-variant-numeric: tabular-nums;
`;

const Badge = styled.span`
  display: inline-block;
  margin: 0.125rem 0.25rem 0 0;
  padding: 0 0.375rem;
  border: 1px solid currentColor;
  border-radius: 0.25rem;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

const Tier = styled.span`
  display: block;
  font-weight: 400;
  font-size: 0.6875rem;
  opacity: 0.8;
`;

const required = new Set(contrastMatrixAll().map((p) => p.id));
const MIN = 4.5;

const isForeground = (id: string) =>
  id.startsWith("text.") || id.startsWith("ink.");

type GridKind = "surface" | "syntax";

/**
 * Applicable APCA minimum of a cell, or undefined when the pair is not gated
 * (gate: ink.* and syntax.* on surface.default / syntax.background).
 */
const apcaMinFor = (mode: Mode, fg: string, bg: string) =>
  (fg.startsWith("ink.") || fg.startsWith("syntax.")) &&
  (bg === "surface.default" || bg === "syntax.background")
    ? apcaMinOf(mode, fg)
    : undefined;

const Grid = ({ mode, kind }: { mode: Mode; kind: GridKind }) => {
  const tokens = tokensOf(mode);
  const foregrounds =
    kind === "syntax"
      ? syntaxForegrounds(mode)
      : tokens.filter((t) => isForeground(t.id));
  const surfaces =
    kind === "syntax"
      ? SYNTAX_BACKGROUNDS.map((id) => tokens.find((t) => t.id === id)!)
      : tokens.filter((t) => t.id.startsWith("surface."));
  const headingId = `contrast-${kind}-${mode}`;

  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId}>
        {kind === "syntax" ? "Syntax" : "Mode"}: {mode}
      </h2>
      <Scroll>
        <Table aria-labelledby={headingId}>
          <thead>
            <tr>
              <th scope="col">Foreground / Surface</th>
              {surfaces.map((surface) => (
                <th
                  key={surface.id}
                  scope="col"
                  title={surface.exempt ? `exempt: ${surface.exempt}` : undefined}
                >
                  {surface.id}
                  <Tier>{surface.exempt ? "exempt" : surface.textTier}</Tier>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {foregrounds.map((fg) => (
              <tr key={fg.id}>
                <th scope="row">{fg.id}</th>
                {surfaces.map((bg) => {
                  const id = `${mode}:${fg.id}/${bg.id}`;
                  const isRequired = required.has(id);
                  const baseline = id in contrastBaseline;
                  const exemptReason = bg.exempt ?? fg.exempt;
                  const value = ratio(valueOf(mode, fg.id), valueOf(mode, bg.id));
                  const pass = value >= MIN;
                  const lc = apcaAbs(valueOf(mode, fg.id), valueOf(mode, bg.id));
                  const apca = apcaMinFor(mode, fg.id, bg.id);
                  const apcaFail = apca !== undefined && lc < apca.min;
                  return (
                    <Cell
                      key={bg.id}
                      data-required={isRequired}
                      data-baseline={baseline}
                      data-exempt={Boolean(exemptReason)}
                      data-apca-fail={apcaFail}
                      title={
                        exemptReason
                          ? `exempt: ${exemptReason}`
                          : apca?.reason
                            ? `APCA min ${apca.min}: ${apca.reason}`
                            : undefined
                      }
                      style={{
                        color: valueOf(mode, fg.id),
                        background: valueOf(mode, bg.id),
                      }}
                    >
                      <Sample aria-hidden="true">Aa</Sample>
                      <Ratio>
                        {value.toFixed(2)} · Lc {lc.toFixed(1)}
                      </Ratio>
                      <Badge>
                        {exemptReason ? "Exempt" : pass ? "Pass" : "Fail"}
                      </Badge>
                      {baseline ? <Badge>Baseline</Badge> : null}
                      {apcaFail ? <Badge>Lc &lt; {apca.min}</Badge> : null}
                      {apca && apca.min !== APCA_MIN && !apcaFail ? (
                        <Badge>Lc min {apca.min}</Badge>
                      ) : null}
                    </Cell>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </Table>
      </Scroll>
    </section>
  );
};

const ContrastGrid = () => (
  <Page>
    <h1>Contrast Grid</h1>
    <Legend aria-label="Legend">
      <li>Outlined cell: required pair (min. {MIN}:1)</li>
      <li>Dimmed cell: not required</li>
      <li>Dashed cell: exempt (ausgenommen), reason as tooltip</li>
      <li>Baseline: known, justified violation (currently none)</li>
      <li>
        Lc: APCA |Lc| next to the WCAG ratio; ink and syntax need Lc ≥{" "}
        {APCA_MIN} (documented exceptions show their minimum, reason as
        tooltip). &quot;Lc &lt; n&quot; marks a cell below its minimum.
      </li>
    </Legend>
    {modes.map((mode) => (
      <Grid key={mode} mode={mode} kind="surface" />
    ))}
    <h1>Syntax (code block and running text)</h1>
    {modes.map((mode) => (
      <Grid key={mode} mode={mode} kind="syntax" />
    ))}
  </Page>
);

const meta = {
  title: "Color Scheme/Contrast Grid",
  component: ContrastGrid,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ContrastGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
