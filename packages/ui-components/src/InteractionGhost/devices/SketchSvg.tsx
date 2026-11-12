import { styled } from '@linaria/react';

import type { ReactNode } from 'react';

const Svg = styled.svg`
    display: block;
    /* matches the two rows of the control bar; the width follows from the aspect ratio set per box */
    height: 3.5rem;
    width: auto;
    color: inherit;
    transition: opacity 0.3s ease;

    /* the wide landscape sketches would push the buttons into two lines on a phone, so they get smaller there */
    @media (max-width: 480px) {
        &[data-landscape='true'] {
            height: 2rem;
        }
    }

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

/** Landscape box for pad and mouse; the portrait phones use the middle slice of it, so they do not claim free width. */
const LANDSCAPE = { viewBox: '0 0 88 52', aspectRatio: '88 / 52' };
const PORTRAIT = { viewBox: '24 0 40 52', aspectRatio: '40 / 52' };

export const SketchSvg = ({
    dimmed,
    portrait = false,
    children,
}: {
    dimmed: boolean;
    portrait?: boolean;
    children: ReactNode;
}) => {
    const box = portrait ? PORTRAIT : LANDSCAPE;

    return (
        <Svg
            viewBox={box.viewBox}
            data-landscape={!portrait}
            aria-hidden="true"
            focusable="false"
            style={{ opacity: dimmed ? 0.35 : 1, aspectRatio: box.aspectRatio }}
        >
            {children}
        </Svg>
    );
};

/** Ripple radius/opacity from the age (ms) of the last press; hidden once finished. */
export const ripple = (age: number, duration: number, growth: number, from = 2) => {
    const k = Math.min(1, age / duration);

    return { r: from + k * growth, opacity: k < 1 ? 0.8 * (1 - k) : 0 };
};
