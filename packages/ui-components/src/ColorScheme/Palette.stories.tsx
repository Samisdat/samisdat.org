import type { Meta, StoryObj } from "@storybook/react";
import { styled } from "@linaria/react";
import { hues, modes, palette, steps, type Hue } from "@samisdat/color-scheme";
import { tokensOf } from "@samisdat/color-scheme/contrast";
import { labelColorOn, toHex, toOklch, valueOf } from "./utils";

const Page = styled.div`
  font-family: var(--font-sans);
  color: var(--color-text-default);
  background: var(--color-surface-default);
  padding: 1rem;
`;

const Swatches = styled.ol`
  display: grid;
  grid-template-columns: repeat(11, minmax(5.5rem, 1fr));
  gap: 2px;
  margin: 0;
  padding: 0;
  list-style: none;
  overflow-x: auto;
`;

const Swatch = styled.li`
  padding: 0.5rem;
  font-family: var(--font-code);
  font-size: 0.6875rem;
  line-height: 1.4;

  strong {
    display: block;
    font-size: 0.875rem;
  }
`;

const Chart = styled.svg`
  display: block;
  width: 100%;
  max-width: 32rem;
  height: auto;
  margin-top: 0.5rem;
  font-family: var(--font-sans);
  font-size: 9px;
`;

const Scroll = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  border-collapse: collapse;
  font-size: 0.8125rem;

  th,
  td {
    padding: 0.25rem 0.75rem;
    text-align: left;
    border-bottom: 1px solid var(--color-surface-subtle);
  }

  code {
    font-family: var(--font-code);
  }
`;

const Chip = styled.span`
  display: inline-block;
  width: 1.25rem;
  height: 1.25rem;
  border: 1px solid currentColor;
  border-radius: 0.25rem;
  vertical-align: middle;
`;

const W = 330;
const H = 110;
const PAD = { l: 28, r: 8, t: 8, b: 18 };
const MAX_C = 0.4;

const LCChart = ({ hue }: { hue: Hue }) => {
  const scale = palette[hue] as Record<number, string>;
  const points = steps.map((step, i) => {
    const { l, c } = toOklch(scale[step]);
    const x = PAD.l + (i / (steps.length - 1)) * (W - PAD.l - PAD.r);
    const y = (v: number) => PAD.t + (1 - v) * (H - PAD.t - PAD.b);
    return { step, x, yl: y(l), yc: y(Math.min(c / MAX_C, 1)) };
  });
  const line = (key: "yl" | "yc") =>
    points.map((p) => `${p.x.toFixed(1)},${p[key].toFixed(1)}`).join(" ");

  return (
    <Chart
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`${hue}: lightness and chroma across steps ${steps[0]} to ${steps[steps.length - 1]}`}
    >
      <rect
        x={PAD.l}
        y={PAD.t}
        width={W - PAD.l - PAD.r}
        height={H - PAD.t - PAD.b}
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.3"
      />
      <polyline points={line("yl")} fill="none" stroke="currentColor" strokeWidth="1.5" />
      <polyline
        points={line("yc")}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="4 3"
      />
      {points.map((p) => (
        <g key={p.step}>
          <circle cx={p.x} cy={p.yl} r="2" fill="currentColor" />
          <circle cx={p.x} cy={p.yc} r="2" fill="none" stroke="currentColor" />
          <text x={p.x} y={H - 5} textAnchor="middle" fill="currentColor">
            {p.step}
          </text>
        </g>
      ))}
      <text x="2" y={PAD.t + 6} fill="currentColor">
        1
      </text>
      <text x="2" y={H - PAD.b} fill="currentColor">
        0
      </text>
    </Chart>
  );
};

const Hues = () => (
  <>
    <h2>Level 1: scales</h2>
    {hues.map((hue) => {
      const scale = palette[hue] as Record<number, string>;
      const headingId = `hue-${hue}`;
      return (
        <section key={hue} aria-labelledby={headingId}>
          <h3 id={headingId}>{hue}</h3>
          <Scroll>
            <Swatches aria-label={`${hue} scale`}>
              {steps.map((step) => {
                const value = scale[step];
                const { l, c, h } = toOklch(value);
                return (
                  <Swatch
                    key={step}
                    style={{ background: value, color: labelColorOn(value) }}
                  >
                    <strong>{step}</strong>
                    L {l.toFixed(3)}
                    <br />C {c.toFixed(3)}
                    <br />H {h.toFixed(0)}
                    <br />
                    {toHex(value)}
                  </Swatch>
                );
              })}
            </Swatches>
          </Scroll>
          <LCChart hue={hue} />
          <small>Solid: L (0 to 1). Dashed: C (0 to {MAX_C}, scaled).</small>
        </section>
      );
    })}
  </>
);

const Semantic = () => (
  <>
    <h2>Level 2: meaning</h2>
    {modes.map((mode) => {
      const headingId = `semantic-${mode}`;
      return (
        <section key={mode} aria-labelledby={headingId}>
          <h3 id={headingId}>{mode}</h3>
          <Scroll>
            <Table aria-labelledby={headingId}>
              <thead>
                <tr>
                  <th scope="col">Token</th>
                  <th scope="col">Alias</th>
                  <th scope="col">Value</th>
                  <th scope="col">Hex</th>
                  <th scope="col">Color</th>
                </tr>
              </thead>
              <tbody>
                {tokensOf(mode).map((token) => {
                  const value = valueOf(mode, token.id);
                  return (
                    <tr key={token.id}>
                      <th scope="row">
                        <code>{token.id}</code>
                      </th>
                      <td>
                        <code>{token.value}</code>
                      </td>
                      <td>
                        <code>{value}</code>
                      </td>
                      <td>
                        <code>{toHex(value)}</code>
                      </td>
                      <td>
                        <Chip style={{ background: value }} role="img" aria-label={token.id} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Scroll>
        </section>
      );
    })}
  </>
);

const Palette = () => (
  <Page>
    <h1>Palette</h1>
    <Hues />
    <Semantic />
  </Page>
);

const meta = {
  title: "Color Scheme/Palette",
  component: Palette,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Palette>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
