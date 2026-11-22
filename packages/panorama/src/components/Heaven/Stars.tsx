import { random } from '../Clouds/random';

interface Star {
    x: number;
    y: number;
    r: number;
    /** Share of the darkness at which the star starts to show: faint ones appear late. */
    threshold: number;
}

const COUNT = 70;
const WIDTH = 1700;
const HEIGHT = 250;

const rand = random(2718);

const STARS: Star[] = Array.from({ length: COUNT }, () => ({
    x: Math.round(rand() * WIDTH),
    // Fewer stars towards the horizon, where the sky is brighter
    y: Math.round(rand() ** 1.4 * HEIGHT),
    r: 0.8 + rand() * 1.4,
    threshold: rand() * 0.8,
}));

interface StarsProps {
    /** 0..1, how dark the sky is, see skyPalette. */
    amount: number;
}

/** Flat white dots; they fade in one by one as the sky darkens. */
export const Stars = ({ amount }: StarsProps) => {
    if (amount <= 0) {
        return null;
    }

    return (
        <g className="stars">
            {STARS.map(({ x, y, r, threshold }) => {
                const opacity = Math.max(0, Math.min(1, (amount - threshold) / 0.2));

                return opacity > 0 ? (
                    <circle
                        key={`${x}-${y}`}
                        cx={x}
                        cy={y}
                        r={r}
                        opacity={opacity}
                    />
                ) : null;
            })}
        </g>
    );
};
