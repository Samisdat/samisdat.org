import { styled } from '@linaria/react';

const Segment = styled.line`
    stroke: var(--ghost-color, var(--color-ink-sapphire));
    stroke-width: 2.4;
    stroke-linecap: round;
    pointer-events: none;
`;

export type TrailProps = {
    /**
     * Recent finger positions, oldest first, in SVG units of the surrounding
     * `<svg viewBox="0 0 150 100">`. Opacity rises towards the last point.
     */
    points: ReadonlyArray<{ x: number; y: number }>;
    /** Overall opacity multiplier, 0..1. */
    presence?: number;
    /** Number of segments the opacity ramp is spread over. */
    length?: number;
};

const MAX_OPACITY = 0.55;

export const Trail = ({ points, presence = 1, length = 18 }: TrailProps) => {
    const recent = points.slice(-(length + 1));
    const offset = length - (recent.length - 1);

    return (
        <g aria-hidden="true" pointerEvents="none">
            {recent.slice(1).map((b, i) => {
                const a = recent[i];
                const opacity = ((i + offset + 1) / length) * MAX_OPACITY * presence;

                // segments are positional and never reorder
                // eslint-disable-next-line react/no-array-index-key
                return <Segment key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} opacity={opacity} />;
            })}
        </g>
    );
};
