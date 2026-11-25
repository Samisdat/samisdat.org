import { CloudLayer, isBump, PlacedThin } from './cloudLayout';
import { thinShapes } from './thinShapes';

const ThinCloud = ({ shape, x, y, scale }: PlacedThin) => (
    <g
        className="cloudBody"
        transform={`translate(${x} ${y}) scale(${scale})`}
    >
        {thinShapes[shape].lobes.map(({ cx, cy, rx, ry }) => (
            <ellipse
                key={`${cx}-${cy}`}
                cx={cx}
                cy={cy}
                rx={rx}
                ry={ry}
            />
        ))}
    </g>
);

/** One drift tile of a layer that drifts as a whole: the cirrus streaks. */
export const CloudItems = ({ layer }: { layer: CloudLayer }) => {
    return (
        <>
            {layer.clouds
                .filter((cloud): cloud is PlacedThin => !isBump(cloud))
                .map(cloud => (
                    <ThinCloud
                        key={`${cloud.shape}-${cloud.x}-${cloud.y}`}
                        {...cloud}
                    />
                ))}
        </>
    );
};
