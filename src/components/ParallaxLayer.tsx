import { CSSProperties, FC, ReactNode } from 'react';

interface ParallaxLayerProps {
    speed: number;
    depth: number;
    children: ReactNode;
}

export const ParallaxLayer: FC<ParallaxLayerProps> = ({ speed, depth, children }) => (
    <g
        className="parallax-scroll"
        data-depth={depth}
        style={
            {
                ['--speed' as string]: String(speed),
                ['--depth' as string]: String(depth),
            } as CSSProperties
        }
    >
        {children}
    </g>
);
