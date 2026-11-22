import { CSSProperties } from 'react';

import { skyFromCover } from '@/lib/sky';
import { Weather } from '@/lib/weather';

import { ParallaxLayer } from '../ParallaxLayer';
import { CloudItems } from './CloudItems';
import { layersFor, SKY_WIDTH } from './cloudLayout';
import { CloudPalette, CloudType } from './cloudTypes';

/** How much the sky behind the clouds darkens, by cover. */
const TINT: Record<Weather['cover'], number> = { clear: 0, light: 0, cloudy: 0.05, mostly: 0.22, overcast: 0.5 };
const TONE: Record<Weather['cover'], string> = {
    clear: 'fair',
    light: 'fair',
    cloudy: 'fair',
    mostly: 'mix',
    overcast: 'overcast',
};

/** A palette as the custom properties the cloud classes read; unset colours keep the tone's default. */
const paletteVars = ({ day, night }: CloudPalette = {}): Record<string, string> => {
    const vars: Record<string, string | undefined> = {
        '--d-b': day?.body,
        '--d-s': day?.shade,
        '--n-b': night?.body,
        '--n-s': night?.shade,
    };

    return Object.fromEntries(Object.entries(vars).filter(([, value]) => undefined !== value)) as Record<string, string>;
};

interface CloudsProps {
    weather: Weather;
    /** 0 by day, 1 at night, in between at dusk and dawn. */
    night: number;
    /** Colours per cloud type, to replace the default day and night tones. */
    palettes?: Partial<Record<CloudType, CloudPalette>>;
    /** Low sunlight on the clouds: its colour and strength (0..1). */
    glow?: { color: string; amount: number };
}

/** Clouds drifting across the sky, in front of sun and moon, behind the hills. */
export const Clouds = ({ weather, night, palettes, glow }: CloudsProps) => {
    const { cover, rain } = weather;
    const tone = 'none' === rain ? TONE[cover] : 'grey';

    return (
        <g
            className={`clouds tone-${tone}`}
            style={
                {
                    ['--night' as string]: String(night),
                    ['--tint' as string]: String(TINT[cover]),
                    ['--glow' as string]: String(glow?.amount ?? 0),
                    ['--glow-c' as string]: glow?.color ?? 'transparent',
                } as CSSProperties
            }
        >
            {TINT[cover] > 0 && (
                <rect
                    className="cloudTint"
                    width={SKY_WIDTH}
                    height={330}
                />
            )}
            {layersFor(weather.sky ?? skyFromCover(cover), rain).map((layer, index) => (
                <ParallaxLayer
                    key={layer.type}
                    scrollspeed={14 - index}
                    depth={-6 + index}
                >
                    <g
                        className={`cloudLayer type-${layer.type}`}
                        style={paletteVars(palettes?.[layer.type]) as CSSProperties}
                    >
                        <g
                            className="cloudDrift"
                            style={{ ['--duration' as string]: `${layer.duration}s` } as CSSProperties}
                        >
                            <CloudItems layer={layer} />
                            <g transform={`translate(${SKY_WIDTH} 0)`}>
                                <CloudItems layer={layer} />
                            </g>
                        </g>
                    </g>
                </ParallaxLayer>
            ))}
        </g>
    );
};
