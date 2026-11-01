'use client';

import { styled } from '@linaria/react';
import { aubergine, ivory } from '@samisdat/color-scheme/primitives';

import { CRANK_ELEMENT_ID } from './crankEvents';

import type { RefObject } from 'react';

const CrankStyling = styled.svg`
    .plate {
        fill: ${ivory[100]};
    }

    .arm {
        fill: ${aubergine[950]};
    }

    .hub {
        fill: ${aubergine[950]};
    }

    .grip {
        fill: ${aubergine[950]};
    }

    .grip-highlight {
        fill: ${ivory[100]};
    }

    .ghost {
        opacity: 0;
        pointer-events: none;
    }

    .ghost * {
        fill: none;
        stroke: var(--color-status-danger);
        stroke-width: 2;
        stroke-dasharray: 4 3;
    }
`;

type CrankSvgProps = {
    groupRef: RefObject<SVGGElement | null>;
    animRef: RefObject<SVGAnimateTransformElement | null>;
    ghostRef: RefObject<SVGGElement | null>;
    baseDuration: number;
};

// `dur` is only ever written via setAttribute: a changing prop would make
// React touch the element, and the running interval must stay untouched.
export const CrankSvg = ({ groupRef, animRef, ghostRef, baseDuration }: CrankSvgProps) => {
    return (
        <CrankStyling viewBox="0 0 200 200">
            <circle
                cx={100}
                cy={100}
                r={80}
                className="plate"
            ></circle>
            <g
                ref={groupRef}
                id={CRANK_ELEMENT_ID}
            >
                <rect
                    x={96}
                    y={30}
                    width={8}
                    height={72}
                    rx={4}
                    className="arm"
                ></rect>
                <circle
                    cx={100}
                    cy={100}
                    r={12}
                    className="hub"
                ></circle>
                <circle
                    cx={100}
                    cy={30}
                    r={16}
                    className="grip"
                ></circle>
                <circle
                    cx={100}
                    cy={30}
                    r={6}
                    className="grip-highlight"
                ></circle>
                <animateTransform
                    ref={animRef}
                    attributeName="transform"
                    type="rotate"
                    from="0 100 100"
                    to="360 100 100"
                    dur={`${baseDuration}s`}
                    repeatCount="indefinite"
                ></animateTransform>
            </g>
            <g
                ref={ghostRef}
                className="ghost"
                transform="rotate(0 100 100)"
            >
                <rect
                    x={96}
                    y={30}
                    width={8}
                    height={72}
                    rx={4}
                ></rect>
                <circle
                    cx={100}
                    cy={30}
                    r={16}
                ></circle>
            </g>
        </CrankStyling>
    );
};
