import { CloudLayer, PlacedCloud } from './cloudLayout';
import { cloudShapes, Lobe } from './cloudShapes';
import { Nimbostratus } from './Nimbostratus';
import { thinShapes, ThinShapeName } from './thinShapes';

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

const isThin = (shape: PlacedCloud['shape']): shape is ThinShapeName => shape in thinShapes;

const Cloud = ({ shape, x, y, scale }: PlacedCloud) => {
    const transform = `translate(${x} ${y}) scale(${scale})`;

    if (isThin(shape)) {
        return (
            <g
                className="cloudBody"
                transform={transform}
            >
                {thinShapes[shape].lobes.map((lobe) => (
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
};

/** One drift tile of a layer. */
export const CloudItems = ({ layer }: { layer: CloudLayer }) => {
    if ('nimbostratus' === layer.type) {
        return <Nimbostratus />;
    }

    return (
        <>
            {layer.clouds.map((cloud) => (
                <Cloud
                    key={`${cloud.shape}-${cloud.x}-${cloud.y}`}
                    {...cloud}
                />
            ))}
        </>
    );
};
