import { FC } from 'react';

interface SunProps {
    x: number;
    y: number;
    /** Fill colour; falls back to the stylesheet colour. */
    color?: string;
    /** 0..1: strength of the flat halo around the disc. */
    glow?: number;
}

const RADIUS = 25;

export const Sun: FC<SunProps> = ({ x, y, color, glow = 0 }) => (
    <>
        {/* The colour and the glow follow the clock, which differs by a few milliseconds between the server and the browser */}
        {glow > 0 && (
            <circle
                cx={x}
                cy={y}
                r={RADIUS * 1.9}
                fill={color}
                opacity={glow * 0.28}
                suppressHydrationWarning
            />
        )}
        <circle
            className={'sun'}
            cx={x}
            cy={y}
            r={RADIUS}
            style={color ? { fill: color } : undefined}
            suppressHydrationWarning
        />
    </>
);
