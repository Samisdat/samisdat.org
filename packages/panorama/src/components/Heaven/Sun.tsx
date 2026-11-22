import { FC } from 'react';

interface SunProps {
    x: number;
    y: number;
    /** Fill colour; falls back to the stylesheet colour. */
    color?: string;
    /** Radius factor, larger near the horizon. */
    scale?: number;
    /** 0..1: strength of the flat halo around the disc. */
    glow?: number;
}

const RADIUS = 25;

export const Sun: FC<SunProps> = ({ x, y, color, scale = 1, glow = 0 }) => (
    <>
        {glow > 0 && (
            <circle
                cx={x}
                cy={y}
                r={RADIUS * scale * 1.9}
                fill={color}
                opacity={glow * 0.28}
            />
        )}
        <circle
            className={'sun'}
            cx={x}
            cy={y}
            r={RADIUS * scale}
            style={color ? { fill: color } : undefined}
        />
    </>
);
