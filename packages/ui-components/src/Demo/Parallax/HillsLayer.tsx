import { CSSProperties, ReactNode } from 'react';

export const ParallaxLayer = ({ depth, children, mix }: { depth: number; mix?: number; children: ReactNode }) => (
    <g
        className={`${!mix ? '' : 'colorLayer'} parallax`}
        style={
            {
                ['--depth' as string]: String(depth),
                ['--mix' as string]: `${String((mix ?? 0) * 8)}%`,
            } as CSSProperties
        }
    >
        {children}
    </g>
);
