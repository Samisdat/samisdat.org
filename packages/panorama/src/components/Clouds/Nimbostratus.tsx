import { SKY_WIDTH } from './cloudLayout';
import { random } from './random';

const PATCHES = 12;
const DECK_BOTTOM = 120;

const next = random(53);
/** Evenly spread along the sky, so the deck is seamless where two drift tiles meet. */
const underside = Array.from({ length: PATCHES }, (_, index) => ({
    cx: (index + 0.5) * (SKY_WIDTH / PATCHES),
    cy: DECK_BOTTOM + next() * 36,
    rx: 150 + next() * 40,
    ry: 34 + next() * 22,
}));

/** A closed grey deck with a ragged, lower underside, the cloud rain falls from. */
export const Nimbostratus = () => (
    <g>
        <g className="cloudShade">
            <rect
                x={-20}
                y={-40}
                width={SKY_WIDTH + 40}
                height={DECK_BOTTOM + 40}
            />
            {underside.map(({ cx, cy, rx, ry }) => (
                <ellipse
                    key={cx}
                    cx={cx}
                    cy={cy}
                    rx={rx}
                    ry={ry}
                />
            ))}
        </g>
        <g className="cloudBody">
            {underside.map(({ cx, cy, rx, ry }) => (
                <ellipse
                    key={cx}
                    cx={cx - rx * 0.1}
                    cy={cy - ry * 1.5}
                    rx={rx * 0.7}
                    ry={ry * 0.45}
                />
            ))}
        </g>
    </g>
);
