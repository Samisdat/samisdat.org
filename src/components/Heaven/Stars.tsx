import { useMemo } from 'react';

interface StarsProps {
    opacity?: number;
}

const STAR_COUNT = 200;

export const Stars = ({ opacity = 1 }: StarsProps) => {
    const stars = useMemo(() => {
        return Array.from({ length: STAR_COUNT }, (_, i) => {
            const seed = i * 9999;
            const random = (n: number) => (Math.sin(seed + n) * 10000) % 1;

            return {
                x: Math.abs(random(1)) * 1500,
                y: Math.abs(random(2)) * 300,
                radius: 0.4 + Math.abs(random(3)) * 1.6,
                brightness: 0.3 + Math.abs(random(4)) * 0.7,
                twinkleSpeed: 2 + Math.abs(random(5)) * 3,
                twinkleDelay: Math.abs(random(6)) * 5,
            };
        });
    }, []);

    return (
        <g opacity={opacity}>
            {stars.map((star, i) => (
                <circle
                    key={i}
                    cx={star.x}
                    cy={star.y}
                    r={star.radius}
                    fill="#ffffff"
                    opacity={star.brightness}
                >
                    <animate
                        attributeName="opacity"
                        values={`${star.brightness};${star.brightness * 0.4};${star.brightness}`}
                        dur={`${star.twinkleSpeed}s`}
                        begin={`${star.twinkleDelay}s`}
                        repeatCount="indefinite"
                    />
                </circle>
            ))}
        </g>
    );
};
