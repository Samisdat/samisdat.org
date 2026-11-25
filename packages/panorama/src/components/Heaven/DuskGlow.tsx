interface DuskGlowProps {
    /** True in the morning: the glow sits where the sun rises, otherwise where it sets. */
    morning: boolean;
    /** 0..1, how strong the glow is. */
    amount: number;
}

/** Centre of the glow at sunrise and at sunset; the sunset side mirrors the sunrise side on the arc, but sits lower, the sunrise side higher. */
const CENTER = { sunrise: { x: 455, y: 185 }, sunset: { x: 1248, y: 235 } };

/**
 * The glow of the sun on the horizon: a yellow core in a red halo, two blurred ellipses (colours in the stylesheet).
 * The blur is an SVG filter: Safari ignores the CSS blur on SVG elements. It is not part of a parallax layer, so it
 * stays where the sun sets whatever the layers do, and the hills in front of it cover its lower half.
 */
export const DuskGlow = ({ morning, amount }: DuskGlowProps) => {
    if (amount <= 0) {
        return null;
    }

    const { x, y } = morning ? CENTER.sunrise : CENTER.sunset;

    return (
        // The amount follows the clock, which differs by milliseconds between the server and the browser.
        <g
            className="dusk-glow"
            opacity={amount.toFixed(3)}
            suppressHydrationWarning
        >
            <defs>
                {/* The region reaches three blur radii beyond the ellipse, as a share of its box. */}
                <filter
                    id="duskHaloBlur"
                    x="-0.4"
                    y="-0.85"
                    width="1.8"
                    height="2.7"
                >
                    <feGaussianBlur stdDeviation={50} />
                </filter>
                <filter
                    id="duskCoreBlur"
                    x="-0.62"
                    y="-1.35"
                    width="2.24"
                    height="3.7"
                >
                    <feGaussianBlur stdDeviation={40} />
                </filter>
            </defs>
            <ellipse
                className="dusk-halo"
                cx={x}
                cy={y}
                rx={196}
                ry={90.5}
                filter="url(#duskHaloBlur)"
            />
            <ellipse
                className="dusk-core"
                cx={x}
                cy={y}
                rx={98}
                ry={45}
                filter="url(#duskCoreBlur)"
            />
        </g>
    );
};
