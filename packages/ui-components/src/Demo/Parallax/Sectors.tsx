'use client';

import { styled } from '@linaria/react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useDemoContext } from '../DemoContext';

const Styling = styled.div`
    aspect-ratio: 15/10;

    & svg {
        border-radius: 0.5rem;
 border: 1px solid var(--color-surface-muted);
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
        fill: var(--color-ink-red);
    }
`;

type Position = { x: number; y: number };
type Coord = {
    pixel: Position;
    relative: Position;
    norm: Position;
};

export const DemoParallaxSectors = () => {
    const ctx = useDemoContext();
    const ref = useRef<HTMLDivElement>(null);

    const [coords, setCoords] = useState<Coord>(() => {
        const start: Position = { x: 0, y: 0 };
        return { pixel: start, relative: start, norm: start };
    });

    const handlePointerMove = useCallback((event: PointerEvent) => {
        const el = ref.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        const pixel: Position = {
            x: Math.max(0, event.clientX - rect.left),
            y: Math.max(0, event.clientY - rect.top),
        };

        const relative: Position = {
            x: Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)),
            y: Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height)),
        };

        const norm = {
            x: (relative.x - 0.5) * 2,
            y: (relative.y - 0.5) * 2,
        };

        setCoords({ pixel, relative, norm });
    }, []);

    useEffect(() => {
        ctx?.setValue('pixelX', coords.pixel.x.toFixed(2));
        ctx?.setValue('pixelY', coords.pixel.y.toFixed(2));
        ctx?.setValue('normX', coords.norm.x.toFixed(2));
        ctx?.setValue('normY', coords.norm.y.toFixed(2));
    }, [coords]);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        el.addEventListener('pointermove', handlePointerMove, { passive: true });
        return () => el.removeEventListener('pointermove', handlePointerMove);
    }, [handlePointerMove]);

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
