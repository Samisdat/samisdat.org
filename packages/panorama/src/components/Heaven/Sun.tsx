import { FC } from 'react';

interface SunProps {
    x: number;
    y: number;
    /** Fill colour; falls back to the stylesheet colour. */
    color?: string;
}

const RADIUS = 25;

export const Sun: FC<SunProps> = ({ x, y, color }) => (
    <>
        {/* The colour follows the clock, which differs by a few milliseconds between the server and the browser */}
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
