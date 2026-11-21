import { CSSProperties } from 'react';

import { Weather } from '@/lib/weather';

import { ParallaxLayer } from '../ParallaxLayer';
import { CloudLayer, layersFor, SKY_WIDTH } from './cloudLayout';
import { cloudShapes, Lobe } from './cloudShapes';

/** How much the sky behind the clouds darkens, by cover. */
const TINT: Record<Weather['cover'], number> = { clear: 0, light: 0, cloudy: 0.05, mostly: 0.22, overcast: 0.5 };
const TONE: Record<Weather['cover'], string> = {
    clear: 'fair',
    light: 'fair',
    cloudy: 'fair',
    mostly: 'mix',
    overcast: 'overcast',
};

const Ellipse = ({ cx, cy, rx, ry }: Lobe) => (
    <ellipse
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
    />
);

/** The sunlit side of a lobe: a bit smaller and pushed to the upper left. */
const lit = ({ cx, cy, rx, ry }: Lobe): Lobe => ({ cx: cx - rx * 0.2, cy: cy - ry * 0.38, rx: rx * 0.7, ry: ry * 0.62 });

const LayerClouds = ({ layer }: { layer: CloudLayer }) => (
    <>
        {layer.clouds.map(({ shape, x, y, scale }) => {
            const { lens, lobes } = cloudShapes[shape];

            return (
                <g
                    key={`${shape}-${x}-${y}`}
                    transform={`translate(${x} ${y}) scale(${scale})`}
                >
                    <g className="cloudShade">
                        <Ellipse {...lens} />
                        {lobes.map((lobe) => (
                            <Ellipse
                                key={`${lobe.cx}-${lobe.cy}`}
                                {...lobe}
                            />
                        ))}
                    </g>
                    <g className="cloudBody">
                        {lobes.map((lobe) => (
                            <Ellipse
                                key={`${lobe.cx}-${lobe.cy}`}
                                {...lit(lobe)}
                            />
                        ))}
                    </g>
                </g>
            );
        })}
    </>
);

interface CloudsProps {
    weather: Weather;
    /** 0 by day, 1 at night, in between at dusk and dawn. */
    night: number;
}

/** Clouds drifting across the sky, in front of sun and moon, behind the hills. */
export const Clouds = ({ weather, night }: CloudsProps) => {
    const { cover, rain } = weather;

    const tone = 'none' === rain ? TONE[cover] : 'grey';

    return (
        <g
            className={`clouds tone-${tone}`}
            style={{ ['--night' as string]: String(night), ['--tint' as string]: String(TINT[cover]) } as CSSProperties}
        >
            {TINT[cover] > 0 && (
                <rect
                    className="cloudTint"
                    width={SKY_WIDTH}
                    height={330}
                />
            )}
            {'overcast' === cover && (
                <rect
                    className="cloudBody"
                    x={-20}
                    y={-20}
                    width={SKY_WIDTH + 40}
                    height={190}
                />
            )}
            {layersFor(cover).map((layer, index) => (
                <ParallaxLayer
                    key={layer.duration}
                    scrollspeed={14 - index}
                    depth={-6 + index}
                >
                    <g
                        className="cloudDrift"
                        style={{ ['--duration' as string]: `${layer.duration}s` } as CSSProperties}
                    >
                        <LayerClouds layer={layer} />
                        <g transform={`translate(${SKY_WIDTH} 0)`}>
                            <LayerClouds layer={layer} />
                        </g>
                    </g>
                </ParallaxLayer>
            ))}
        </g>
    );
};
