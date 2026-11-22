import { useEffect, type RefObject } from 'react';

import type { TakeoverDetector } from './takeover';

type Options = {
    /** attach while the ghost drives the scene */
    enabled: boolean;
    element: RefObject<HTMLElement | null>;
    detector: TakeoverDetector;
    onTakeover: (event: Event) => void;
};

/** pointerdown / touchstart take over at once, pointermove once it travelled far enough. */
export const useTakeoverListeners = ({ enabled, element, detector, onTakeover }: Options) => {
    useEffect(() => {
        const target = element.current;
        if (!target || !enabled) return;

        const onMove = (event: PointerEvent) => {
            if (detector.move(event.clientX, event.clientY)) onTakeover(event);
        };

        // registered after the pointerSource subscription, so the pointer norm is already known
        target.addEventListener('pointerdown', onTakeover, { passive: true });
        target.addEventListener('touchstart', onTakeover, { passive: true });
        target.addEventListener('pointermove', onMove, { passive: true });
        return () => {
            target.removeEventListener('pointerdown', onTakeover);
            target.removeEventListener('touchstart', onTakeover);
            target.removeEventListener('pointermove', onMove);
        };
    }, [enabled, element, detector, onTakeover]);
};
