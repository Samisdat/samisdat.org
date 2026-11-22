import { type RefObject, useEffect } from 'react';

/** Distance kept between the checked segment and a scroll edge, so it never sits under a fade. */
const EDGE_GAP = 32;

/**
 * Flags which side of a horizontally scrolling row still hides content
 * (`data-fade-start` / `data-fade-end`) and keeps the checked segment in view.
 * Only the row itself scrolls, never the page.
 */
export function useScrollFades(ref: RefObject<HTMLElement | null>, value: string, optionCount: number) {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const update = () => {
            el.dataset.fadeStart = String(el.scrollLeft > 1);
            el.dataset.fadeEnd = String(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
        };

        update();
        el.addEventListener('scroll', update, { passive: true });
        const observer = new ResizeObserver(update);
        observer.observe(el);
        return () => {
            el.removeEventListener('scroll', update);
            observer.disconnect();
        };
    }, [ref, optionCount]);

    useEffect(() => {
        const el = ref.current;
        const checked = el?.querySelector('input:checked')?.parentElement;
        if (!el || !checked) return;

        const row = el.getBoundingClientRect();
        const target = checked.getBoundingClientRect();
        if (target.left < row.left + EDGE_GAP) {
            el.scrollLeft -= row.left + EDGE_GAP - target.left;
        } else if (target.right > row.right - EDGE_GAP) {
            el.scrollLeft += target.right - (row.right - EDGE_GAP);
        }
    }, [ref, value]);
}
