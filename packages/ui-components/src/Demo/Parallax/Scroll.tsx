'use client';

import { styled } from '@linaria/react';
import { useEffect, useState } from 'react';

import { useDemoContext } from '../DemoContext';
import { ScrollLayer, ScrollPosition, START } from './ScrollLayer';

const Styling = styled.div`
    position: relative;
    aspect-ratio: 15/10;

    & svg {
        display: block;
        border-radius: 0.5rem;
        border: 1px solid var(--color-border-default);
        background-color: var(--color-surface-raised);
    }

    & svg text {
        font-family: monospace;
        font-size: 7px;
        fill: var(--color-surface-raised);
    }

    & svg path,
    & svg line {
        fill: none;
        stroke: var(--color-text-default);
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-miterlimit: 1.5;
    }

    & svg line.bold {
        stroke-width: 3px;
    }

    & svg circle {
        fill: var(--color-ink-ruby);
    }
`;

export const DemoParallaxScroll = () => {
    const ctx = useDemoContext();
    const [position, setPosition] = useState<ScrollPosition>(START);

    const setValue = ctx?.setValue;
    useEffect(() => {
        setValue?.('pixelX', position.pixel.x.toFixed(2));
        setValue?.('pixelY', position.pixel.y.toFixed(2));
        setValue?.('normX', position.norm.x.toFixed(2));
        setValue?.('normY', position.norm.y.toFixed(2));
    }, [position, setValue]);

    const { norm } = position;

    return (
        <Styling>
            <svg
                width="100%"
                viewBox="0 0 150 100"
            >
                <path d="M0,50l148,0" />
                <path d="M75,0l0,98" />
                <path d="M143.362,45.362l4.638,4.638l-4.638,4.638" />
                <path d="M79.638,93.362l-4.638,4.638l-4.638,-4.638" />
                <line
                    className="bold"
                    x1="75"
                    y1="50"
                    x2={norm.x * 75 + 75}
                    y2={norm.y * 50 + 50}
                    stroke="black"
                />
                <circle
                    cx={norm.x * 75 + 75}
                    cy={norm.y * 50 + 50}
                    r="2"
                />
            </svg>
            <ScrollLayer onChange={setPosition} />
        </Styling>
    );
};
