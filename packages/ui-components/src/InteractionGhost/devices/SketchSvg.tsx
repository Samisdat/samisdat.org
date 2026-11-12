import { styled } from '@linaria/react';

import type { ReactNode } from 'react';

const Svg = styled.svg`
    display: block;
    width: 112px;
    height: auto;
    aspect-ratio: 88 / 52;
    color: inherit;
    transition: opacity 0.3s ease;

    .sk {
        fill: none;
        stroke: currentColor;
        stroke-width: 0.8;
        stroke-dasharray: 1.8 1.2;
    }

    .sk-solid {
        fill: none;
        stroke: currentColor;
        stroke-width: 0.8;
    }

    .sk-fill {
        fill: currentColor;
    }

    .sk-text {
        fill: currentColor;
        font: 700 6px var(--font-code);
    }
`;

export const SketchSvg = ({ dimmed, children }: { dimmed: boolean; children: ReactNode }) => (
    <Svg viewBox="0 0 88 52" aria-hidden="true" focusable="false" style={{ opacity: dimmed ? 0.35 : 1 }}>
        {children}
    </Svg>
);

/** Ripple radius/opacity from the age (ms) of the last press; hidden once finished. */
export const ripple = (age: number, duration: number, growth: number, from = 2) => {
    const k = Math.min(1, age / duration);

    return { r: from + k * growth, opacity: k < 1 ? 0.8 * (1 - k) : 0 };
};
