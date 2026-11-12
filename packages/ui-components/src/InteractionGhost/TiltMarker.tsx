import { styled } from '@linaria/react';

import { NameTag } from './NameTag';

const Group = styled.g`
    --ghost-kind-color: var(--color-ink-jade);
    pointer-events: none;
`;

const Line = styled.circle`
    fill: none;
    stroke: var(--ghost-color, var(--ghost-kind-color));
    stroke-width: 0.9;
`;

const Tick = styled.line`
    stroke: var(--ghost-color, var(--ghost-kind-color));
    stroke-width: 0.9;
    stroke-linecap: round;
`;

const Ball = styled.circle`
    fill: var(--ghost-color, var(--ghost-kind-color));
`;

export type TiltMarkerProps = {
    /** Center in SVG units of the surrounding `<svg viewBox="0 0 150 100">`. */
    x: number;
    y: number;
    /** 0 = invisible, 1 = fully shown. */
    presence: number;
    /** Normalized tilt (-1…1); the bubble rolls with it. */
    norm?: { x: number; y: number };
};

const RING_R = 6;
const ROLL = 3.2;
const DIRS = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
] as const;

export const TiltMarker = ({ x, y, presence, norm = { x: 0, y: 0 } }: TiltMarkerProps) => (
    <Group aria-hidden="true" opacity={Math.min(1, Math.max(0, presence))}>
        <Line cx={x} cy={y} r={RING_R} />
        {DIRS.map(([dx, dy]) => (
            <Tick key={`${dx}${dy}`} x1={x + dx * 7} y1={y + dy * 7} x2={x + dx * 9.5} y2={y + dy * 9.5} />
        ))}
        <Ball cx={x + norm.x * ROLL} cy={y + norm.y * ROLL} r={1.8} />
        <NameTag x={x + 7} y={y + 7} />
    </Group>
);
