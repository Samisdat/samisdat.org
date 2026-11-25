import { useMemo } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { SKY_WIDTH } from './cloudLayout';

/** Top of the image in the layer's coordinates: well above the sky, so the deck has no upper edge. */
const TOP = -60;
const HEIGHT = 280;
/** Where the underside sits in the image before the noise pushes it about. */
const UNDERSIDE = 190;
/** The filter reaches beyond the image on every side, so the blur and the displacement have pixels to read at its edges. */
const REACH = 140;

const BODY = '#a3a5b3';
const SHADE = '#6f6c86';

/** The deck as a standalone image. The noise tiles at the image width, so two drift tiles meet without a seam. */
const Deck = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={SKY_WIDTH}
        height={HEIGHT}
        viewBox={`0 0 ${SKY_WIDTH} ${HEIGHT}`}
    >
        <defs>
            <linearGradient
                id="deck-fill"
                gradientUnits="userSpaceOnUse"
                x1={0}
                y1={0}
                x2={0}
                y2={UNDERSIDE + 20}
            >
                <stop
                    offset={0.2}
                    stopColor={BODY}
                />
                <stop
                    offset={1}
                    stopColor={SHADE}
                />
            </linearGradient>
            <filter
                id="deck"
                filterUnits="userSpaceOnUse"
                x={-REACH}
                y={-REACH}
                width={SKY_WIDTH + 2 * REACH}
                height={HEIGHT + 2 * REACH}
            >
                <feGaussianBlur
                    in="SourceGraphic"
                    stdDeviation={14}
                    result="soft"
                />
                <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.004 0.012"
                    numOctaves={4}
                    seed={7}
                    stitchTiles="stitch"
                    x={0}
                    y={-REACH}
                    width={SKY_WIDTH}
                    height={HEIGHT + 2 * REACH}
                    result="noise"
                />
                <feDisplacementMap
                    in="soft"
                    in2="noise"
                    scale={90}
                    xChannelSelector="R"
                    yChannelSelector="G"
                />
            </filter>
        </defs>
        <rect
            x={-REACH}
            y={-REACH}
            width={SKY_WIDTH + 2 * REACH}
            height={UNDERSIDE + REACH}
            fill="url(#deck-fill)"
            filter="url(#deck)"
        />
    </svg>
);

/** A closed grey deck drawn by the noise filter, the cloud rain falls from; rendered once into an image. */
export const GeneratedDeck = () => {
    const href = useMemo(
        () => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(renderToStaticMarkup(<Deck />))}`,
        []
    );

    return (
        <image
            href={href}
            x={0}
            y={TOP}
            width={SKY_WIDTH}
            height={HEIGHT}
        />
    );
};
