import { useMemo } from 'react';
import { calculateStarPosition } from './starCalculations';
import { brightStars } from './starCatalog';

interface StarsProps {
    opacity?: number;
    time: Date;
}

export const Stars = ({ opacity = 1, time }: StarsProps) => {
    const starPositions = useMemo(() => {
        return brightStars.map(star => ({
            ...star,
            position: calculateStarPosition(star, time, 1500, 300),
        }));
    }, [time]);

    return (
        <g opacity={opacity}>
            {starPositions.map((star, index) => {
                if (!star.position.visible) return null;

                const radius = Math.max(0.4, Math.min(2, (1 - star.magnitude / 2) * 1.5));
                const animationDuration = 2 + Math.random() * 3;
                const animationDelay = Math.random() * 5;

                return (
                    <circle
                        key={index}
                        cx={star.position.x}
                        cy={star.position.y}
                        r={radius}
                        fill="#ffffff"
                        opacity={star.position.brightness}
                    >
                        <animate
                            attributeName="opacity"
                            values={`${star.position.brightness};${star.position.brightness * 0.4};${star.position.brightness}`}
                            dur={`${animationDuration}s`}
                            begin={`${animationDelay}s`}
                            repeatCount="indefinite"
                        />
                    </circle>
                );
            })}
        </g>
    );
};
