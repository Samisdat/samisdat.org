'use client';

import { styled } from '@linaria/react';
import { usePrefersReducedMotion } from '@samisdat/tools';
import { ReactNode, RefObject, useCallback, useEffect, useRef } from 'react';

import { ScrollLayer, ScrollPosition } from './ScrollLayer';

const Styling = styled.div`
    position: relative;
`;

const clamp = (value: number) => Math.min(1, Math.max(-1, value));

/** -1 while the element enters at the bottom of the viewport, 0 centered, 1 while it leaves at the top. */
const readPageY = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const viewport = window.innerHeight;

    return clamp((rect.top + rect.height / 2 - viewport / 2) / (viewport / 2 + rect.height / 2));
};

const usePageScrollY = (ref: RefObject<HTMLElement | null>, enabled: boolean, reduceMotion: boolean) => {
    useEffect(() => {
        const element = ref.current;
        if (!enabled || !element) {
            return;
        }

        const update = () => element.style.setProperty('--parallax-y', String(reduceMotion ? 0 : readPageY(element)));
        update();

        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);

        return () => {
            window.removeEventListener('scroll', update);
            window.removeEventListener('resize', update);
        };
    }, [ref, enabled, reduceMotion]);
};

type ScrollParallaxProps = {
    children: ReactNode;
    /** `scroller`: an invisible scroll layer drives both axes. `page`: it drives x, the page scroll drives y. */
    vertical?: 'scroller' | 'page';
};

/**
 * Scroll-driven counterpart of `useParallax`: writes the normalized scroll position as
 * `--parallax-x` / `--parallax-y` (-1..1) on a wrapper, so the children's CSS works unchanged.
 */
export const ScrollParallax = ({ children, vertical = 'scroller' }: ScrollParallaxProps) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const reduceMotion = usePrefersReducedMotion();
    const page = vertical === 'page';

    const handleChange = useCallback(
        ({ norm }: ScrollPosition) => {
            ref.current?.style.setProperty('--parallax-x', String(reduceMotion ? 0 : norm.x));
            if (!page) {
                ref.current?.style.setProperty('--parallax-y', String(reduceMotion ? 0 : norm.y));
            }
        },
        [page, reduceMotion]
    );

    usePageScrollY(ref, page, reduceMotion);

    return (
        <Styling ref={ref}>
            {children}
            <ScrollLayer
                onChange={handleChange}
                axis={page ? 'x' : 'both'}
            />
        </Styling>
    );
};
