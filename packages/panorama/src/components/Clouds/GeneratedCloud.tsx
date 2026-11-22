import { useId } from 'react';

export interface GeneratedCloudProps {
    /** Centre of the cloud body in the parent's coordinate space. */
    cx: number;
    cy: number;
    /** Half width and half height of the undistorted body. */
    rx: number;
    ry: number;
    /** Picks the shape; the same seed always draws the same cloud. */
    seed?: number;
    /** Lower is rounder and fuzzier, higher is more rigid. Cumulus sits around 0.005 to 0.016. */
    baseFrequency?: number;
    /** Detail of the noise; 4 or 5 is enough, more costs a lot of render time. */
    octaves?: number;
    /** How far the noise pushes the body out of shape. */
    scale?: number;
    /** Softness of the edge, applied before the distortion so the rim stays feathery. */
    blur?: number;
    /** Lit side and shaded side, as `#rrggbb`. */
    body?: string;
    shade?: string;
    /** Strength of the relief shading; 0 draws the cloud flat in `body`. */
    relief?: number;
    /** Cuts a flat underside, like a cumulus resting on one layer of air. */
    flatBase?: boolean;
}

interface ReliefProps {
    strength: number;
    /** Blur of the height map: how broad the lit and shaded sides are. */
    wide: number;
}

/** Brightness of the steepest shaded slope against a lit one. */
const DARKEST = 0.72;

/** Lights the distorted shape from the upper left; shaded slopes multiply the colour darker. */
const Relief = ({ strength, wide }: ReliefProps) => (
    <>
        <feGaussianBlur
            in="shape"
            stdDeviation={wide}
            result="wide"
        />
        <feComposite
            in="wide"
            in2="noise"
            operator="arithmetic"
            k2={0.9}
            k3={0.7}
            result="rough"
        />
        <feGaussianBlur
            in="rough"
            stdDeviation={3}
            result="height"
        />
        <feDiffuseLighting
            in="height"
            surfaceScale={strength}
            diffuseConstant={1.1}
            lightingColor="#fff"
            result="light"
        >
            <feDistantLight
                azimuth={235}
                elevation={50}
            />
        </feDiffuseLighting>
        <feComponentTransfer
            in="light"
            result="tinted"
        >
            {['R', 'G', 'B'].map(channel => {
                const Func = { R: 'feFuncR', G: 'feFuncG', B: 'feFuncB' }[channel] as 'feFuncR';

                return (
                    <Func
                        key={channel}
                        type="table"
                        tableValues={`${DARKEST} 1 1`}
                    />
                );
            })}
        </feComponentTransfer>
        <feBlend
            in="shape"
            in2="tinted"
            mode="multiply"
            result="lit"
        />
        <feComposite
            in="lit"
            in2="shape"
            operator="in"
        />
    </>
);

interface ShadeGradientProps {
    id: string;
    top: number;
    bottom: number;
    body: string;
    shade: string;
}

/** Body colour on top, shade below: the bulk of the cloud's own shadow. */
const ShadeGradient = ({ id, top, bottom, body, shade }: ShadeGradientProps) => (
    <linearGradient
        id={id}
        gradientUnits="userSpaceOnUse"
        x1={0}
        y1={top}
        x2={0}
        y2={bottom}
    >
        <stop
            offset={0}
            stopColor={body}
        />
        <stop
            offset={0.5}
            stopColor={body}
        />
        <stop
            offset={1}
            stopColor={shade}
        />
    </linearGradient>
);

interface FlatBaseProps {
    id: string;
    cx: number;
    cy: number;
    rx: number;
    ry: number;
    margin: number;
    shapeProps: { fill: string; filter: string };
}

/** A dome whose underside the noise pushes about; a mask fades it out level, a little below the base. */
const FlatBase = ({ id, cx, cy, rx, ry, margin, shapeProps }: FlatBaseProps) => (
    <>
        <linearGradient
            id={`${id}-fade`}
            gradientUnits="userSpaceOnUse"
            x1={0}
            y1={cy + ry * 0.7}
            x2={0}
            y2={cy + ry * 1.15}
        >
            <stop
                offset={0}
                stopColor="#fff"
            />
            <stop
                offset={1}
                stopColor="#000"
            />
        </linearGradient>
        <mask
            id={`${id}-base`}
            maskUnits="userSpaceOnUse"
            x={cx - rx - margin}
            y={cy - ry - 2 * margin}
            width={2 * (rx + margin)}
            height={4 * margin + 2 * ry}
        >
            <rect
                x={cx - rx - margin}
                y={cy - ry - 2 * margin}
                width={2 * (rx + margin)}
                height={4 * margin + 2 * ry}
                fill={`url(#${id}-fade)`}
            />
        </mask>
        <g mask={`url(#${id}-base)`}>
            <path
                d={`M${cx - rx} ${cy + ry} A${rx} ${2 * ry} 0 0 1 ${cx + rx} ${cy + ry}Z`}
                {...shapeProps}
            />
        </g>
    </>
);

/** How far the filtered cloud reaches beyond its body: the displacement moves pixels by up to half the scale, the blur spreads them by about three sigma. */
export const cloudMargin = (scale: number, blur: number): number => scale / 2 + blur * 3;

/**
 * One cloud made of a blurred shape that an SVG noise filter pushes out of shape
 * (feTurbulence into feDisplacementMap), after "Drawing Realistic Clouds with SVG and CSS".
 */
export const GeneratedCloud = ({
    cx,
    cy,
    rx,
    ry,
    seed = 0,
    baseFrequency = 0.012,
    octaves = 4,
    scale = 120,
    blur = 24,
    body = '#ffffff',
    shade = '#8a9bb5',
    relief = 14,
    flatBase = false,
}: GeneratedCloudProps) => {
    const id = `cloud-${useId().replace(/:/g, '')}`;
    const margin = cloudMargin(scale, blur);
    const shapeProps = { fill: `url(#${id}-fill)`, filter: `url(#${id})` };

    return (
        <>
            <defs>
                <ShadeGradient
                    id={`${id}-fill`}
                    top={cy - ry}
                    bottom={cy + ry}
                    body={body}
                    shade={shade}
                />
                <filter
                    id={id}
                    filterUnits="userSpaceOnUse"
                    x={cx - rx - margin}
                    y={cy - ry - margin}
                    width={2 * (rx + margin)}
                    height={2 * (ry + margin)}
                >
                    <feGaussianBlur
                        in="SourceGraphic"
                        stdDeviation={blur}
                        result="soft"
                    />
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency={baseFrequency}
                        numOctaves={octaves}
                        seed={seed}
                        result="noise"
                    />
                    <feDisplacementMap
                        in="soft"
                        in2="noise"
                        scale={scale}
                        xChannelSelector="R"
                        yChannelSelector="G"
                        result="shape"
                    />
                    {relief > 0 && (
                        <Relief
                            strength={relief}
                            wide={blur}
                        />
                    )}
                </filter>
            </defs>
            {flatBase ? (
                <FlatBase
                    id={id}
                    cx={cx}
                    cy={cy}
                    rx={rx}
                    ry={ry}
                    margin={margin}
                    shapeProps={shapeProps}
                />
            ) : (
                <ellipse
                    cx={cx}
                    cy={cy}
                    rx={rx}
                    ry={ry}
                    {...shapeProps}
                />
            )}
        </>
    );
};
