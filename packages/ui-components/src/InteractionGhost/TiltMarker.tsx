import { styled } from '@linaria/react';

import { NameTag } from './NameTag';

const Group = styled.g`
    --ghost-kind-color: var(--color-ink-jade);
    pointer-events: none;
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

const ROLL = 3.2;

/** Only the rolling bubble and the name tag: a ring or ripple around it was mistaken for a target. */
export const TiltMarker = ({ x, y, presence, norm = { x: 0, y: 0 } }: TiltMarkerProps) => (
    <Group
        aria-hidden="true"
        opacity={Math.min(1, Math.max(0, presence))}
    >
        <Ball
            cx={x + norm.x * ROLL}
            cy={y + norm.y * ROLL}
            r={1.8}
        />
        <NameTag
            x={x + 7}
            y={y + 7}
        />
    </Group>
);
