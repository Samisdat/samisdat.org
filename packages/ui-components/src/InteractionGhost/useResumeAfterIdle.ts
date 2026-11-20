import { useEffect, useRef, type RefObject } from 'react';

const EVENTS = ['pointermove', 'pointerdown', 'pointerup', 'pointercancel', 'pointerleave', 'touchstart', 'touchend', 'wheel'] as const;

type Options = {
    /** attach while the person is in control and a resume is wanted */
    enabled: boolean;
    element: RefObject<HTMLElement | null>;
    idleMs: number;
    /** the input that started the takeover is still held (its pointerdown predates the listeners) */
    initiallyPressed?: boolean;
    onIdle: () => void;
};

/** Calls `onIdle` once no input reached `element` for `idleMs` (never while a pointer is held down). */
export const useResumeAfterIdle = ({ enabled, element, idleMs, initiallyPressed = false, onIdle }: Options) => {
    const onIdleRef = useRef(onIdle);
    useEffect(() => {
        onIdleRef.current = onIdle;
    });

    useEffect(() => {
        const target = element.current;
        if (!enabled || !target) return;
        let pressed = initiallyPressed;
        let timer: ReturnType<typeof setTimeout> | undefined;

        const arm = () => {
            clearTimeout(timer);
            timer = setTimeout(() => (pressed ? arm() : onIdleRef.current()), idleMs);
        };
        const onInput = (event: Event) => {
            if (event.type === 'pointerdown' || event.type === 'touchstart') pressed = true;
            if (['pointerup', 'pointercancel', 'touchend'].includes(event.type)) pressed = false;
            arm();
        };

        arm();
        EVENTS.forEach((type) => target.addEventListener(type, onInput, { passive: true }));
        return () => {
            clearTimeout(timer);
            EVENTS.forEach((type) => target.removeEventListener(type, onInput));
        };
    }, [enabled, element, idleMs, initiallyPressed]);
};
