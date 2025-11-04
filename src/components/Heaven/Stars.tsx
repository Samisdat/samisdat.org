import { useEffect, useMemo, useState } from 'react';

interface StarsProps {
    opacity?: number;
}

const numberOfStarts = 200;

export const Stars = ({ opacity = 1 }: StarsProps) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const stars = useMemo(() => {
        return Array.from({ length: numberOfStarts }, (_, i) => {
            // Use a more stable pseudo-random function to avoid hydration mismatches
            const seed = i * 9999;
            const random = (n: number) => {
                const value = Math.sin(seed + n) * 10000;
                return Math.abs(value - Math.floor(value));
            };

            return {
                x: parseFloat((random(1) * 1500).toFixed(6)),
                y: parseFloat((random(2) * 300).toFixed(6)),
                radius: parseFloat((0.4 + random(3) * 1.6).toFixed(6)),
                brightness: parseFloat((0.3 + random(4) * 0.7).toFixed(6)),
                twinkleSpeed: parseFloat((2 + random(5) * 3).toFixed(6)),
                twinkleDelay: parseFloat((random(6) * 5).toFixed(6)),
            };
        });
    }, []);

    return (
        <g opacity={opacity}>
            {stars.map((star, i) => (
                <circle
                    key={i}
                    cx={star.x.toFixed(6)}
                    cy={star.y.toFixed(6)}
                    r={star.radius.toFixed(6)}
                    fill="#ffffff"
                    opacity={star.brightness.toFixed(6)}
                >
                    {isClient && (
                        <animate
                            attributeName="opacity"
                            values={`${star.brightness.toFixed(6)};${(star.brightness * 0.4).toFixed(6)};${star.brightness.toFixed(6)}`}
                            dur={`${star.twinkleSpeed.toFixed(6)}s`}
                            begin={`${star.twinkleDelay.toFixed(6)}s`}
                            repeatCount="indefinite"
                        />
                    )}
                </circle>
            ))}
        </g>
    );
};
