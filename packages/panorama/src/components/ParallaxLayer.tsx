import { CSSProperties, FC, ReactNode } from 'react';

interface ParallaxLayerProps {
    scrollspeed: number;
    depth: number;
    children: ReactNode;
    cap?: boolean;
}

export const ParallaxLayer: FC<ParallaxLayerProps> = ({ cap = false, scrollspeed, depth, children }) => (
    <g
        className={`parallax-scroll${cap ? ' cap' : ''}`}
        style={
            {
                ['--scrollspeed' as string]: String(scrollspeed),
                ['--depth' as string]: String(depth),
            } as CSSProperties
        }
    >
        {children}
    </g>
);
