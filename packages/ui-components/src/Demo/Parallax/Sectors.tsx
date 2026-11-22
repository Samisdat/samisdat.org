'use client';

import { styled } from '@linaria/react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { type Norm, type NormSource, pointerSource } from '@samisdat/tools';

import { useDemoContext } from '../DemoContext';

const Styling = styled.div`
    aspect-ratio: 15/10;

    /* vertical swipes keep scrolling the page, horizontal drags go to the demo */
    touch-action: pan-y;

    & svg {
        border-radius: 0.5rem;
        border: 1px solid var(--color-border-default);
        background-color: var(--color-surface-raised);

        &:hover {
            border-color: var(--color-text-subtle);
        }
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

type Position = { x: number; y: number };
type Coord = {
    pixel: Position;
    norm: Norm;
};

type DemoParallaxSectorsProps = {
    /** Drives the demo instead of the pointer on the container. */
    source?: NormSource;
};

export const DemoParallaxSectors = ({ source }: DemoParallaxSectorsProps = {}) => {
    const ctx = useDemoContext();
    const ref = useRef<HTMLDivElement>(null);

    const [coords, setCoords] = useState<Coord>(() => {
        const start: Position = { x: 0, y: 0 };
        return { pixel: start, norm: start };
    });

    const handleNorm = useCallback((norm: Norm) => {
        const rect = ref.current?.getBoundingClientRect();
        const pixel: Position = {
            x: rect ? (norm.x / 2 + 0.5) * rect.width : 0,
            y: rect ? (norm.y / 2 + 0.5) * rect.height : 0,
        };

        setCoords({ pixel, norm });
    }, []);

    const setValue = ctx?.setValue;
    useEffect(() => {
        setValue?.('pixelX', coords.pixel.x.toFixed(2));
        setValue?.('pixelY', coords.pixel.y.toFixed(2));
        setValue?.('normX', coords.norm.x.toFixed(2));
        setValue?.('normY', coords.norm.y.toFixed(2));
    }, [coords, setValue]);

    useEffect(() => {
        if (source) return source.subscribe(handleNorm);

        const el = ref.current;
        if (!el) return;
        return pointerSource(el).subscribe(handleNorm);
    }, [handleNorm, source]);

    return (
        <Styling ref={ref}>
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
                    x2={coords.norm.x * 75 + 75}
                    y2={coords.norm.y * 50 + 50}
                    stroke="black"
                />
                <circle
                    cx={coords.norm.x * 75 + 75}
                    cy={coords.norm.y * 50 + 50}
                    r="2"
                />
            </svg>
        </Styling>
    );
};
