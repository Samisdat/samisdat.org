import { CSSProperties, FC, ReactNode } from 'react';

interface ParallaxLayerProps {
    speed: number;
    depth: number;
    children: ReactNode;
    cap?: boolean;
}

export const ParallaxLayer: FC<ParallaxLayerProps> = ({ cap = false, speed, depth, children }) => (
    <g
        className={`parallax-scroll${cap ? ' cap' : ''}`}
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
