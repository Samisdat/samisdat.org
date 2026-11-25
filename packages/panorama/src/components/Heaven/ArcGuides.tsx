const PARALLAX_PX = 4;
/** The layer the path is compared with: the farthest one, where the sun and the moon set. */
const REFERENCE_DEPTH = -7;
const BASELINE_START = { x: 432.747, y: 275.894 };

/** The parallax states to draw, in the order of the labels. */
const GUIDES = [
    { x: 0, y: 0, color: '#ffffff' },
    { x: -1, y: -1, color: '#ff5a5a' },
    { x: -1, y: 1, color: '#5aff7a' },
    { x: 1, y: -1, color: '#5ab4ff' },
    { x: 1, y: 1, color: '#ffd95a' },
] as const;

interface ArcGuidesProps {
    /** The y the path starts and ends on, and the factor the season scales its height with. */
    baseline: number;
    heightFactor: number;
}

/**
 * The sun and moon path once per parallax extreme, as thin lines. The path stands still while a layer moves by
 * `4px * parallax * depth`, so against the reference layer the path is moved the other way round.
 */
export const ArcGuides = ({ baseline, heightFactor }: ArcGuidesProps) => (
    <g
        pointerEvents="none"
        fill="none"
        strokeWidth={1.5}
    >
        {GUIDES.map(({ x, y, color }) => {
            const dx = -PARALLAX_PX * REFERENCE_DEPTH * x;
            const dy = -PARALLAX_PX * REFERENCE_DEPTH * y;

            return (
                <g
                    key={`${x}/${y}`}
                    stroke={color}
                >
                    <use
                        href="#sunAndMoonPath"
                        transform={`translate(${dx} ${baseline * (1 - heightFactor) + dy}) scale(1 ${heightFactor})`}
                    />
                    <text
                        x={BASELINE_START.x + dx - 4}
                        y={BASELINE_START.y + dy + 3}
                        fill={color}
                        stroke="none"
                        fontSize={10}
                        textAnchor="end"
                    >
                        {`${x}/${y}`}
                    </text>
                </g>
            );
        })}
    </g>
);
