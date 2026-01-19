import { CSSProperties } from 'react';
import { Checkerboard } from './Checkerboard';
import { config, DemoAnimationsCompareProps } from './shared';

export const Css = ({ isPlaying, resetTrigger }: DemoAnimationsCompareProps) => (
    <svg
        viewBox="0 0 200 30"
        style={
            {
                '--distance': `${config.distance}px`,
                '--duration': `${config.duration}ms`,
                '--repeats': config.repeats,
            } as CSSProperties
        }
    >
        <Checkerboard
            width={230}
            height={30}
        />
        <circle
            key={resetTrigger}
            className={`css ${isPlaying ? 'playing' : ''}`}
            cx={config.startX}
            cy={config.circleY}
            r={config.circleRadius}
        />
    </svg>
);
