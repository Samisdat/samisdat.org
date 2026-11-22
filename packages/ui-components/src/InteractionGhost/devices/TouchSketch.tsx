import { ripple } from './SketchSvg';

import type { SketchProps } from './types';

export const TouchSketch = ({ frame }: SketchProps) => {
    const f = frame.finger ?? { x: frame.norm.x, y: frame.norm.y, presence: 1, down: false, age: Infinity };
    const sx = 44 + f.x * 9;
    const sy = 26 + f.y * 18;
    const wave = ripple(f.age, 600, 6);

    return (
        <>
            <rect className="sk" x={31} y={2} width={26} height={48} rx={4.5} />
            <rect className="sk" x={34} y={7} width={20} height={38} rx={1.2} />
            <line className="sk-solid" x1={41} y1={4.5} x2={47} y2={4.5} />
            <circle className="sk-solid" cx={sx} cy={sy} r={wave.r} opacity={wave.opacity} />
            <circle className="sk-fill" cx={sx} cy={sy} r={f.down ? 2 : 2.6} opacity={f.presence} />
        </>
    );
};
