import { styled } from '@linaria/react';

const Group = styled.g`
    fill: none;
    stroke: var(--ghost-color, var(--color-ink-sapphire));
    stroke-width: 0.9;
    stroke-linecap: round;
    stroke-linejoin: round;
    pointer-events: none;

    & .line {
        stroke-dasharray: 2 2.4;
        opacity: 0.55;
    }

    & .start {
        fill: var(--ghost-color, var(--color-ink-sapphire));
        stroke: none;
        opacity: 0.6;
    }

    & .head {
        opacity: 0.7;
    }

    & .target {
        stroke-dasharray: 1.6 2;
        opacity: 0.55;
    }
`;

export type GhostPathProps = {
    /**
     * Path in SVG units of the surrounding `<svg viewBox="0 0 150 100">`.
     * A single point renders a dashed tap target.
     */
    points: ReadonlyArray<{ x: number; y: number }>;
};

const TAP_THRESHOLD = 1.2;

export const GhostPath = ({ points }: GhostPathProps) => {
    if (points.length === 0) {
        return null;
    }

    const first = points[0];
    const last = points[points.length - 1];
    const before = points[Math.max(0, points.length - 4)];

    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    const w = Math.max(...xs) - Math.min(...xs);
    const h = Math.max(...ys) - Math.min(...ys);

    if (w < TAP_THRESHOLD && h < TAP_THRESHOLD) {
        return (
            <Group aria-hidden="true">
                <circle className="target" cx={first.x} cy={first.y} r={5.5} />
            </Group>
        );
    }

    const angle = (Math.atan2(last.y - before.y, last.x - before.x) * 180) / Math.PI;

    return (
        <Group aria-hidden="true">
            <polyline className="line" points={points.map((p) => `${p.x},${p.y}`).join(' ')} />
            <circle className="start" cx={first.x} cy={first.y} r={1.2} />
            <path className="head" d="M-2.4,-2 L0,0 L-2.4,2" transform={`translate(${last.x},${last.y}) rotate(${angle})`} />
        </Group>
    );
};
