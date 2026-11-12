import { ripple } from './SketchSvg';

import type { SketchProps } from './types';

export const MouseSketch = ({ frame }: SketchProps) => {
    const { norm, press } = frame;
    const mx = 44 + norm.x * 32;
    const my = 26 + norm.y * 12;
    const wave = ripple(press?.age ?? Infinity, 0.5, 6);

    return (
        <>
            <rect className="sk" x={2} y={2} width={84} height={48} rx={3} />
            <g transform={`translate(${mx} ${my})`}>
                <rect className="sk-solid" x={-6} y={-9} width={12} height={18} rx={6} />
                <line className="sk-solid" x1={-6} y1={-3} x2={6} y2={-3} />
                <line className="sk-solid" x1={0} y1={-9} x2={0} y2={-3} />
                <rect
                    className="sk-fill"
                    x={-5}
                    y={-8}
                    width={4.6}
                    height={4.6}
                    rx={2}
                    opacity={press?.down ? 1 : 0}
                />
            </g>
            <circle className="sk-solid" cx={mx} cy={my - 9} r={wave.r} opacity={wave.opacity} />
        </>
    );
};
