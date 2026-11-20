/** Cumulative pointer travel (CSS px) that counts as the person taking over. */
export const TAKEOVER_DISTANCE = 6;

export type TakeoverDetector = {
    /** Feed a pointermove position; true once the travelled distance exceeds the threshold. */
    move: (clientX: number, clientY: number) => boolean;
    reset: () => void;
};

/**
 * Sums the distance between consecutive pointermove positions. Events without
 * travel (e.g. synthetic mousemove after scrolling) add nothing.
 * pointerdown / touchstart take over immediately and are handled by the caller.
 */
export const createTakeoverDetector = (distance = TAKEOVER_DISTANCE): TakeoverDetector => {
    let previous: [number, number] | null = null;
    let travelled = 0;

    return {
        move: (clientX, clientY) => {
            if (previous) {
                travelled += Math.hypot(clientX - previous[0], clientY - previous[1]);
            }
            previous = [clientX, clientY];
            return travelled > distance;
        },
        reset: () => {
            previous = null;
            travelled = 0;
        },
    };
};
