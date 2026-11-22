import type { ParallaxElement } from '../norm';

type Options = {
    /** Also write `--scroll` (0..1): how far the element has scrolled out of view. */
    scroll: boolean;
    reduceMotion: boolean;
};

export type ParallaxWriter = {
    /** Takes a new position; it is written in the next frame. */
    set: (x: number, y: number) => void;
    /** Asks for a rewrite in the next frame, e.g. after the page scrolled or resized. */
    refresh: () => void;
    dispose: () => void;
};

/**
 * Writes `--parallax-x` / `--parallax-y` (and `--scroll`) on an element, one frame after something changed.
 * Several changes within a frame write once, and while nothing changes no frame is requested at all.
 */
export const createParallaxWriter = (el: ParallaxElement, { scroll, reduceMotion }: Options): ParallaxWriter => {
    let x = 0;
    let y = 0;
    let frame: number | null = null;

    const flush = () => {
        frame = null;

        el.style.setProperty('--parallax-x', String(x));
        el.style.setProperty('--parallax-y', String(y));

        if (!scroll) {
            return;
        }

        const { y: top, height } = el.getBoundingClientRect();

        el.style.setProperty('--scroll', String(reduceMotion ? 0 : Math.min(Math.abs(top) / height, 1)));
    };

    const refresh = () => {
        if (frame === null) {
            frame = requestAnimationFrame(flush);
        }
    };

    // the first write gives the properties a defined start value
    refresh();

    return {
        set: (nextX, nextY) => {
            if (nextX === x && nextY === y) {
                return;
            }

            x = nextX;
            y = nextY;
            refresh();
        },
        refresh,
        dispose: () => {
            if (frame !== null) {
                cancelAnimationFrame(frame);
                frame = null;
            }
        },
    };
};
