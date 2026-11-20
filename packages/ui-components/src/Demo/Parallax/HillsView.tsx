'use client';

import { styled } from '@linaria/react';
import { Ref } from 'react';

import { HillsBank } from './HillsBank';
import { ParallaxLayer } from './HillsLayer';

const Svg = styled.svg`
    aspect-ratio: 450/600;

    --hills-layer-dark: #0c1d22;
    --hills-layer-light: #bac3a2;
    --hills-sun: #f3e4b7;
    --hills-sky-0: #f3e4b7;
    --hills-sky-50: #a2b49a;
    --hills-sky-100: #84a38f;

    svg {
        width: 100%;
        height: 100%;
        fill-rule: evenodd;
        clip-rule: evenodd;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-miterlimit: 1.5;
        display: block;
        border-radius: 0.5rem;
        border: 1px solid var(--color-surface-subtle);
    }

    & .parallax {
        transition: transform 10ms ease;
        transform: translateX(calc(10px * var(--parallax-x) * var(--depth)))
            translateY(calc(10px * var(--parallax-y) * var(--depth)));
    }

    & .colorLayer {
        fill: color-mix(in srgb, var(--hills-layer-dark) calc(100% - var(--mix)), var(--hills-layer-light) var(--mix));
    }

    & .heaven {
        fill: url('#Linear2');
    }

    & .sun {
        fill: var(--hills-sun);
    }

    & .bankHighlight {
        --mix: 100%;
    }
`;

type Row = { depth: number; mix: number; href: '#hills' | '#hills-flipped'; y: number };

const BACK_ROWS: Row[] = [
    { depth: -6, mix: 11, href: '#hills', y: 0 },
    { depth: -5, mix: 10, href: '#hills-flipped', y: 0 },
    { depth: -4, mix: 9, href: '#hills', y: 90 },
    { depth: -3, mix: 8, href: '#hills-flipped', y: 90 },
    { depth: -2, mix: 7, href: '#hills', y: 180 },
    { depth: -1, mix: 6, href: '#hills-flipped', y: 180 },
];

const FRONT_ROWS: Row[] = [
    { depth: 2, mix: 4, href: '#hills', y: 270 },
    { depth: 3, mix: 3, href: '#hills-flipped', y: 270 },
    { depth: 4, mix: 2, href: '#hills', y: 350 },
    { depth: 5, mix: 1, href: '#hills-flipped', y: 350 },
];

const Rows = ({ rows }: { rows: Row[] }) => (
    <>
        {rows.map(({ depth, mix, href, y }) => (
            <ParallaxLayer
                key={depth}
                depth={depth}
                mix={mix}
            >
                <use
                    href={href}
                    x="0"
                    y={y}
                />
            </ParallaxLayer>
        ))}
    </>
);

const Defs = () => (
    <defs>
        <linearGradient
            id="Linear2"
            x1="0"
            y1="0"
            x2="1"
            y2="0"
            gradientUnits="userSpaceOnUse"
            gradientTransform="matrix(0.253198,-320.672,767.394,0.605923,224.889,236.369)"
        >
            <stop
                offset="0"
                style={{ stopColor: 'var(--hills-sky-0)', stopOpacity: 1 }}
            />
            <stop
                offset="0.5"
                style={{ stopColor: 'var(--hills-sky-50)', stopOpacity: 1 }}
            />
            <stop
                offset="1"
                style={{ stopColor: 'var(--hills-sky-100)', stopOpacity: 1 }}
            />
        </linearGradient>
        <path
            id="hills"
            d="M-159,114.517c26.239,3.278 101.379,6.715 195,25.952c58.318,11.982 123.806,48.23 189.112,62.085c65.635,13.924 131.086,5.456 188.888,17.913c112.175,24.174 195.543,53.663 195.543,53.663l-0,283.87l-768.543,0l0,-443.483Z"
        />
        <path
            id="hills-flipped"
            d="M609.543,114.517c-26.239,3.278 -101.38,6.715 -195,25.952c-58.318,11.982 -123.806,48.23 -189.112,62.085c-65.635,13.924 -131.086,5.456 -188.888,17.913c-112.175,24.174 -195.543,53.663 -195.543,53.663l-0,283.87l768.543,0l-0,-443.483Z"
        />
    </defs>
);

export const HillsView = ({ ref }: { ref?: Ref<SVGSVGElement> }) => (
    <Svg
        ref={ref}
        viewBox="0 0 450 600"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        xmlSpace="preserve"
    >
        <Defs />
        <g id="heaven">
            <rect
                className={'heaven'}
                x={0}
                y={0}
                width={768}
                height={768}
            />
            <ParallaxLayer depth={-8}>
                <circle
                    className={'sun'}
                    cx="225"
                    cy="123.496"
                    r="106.191"
                />
            </ParallaxLayer>
        </g>

        <ParallaxLayer
            depth={-7}
            mix={12}
        >
            <path d="M609,161.61l-195,-0c-63.013,-0 -90.589,-29.421 -189.038,-30c-95.788,-0.564 -125.975,30 -188.962,30l-195,-0l-0,389.55l768,0l-0,-389.55Z" />
        </ParallaxLayer>
        <Rows rows={BACK_ROWS} />
        <HillsBank />
        <Rows rows={FRONT_ROWS} />
    </Svg>
);
