/** Position inside an element, each axis -1..1, centre is 0. */
export type Norm = { x: number; y: number };

export type NormListener = (norm: Norm) => void;

/** Anything that can drive a demo: pointer, scripted ghost, ... */
export type NormSource = {
    /** Returns the unsubscribe function. */
    subscribe: (listener: NormListener) => () => void;
};

/** Maps client coordinates to norm inside `rect`; `null` for a zero-sized rect. Clamped to -1..1. */
export const pointerToNorm = (
    clientX: number,
    clientY: number,
    rect: Pick<DOMRect, 'left' | 'top' | 'width' | 'height'>
): Norm | null => {
    if (rect.width === 0 || rect.height === 0) return null;

    const relativeX = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const relativeY = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));

    return { x: (relativeX - 0.5) * 2, y: (relativeY - 0.5) * 2 };
};

/** Norm of pointermove / pointerdown on `element`; listeners are attached lazily per subscriber. */
export const pointerSource = (element: HTMLElement): NormSource => ({
    subscribe: (listener) => {
        const handle = (event: PointerEvent) => {
            const norm = pointerToNorm(event.clientX, event.clientY, element.getBoundingClientRect());
            if (norm) listener(norm);
        };

        element.addEventListener('pointermove', handle, { passive: true });
        element.addEventListener('pointerdown', handle, { passive: true });

        return () => {
            element.removeEventListener('pointermove', handle);
            element.removeEventListener('pointerdown', handle);
        };
    },
});
