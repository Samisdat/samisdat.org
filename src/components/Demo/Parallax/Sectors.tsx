'use client';

import { styled } from '@linaria/react';
import { useCallback, useEffect, useRef, useState } from 'react';

const Styling = styled.div`
    max-width: 450px;

    & svg {
        width: 450px;
        height: 300px;
        background: var(--color-soft-ivory);
    }
    & svg path,
    & svg line {
        fill: none;
        stroke: var(--color-aubergine);
        stroke-width: 2px;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-miterlimit: 1.5;
    }
    & svg circle {
        fill: red;
    }
`;

export type ParallaxCoords = { x: number; y: number };

export const DemoParallaxSectors = () => {
    const ref = useRef<HTMLDivElement>(null);

    const [coords, setCoords] = useState({ x: 0, y: 0 });

    const handlePointerMove = useCallback(
        (event: PointerEvent) => {
            const el = ref.current;
            if (!el) {
                return;
            }

            const rect = el.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return;

            const relativeX = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
            const relativeY = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));

            const x = (relativeX - 0.5) * 2;
            const y = (relativeY - 0.5) * 2;

            setCoords({
                x,
                y,
            });
        },
        [ref]
    );

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        el.addEventListener('pointermove', handlePointerMove, { passive: true });
        return () => el.removeEventListener('pointermove', handlePointerMove);
    }, [handlePointerMove, ref]);

    return (
        <Styling ref={ref}>
            <svg
                height="100%"
                viewBox="0 0 150 100"
            >
                <path d="M0,50l148,0" />
                <path d="M75,0l0,98" />
                <path d="M143.362,45.362l4.638,4.638l-4.638,4.638" />
                <path d="M79.638,93.362l-4.638,4.638l-4.638,-4.638" />
                <line
                    x1="75"
                    y1="50"
                    x2={coords.x * 75 + 75}
                    y2={coords.y * 50 + 50}
                    stroke="black"
                />
                <circle
                    cx="75"
                    cy="50"
                    r="2"
                />
                <circle
                    cx={coords.x * 75 + 75}
                    cy={coords.y * 50 + 50}
                    r="2"
                />
            </svg>
        </Styling>
    );
};
