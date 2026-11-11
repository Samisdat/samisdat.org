'use client';

/**
 * Scroll container variant: an invisible scroll layer drives both axes (see ScrollLayer).
 * Kept for mobile (tested on iPhone). Weaknesses and what was done about them:
 *
 * Noticeable on touch devices
 * 1. Scroll trap: vertical swipes first move the invisible content before the page scrolls.
 *    Mitigated: the content is only 150% high, so the dead travel is about a quarter of the demo.
 *    Open ideas:
 *    - Opt in: `pointer-events: none` until the demo is tapped, tap outside releases it.
 *    - `touch-action: pan-x` on the scroller, vertical swipes always scroll the page
 *      (that is the hybrid variant, so x and y can no longer be driven at the same time).
 * 2. Overscroll forwarding only works while the finger is down (touchmove + window.scrollBy).
 *    No momentum on the page after a fling at the edge. Vertical wobble during a horizontal drag
 *    at the vertical edge scrolls the page unintentionally.
 *    Mitigated: `overscroll-behavior-y: none` against the iOS rubber-band (iOS 16+). Side effect:
 *    wheel/trackpad scrolling no longer chains to the page at the edge either.
 *    Open ideas:
 *    - Track the touch velocity and continue with a decaying requestAnimationFrame scrollBy
 *      after touchend when the scroller sits at the edge.
 *    - Dead zone: only forward when the gesture is dominantly vertical (|dy| > |dx|).
 *
 * Edge cases
 * 3. Coarse travel: only 100% horizontally and 50% vertically of the demo size, so the feel
 *    depends on the demo size. Postponed. Ideas: fixed travel in px, gain or easing on the norm.
 * 4. Centered only on mount: if the layer has no width yet (lazy import, hidden), it started at
 *    an edge. Mitigated: the relative position is kept on resize (starts at 0.5, so it centers
 *    as soon as the width is known).
 * 5. Desktop: wheel/trackpad over the demo is captured by the invisible scroller. The pointer
 *    variant makes more sense there. Postponed. Ideas: `@media (hover: hover)` disables the
 *    scroller, or render the scroll variant only for `(pointer: coarse)`.
 */

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
