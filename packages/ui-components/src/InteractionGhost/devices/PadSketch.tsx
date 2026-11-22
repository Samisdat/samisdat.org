import { ripple } from './SketchSvg';

import type { SketchProps } from './types';

export const PadSketch = ({ frame }: SketchProps) => {
    const f = frame.finger ?? { x: frame.norm.x, y: frame.norm.y, presence: 1, down: false, age: Infinity };
    const cx = 44 + f.x * 26;
    const cy = 26 + f.y * 17;
    const wave = ripple(f.age, 600, 7);

    return (
        <>
            <rect className="sk" x={12} y={4} width={64} height={44} rx={4} />
            <circle className="sk-solid" cx={cx} cy={cy} r={wave.r} opacity={wave.opacity} />
            <circle className="sk-fill" cx={cx} cy={cy} r={f.down ? 2 : 2.6} opacity={f.presence} />
        </>
    );
};
