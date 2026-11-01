import { styled } from '@linaria/react';

import { PointGroup } from './PointGroup';

const TrailLine = styled.line`
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
`;

// Shows only the position the animation is currently heading towards: the
// end point while running outbound, the start point while running back.
// Styled like the live point itself (same fill/text), just faded, so it
// reads as "this point, but not moving yet" rather than a separate marker.
export const GhostPoint = ({
    phase,
    label,
    cx,
    cy,
}: {
    phase: 'outbound' | 'return';
    label: string;
    cx: string;
    cy: string;
}) => (
    <PointGroup opacity={phase === 'outbound' ? 0.75 : 0}>
        <circle
            cx={cx}
            cy={cy}
            r={15}
        />
        <text
            x={cx}
            y={cy}
        >
            {label}
        </text>
        <animate
            attributeName="opacity"
            dur="3s"
            repeatCount="indefinite"
            keyTimes="0;0.5;0.5;1"
            values={phase === 'outbound' ? '0.75;0.75;0;0' : '0;0;0.75;0.75'}
        />
    </PointGroup>
);

// The remaining distance to the next ghost: tracks the live point's
// position on one end, stays fixed on the upcoming target on the other,
// so it visibly shrinks as the point approaches it.
export const Trail = ({
    phase,
    cxValues,
    cyValues,
    targetCx,
    targetCy,
}: {
    phase: 'outbound' | 'return';
    cxValues: string;
    cyValues: string;
    targetCx: string;
    targetCy: string;
}) => (
    <TrailLine
        x2={targetCx}
        y2={targetCy}
        opacity={phase === 'outbound' ? 0.75 : 0}
    >
        <animate
            attributeName="x1"
            dur="3s"
            repeatCount="indefinite"
            values={cxValues}
        />
        <animate
            attributeName="y1"
            dur="3s"
            repeatCount="indefinite"
            values={cyValues}
        />
        <animate
            attributeName="opacity"
            dur="3s"
            repeatCount="indefinite"
            keyTimes="0;0.5;0.5;1"
            values={phase === 'outbound' ? '0.75;0.75;0;0' : '0;0;0.75;0.75'}
        />
    </TrailLine>
);
