import { ComponentType, SVGProps } from "react";
import { styled } from "@linaria/react";

const circlePath = `
  M 150 35
  C 213.5 35 265 86.5 265 150
  C 265 213.5 213.5 265 150 265
  C 86.5 265 35 213.5 35 150
  C 35 86.5 86.5 35 150 35
  Z
`;

const goodSquarePath = `
  M 60 60
  C 60 60 240 60 240 60
  C 240 60 240 240 240 240
  C 240 240 60 240 60 240
  C 60 240 60 60 60 60
  Z
`;

// Starts at the opposite corner: every point travels through the center.
const middleSquarePath = `
  M 240 240
  C 240 240 60 240 60 240
  C 60 240 60 60 60 60
  C 60 60 240 60 240 60
  C 240 60 240 240 240 240
  Z
`;

const badSquarePath = `
  M 60 60
  C 60 60 240 240 240 240
  C 240 240 240 60 240 60
  C 240 60 60 240 60 240
  C 60 240 60 60 60 60
  Z
`;

const PointGroup = styled.g`

  & circle {
    fill: currentColor;
    stroke: white;
    stroke-width: 0;
  }

  & text {
    fill: white;
    font-size: 14px;
    font-weight: 800;
    text-anchor: middle;
    dominant-baseline: central;
    pointer-events: none;
  }
 `


const TrailLine = styled.line`
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
 `

const MorphPath = styled.path`
    fill: none;
    stroke: currentColor;
    stroke-width: 4;
    stroke-linejoin: round;
    stroke-linecap: round;
`
export const caseType= ['good', 'middle', 'bad'] as const;
export type CaseType = (typeof caseType)[number];


const Good = styled.g`
    color: var(--color-ink-jade);
`;

 const Middle = styled.g`
    color: var(--color-ink-gold);
`;

 const Bad = styled.g`
   color: var(--color-ink-ruby);
`;

type CaseGroupComponent = ComponentType<SVGProps<SVGGElement>>;

export const caseComponent: Record<CaseType, CaseGroupComponent> = {
  good: Good,
  middle: Middle,
  bad: Bad,
};

  const animations = (xName: string, yName: string, cxValues:string, cyValues:string) => (
    <>
      <animate
        attributeName={xName}
        dur="3s"
        repeatCount="indefinite"
        values={cxValues}
      />
      <animate
        attributeName={yName}
        dur="3s"
        repeatCount="indefinite"
        values={cyValues}
      />
    </>
  );


const Point = ({
  label,
  cxValues,
  cyValues,
}: {
  label: string;
  cxValues: string;
  cyValues: string;
}) => {
  const cx = cxValues.split(";")[0].trim();
  const cy = cyValues.split(";")[0].trim();

  return (
    <PointGroup>
      <circle cx={cx} cy={cy} r={15}>
        {animations("cx", "cy", cxValues, cyValues)}
      </circle>

      <text x={cx} y={cy}>
        {label}
        {animations("x", "y", cxValues, cyValues)}
      </text>
    </PointGroup>
  );
};

// Shows only the position the animation is currently heading towards: the
// end point while running outbound, the start point while running back.
// Styled like the live point itself (same fill/text), just faded, so it
// reads as "this point, but not moving yet" rather than a separate marker.
const GhostPoint = ({
  phase,
  label,
  cx,
  cy,
}: {
  phase: "outbound" | "return";
  label: string;
  cx: string;
  cy: string;
}) => (
  <PointGroup opacity={phase === "outbound" ? 0.75 : 0}>
    <circle cx={cx} cy={cy} r={15} />
    <text x={cx} y={cy}>
      {label}
    </text>
    <animate
      attributeName="opacity"
      dur="3s"
      repeatCount="indefinite"
      keyTimes="0;0.5;0.5;1"
      values={phase === "outbound" ? "0.75;0.75;0;0" : "0;0;0.75;0.75"}
    />
  </PointGroup>
);

// The remaining distance to the next ghost: tracks the live point's
// position on one end, stays fixed on the upcoming target on the other,
// so it visibly shrinks as the point approaches it.
const Trail = ({
  phase,
  cxValues,
  cyValues,
  targetCx,
  targetCy,
}: {
  phase: "outbound" | "return";
  cxValues: string;
  cyValues: string;
  targetCx: string;
  targetCy: string;
}) => (
  <TrailLine
    x2={targetCx}
    y2={targetCy}
    opacity={phase === "outbound" ? 0.75 : 0}
  >
    <animate attributeName="x1" dur="3s" repeatCount="indefinite" values={cxValues} />
    <animate attributeName="y1" dur="3s" repeatCount="indefinite" values={cyValues} />
    <animate
      attributeName="opacity"
      dur="3s"
      repeatCount="indefinite"
      keyTimes="0;0.5;0.5;1"
      values={phase === "outbound" ? "0.75;0.75;0;0" : "0;0;0.75;0.75"}
    />
  </TrailLine>
);

const MorphShape = ({ morphTo }: { morphTo: string }) => (
  <MorphPath d={circlePath}>
    <animate
      attributeName="d"
      dur="3s"
      repeatCount="indefinite"
      values={`${circlePath};${morphTo};${circlePath}`}
    />
  </MorphPath>
);

type PointDef = {
  label: string;
  cxValues: string;
  cyValues: string;
};

const Case = ({
  type,
  x,
  morphTo,
  points,
}: {
  type: CaseType;
  x: number;
  morphTo: string;
  points: PointDef[];
}) => {
  const CaseWrapper = caseComponent[type];

  return (
    <CaseWrapper transform={`translate(${x}, 0)`}>
      {points.map(({ label, cxValues, cyValues }) => {
        const [startCx, endCx] = cxValues.split(";").map((value) => value.trim());
        const [startCy, endCy] = cyValues.split(";").map((value) => value.trim());

        return (
          <g key={label}>
            <Trail phase="outbound" cxValues={cxValues} cyValues={cyValues} targetCx={endCx} targetCy={endCy} />
            <Trail phase="return" cxValues={cxValues} cyValues={cyValues} targetCx={startCx} targetCy={startCy} />
            <GhostPoint phase="outbound" label={label} cx={endCx} cy={endCy} />
            <GhostPoint phase="return" label={label} cx={startCx} cy={startCy} />
          </g>
        );
      })}
      <MorphShape morphTo={morphTo} />
      {points.map(({ label, cxValues, cyValues }) => (
        <Point key={label} label={label} cxValues={cxValues} cyValues={cyValues} />
      ))}
    </CaseWrapper>
  );
};

export const MorphMistakesSvg = () => (
      <svg viewBox="0 0 900 300">
        <Case
          type="good"
          x={0}
          morphTo={goodSquarePath}
          points={[
            { label: "A", cxValues: "150;60;150", cyValues: "35;60;35" },
            { label: "B", cxValues: "265;240;265", cyValues: "150;60;150" },
            { label: "C", cxValues: "150;240;150", cyValues: "265;240;265" },
            { label: "D", cxValues: "35;60;35", cyValues: "150;240;150" },
          ]}
        />
        <Case
          type="middle"
          x={300}
          morphTo={middleSquarePath}
          points={[
            { label: "A", cxValues: "150;240;150", cyValues: "35;240;35" },
            { label: "B", cxValues: "265;60;265", cyValues: "150;240;150" },
            { label: "C", cxValues: "150;60;150", cyValues: "265;60;265" },
            { label: "D", cxValues: "35;240;35", cyValues: "150;60;150" },
          ]}
        />
        <Case
          type="bad"
          x={600}
          morphTo={badSquarePath}
          points={[
            { label: "A", cxValues: "150;60;150", cyValues: "35;60;35" },
            { label: "B", cxValues: "265;240;265", cyValues: "150;240;150" },
            { label: "C", cxValues: "150;240;150", cyValues: "265;60;265" },
            { label: "D", cxValues: "35;60;35", cyValues: "150;240;150" },
          ]}
        />
      </svg>
);
