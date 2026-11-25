import { useMemo } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { CloudLayer, PlacedCloud } from './cloudLayout';
import { cloudShapes, Lobe } from './cloudShapes';
import { cloudMargin, GeneratedCloud } from './GeneratedCloud';
import { generatedCloudPresets } from './generatedCloudPresets';
import { GeneratedDeck } from './GeneratedDeck';
import { Nimbostratus } from './Nimbostratus';
import { thinShapes, ThinShapeName } from './thinShapes';

import type { CloudType } from './cloudTypes';

const Ellipse = ({ cx, cy, rx, ry }: Lobe) => (
    <ellipse
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
    />
);

/** The sunlit side of a lobe: a bit smaller and pushed to the upper left. */
const lit = ({ cx, cy, rx, ry }: Lobe): Lobe => ({
    cx: cx - rx * 0.2,
    cy: cy - ry * 0.38,
    rx: rx * 0.7,
    ry: ry * 0.62,
});

const isThin = (shape: PlacedCloud['shape']): shape is ThinShapeName => shape in thinShapes;

const Cloud = ({ shape, x, y, scale }: PlacedCloud) => {
    const transform = `translate(${x} ${y}) scale(${scale})`;

    if (isThin(shape)) {
        return (
            <g
                className="cloudBody"
                transform={transform}
            >
                {thinShapes[shape].lobes.map(lobe => (
                    <Ellipse
                        key={`${lobe.cx}-${lobe.cy}`}
                        {...lobe}
                    />
                ))}
            </g>
        );
    }

    const { lens, lobes } = cloudShapes[shape];

    return (
        <g transform={transform}>
            <g className="cloudShade">
                <Ellipse {...lens} />
                {lobes.map(lobe => (
                    <Ellipse
                        key={`${lobe.cx}-${lobe.cy}`}
                        {...lobe}
                    />
                ))}
            </g>
            <g className="cloudBody">
                {lobes.map(lobe => (
                    <Ellipse
                        key={`${lobe.cx}-${lobe.cy}`}
                        {...lit(lobe)}
                    />
                ))}
            </g>
        </g>
    );
};

/**
 * A placed cloud drawn by the noise filter; the preset of the layer's type gives the look, the placement the position
 * and size. It is rendered once into an image: filters inside the parallax layers would otherwise run again on every
 * scroll frame, because SVG elements are not moved on the compositor.
 */
const GeneratedPlaced = ({ type, cloud }: { type: Exclude<CloudType, 'nimbostratus'>; cloud: PlacedCloud }) => {
    const look = generatedCloudPresets[type];
    const margin = cloudMargin(look.scale ?? 120, look.blur ?? 24);
    const width = 2 * (look.rx + margin);
    const height = 2 * (look.ry + margin);
    const seed = Math.round(cloud.x + cloud.y);
    const href = useMemo(
        () =>
            `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
                renderToStaticMarkup(
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={width}
                        height={height}
                        viewBox={`0 0 ${width} ${height}`}
                    >
                        <GeneratedCloud
                            {...look}
                            cx={width / 2}
                            cy={height / 2}
                            seed={seed}
                            id="cloud"
                        />
                    </svg>
                )
            )}`,
        [look, width, height, seed]
    );

    return (
        <image
            href={href}
            x={cloud.x - margin * cloud.scale}
            y={cloud.y - margin * cloud.scale}
            width={width * cloud.scale}
            height={height * cloud.scale}
        />
    );
};

/** One drift tile of a layer. */
export const CloudItems = ({ layer, generated }: { layer: CloudLayer; generated?: boolean }) => {
    if ('nimbostratus' === layer.type) {
        return generated ? <GeneratedDeck /> : <Nimbostratus />;
    }

    if (generated) {
        const { type } = layer;

        return (
            <>
                {layer.clouds.map(cloud => (
                    <GeneratedPlaced
                        key={`${cloud.shape}-${cloud.x}-${cloud.y}`}
                        type={type}
                        cloud={cloud}
                    />
                ))}
            </>
        );
    }

    return (
        <>
            {layer.clouds.map(cloud => (
                <Cloud
                    key={`${cloud.shape}-${cloud.x}-${cloud.y}`}
                    {...cloud}
                />
            ))}
        </>
    );
};
