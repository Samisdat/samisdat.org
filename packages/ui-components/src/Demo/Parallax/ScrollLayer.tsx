'use client';

import { styled } from '@linaria/react';
import { useEffect, useRef } from 'react';

// Invisible scroll layer: it only provides the scroll position.
const Scroller = styled.div`
    position: absolute;
    inset: 0;
    overflow: scroll;
    overscroll-behavior-x: contain;
    /* no rubber-band, the page takes over via forwardVerticalOverscroll */
    overscroll-behavior-y: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
        display: none;
    }

    /* horizontal only: vertical swipes scroll the page */
    &[data-axis='x'] {
        overflow-y: hidden;
        overscroll-behavior-y: auto;
    }

    &[data-axis='x'] > div {
        height: 100%;
    }
`;

const Content = styled.div`
    width: 200%;
    height: 150%;
`;

export type Position = { x: number; y: number };
export type ScrollPosition = { pixel: Position; relative: Position; norm: Position };

export const START: ScrollPosition = {
    pixel: { x: 0, y: 0 },
    relative: { x: 0.5, y: 0.5 },
    norm: { x: 0, y: 0 },
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const readScrollPosition = (element: HTMLElement): ScrollPosition => {
    const maxX = element.scrollWidth - element.clientWidth;
    const maxY = element.scrollHeight - element.clientHeight;

    const pixel: Position = {
        x: Math.max(0, element.scrollLeft),
        y: Math.max(0, element.scrollTop),
    };

    const relative: Position = {
        x: maxX > 0 ? clamp01(pixel.x / maxX) : 0.5,
        y: maxY > 0 ? clamp01(pixel.y / maxY) : 0.5,
    };

    // Inverted: scrolling right/down moves the content left/up, like a pointer on the opposite side.
    const norm: Position = {
        x: (0.5 - relative.x) * 2,
        y: (0.5 - relative.y) * 2,
    };

    return { pixel, relative, norm };
};

// Touch scrolling latches onto the inner element for the whole gesture, so the
// page never takes over once the end is reached. Forward the remaining
// vertical movement manually.
const forwardVerticalOverscroll = (element: HTMLElement) => {
    let lastY = 0;

    const onTouchStart = (event: TouchEvent) => {
        lastY = event.touches[0].clientY;
    };

    const onTouchMove = (event: TouchEvent) => {
        const y = event.touches[0].clientY;
        const delta = lastY - y;
        lastY = y;

        const atTop = element.scrollTop <= 0;
        const atBottom = element.scrollTop + element.clientHeight >= element.scrollHeight - 1;

        if ((delta > 0 && atBottom) || (delta < 0 && atTop)) {
            window.scrollBy(0, delta);
        }
    };

    element.addEventListener('touchstart', onTouchStart, { passive: true });
    element.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
        element.removeEventListener('touchstart', onTouchStart);
        element.removeEventListener('touchmove', onTouchMove);
    };
};

type ScrollLayerProps = {
    /** `x` only scrolls horizontally and leaves vertical swipes to the page. */
    axis?: 'both' | 'x';
    /** Called on mount and on every scroll. Must be stable, a new identity re-centers the layer. */
    onChange: (position: ScrollPosition) => void;
};

/** Fills its positioned parent, starts centered and reports the normalized scroll position. */
export const ScrollLayer = ({ onChange, axis = 'both' }: ScrollLayerProps) => {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) {
            return;
        }

        // starts centered, on resize the relative position is kept (also centers once the width is known)
        let relative: Position = { x: 0.5, y: 0.5 };

        const restore = () => {
            element.scrollLeft = relative.x * (element.scrollWidth - element.clientWidth);
            element.scrollTop = relative.y * (element.scrollHeight - element.clientHeight);
        };

        const update = () => {
            const position = readScrollPosition(element);
            relative = position.relative;
            onChange(position);
        };

        restore();
        update();

        element.addEventListener('scroll', update, { passive: true });
        const stopForwarding = axis === 'both' ? forwardVerticalOverscroll(element) : undefined;

        // rotation or layout changes do not fire a scroll event
        const resizeObserver = new ResizeObserver(() => {
            restore();
            update();
        });
        resizeObserver.observe(element);

        return () => {
            element.removeEventListener('scroll', update);
            stopForwarding?.();
            resizeObserver.disconnect();
        };
    }, [axis, onChange]);

    return (
        <Scroller
            ref={ref}
            data-axis={axis}
            aria-hidden="true"
            tabIndex={-1}
        >
            <Content />
        </Scroller>
    );
};
