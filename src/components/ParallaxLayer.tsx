import { CSSProperties, FC, ReactNode } from 'react';

interface ParallaxLayerProps {
    speed: number;
    depth: number;
    children: ReactNode;
}

export const ParallaxLayer: FC<ParallaxLayerProps> = ({ speed, depth, children }) => (
    <g
        className="parallax-scroll"
        style={{ ['--speed' as string]: String(speed) } as CSSProperties}
    >
        <g
            className="parallax-mouse"
            data-depth={depth}
        >
            {children}
        </g>
    </g>
);
