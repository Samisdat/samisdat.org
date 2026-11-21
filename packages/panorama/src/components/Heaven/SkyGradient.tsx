/** The day sky: deep blue at the top, light blue towards the horizon. */
export const SkyGradient = () => (
    <linearGradient
        id="dayskyGradient"
        x1="0%"
        y1="0%"
        x2="0%"
        y2="100%"
    >
        <stop
            offset="0%"
            style={{ stopColor: '#0376BF' }}
        />
        <stop
            offset="10%"
            style={{ stopColor: '#0376BF' }}
        />
        <stop
            offset="60%"
            style={{ stopColor: '#A8D0F5' }}
        />

        <stop
            offset="100%"
            style={{ stopColor: '#A8D0F5' }}
        />
    </linearGradient>
);
