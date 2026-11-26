import { SkyPalette } from '@/lib/sky';

interface SkyGradientProps {
    palette: Pick<SkyPalette, 'zenith' | 'horizon' | 'glowBand'>;
}

/** The sky: zenith colour on top, horizon colour in the middle, the glow band of the low sun at the bottom. */
export const SkyGradient = ({ palette }: SkyGradientProps) => (
    <linearGradient
        id="dayskyGradient"
        // The palette follows the clock, which differs by milliseconds between server and browser.
        suppressHydrationWarning
        x1="0%"
        y1="0%"
        x2="0%"
        y2="100%"
    >
        <stop
            suppressHydrationWarning
            offset="0%"
            stopColor={palette.zenith}
        />
        <stop
            suppressHydrationWarning
            offset="10%"
            stopColor={palette.zenith}
        />
        <stop
            suppressHydrationWarning
            offset="30%"
            stopColor={palette.horizon}
        />
        <stop
            suppressHydrationWarning
            offset="58%"
            stopColor={palette.glowBand}
        />
        <stop
            suppressHydrationWarning
            offset="100%"
            stopColor={palette.glowBand}
        />
    </linearGradient>
);
