import { KeyboardEvent, PointerEvent, useState } from 'react';

import { useTal } from '@/lib/TalContext';
import { factorAt, SPEED_STEPS } from '@/lib/timeFactor';

export const RADIUS = 60;
const START_ANGLE = 135;
const SWEEP = 270;

export const pointAt = (step: number) => {
    const angle = ((START_ANGLE + (SWEEP * step) / SPEED_STEPS) * Math.PI) / 180;

    return { x: Math.cos(angle) * RADIUS, y: Math.sin(angle) * RADIUS };
};

export const arcTo = (step: number): string => {
    if (0 === step) {
        return '';
    }

    const start = pointAt(0);
    const end = pointAt(step);
    const large = (SWEEP * step) / SPEED_STEPS > 180 ? 1 : 0;

    return `M${start.x} ${start.y}A${RADIUS} ${RADIUS} 0 ${large} 1 ${end.x} ${end.y}`;
};

const KEY_STEPS: Record<string, number> = {
    ArrowRight: 1,
    ArrowUp: 1,
    ArrowLeft: -1,
    ArrowDown: -1,
    PageUp: 10,
    PageDown: -10,
};

/** Position on the ring (0 = normal time) and the pointer and keyboard handlers that move it. */
export const useSpeedRing = (cx: number, cy: number) => {
    const { setTimeFactor } = useTal();
    const [step, setStep] = useState(0);
    const [dragging, setDragging] = useState(false);

    const choose = (next: number) => {
        const clamped = Math.max(0, Math.min(SPEED_STEPS, Math.round(next)));

        setStep(clamped);
        setTimeFactor(factorAt(clamped));
    };

    const chooseByPointer = (event: PointerEvent<SVGGElement>) => {
        const svg = event.currentTarget.ownerSVGElement;
        const matrix = svg?.getScreenCTM();

        if (!svg || !matrix) {
            return;
        }

        const point = svg.createSVGPoint();
        point.x = event.clientX;
        point.y = event.clientY;
        const local = point.matrixTransform(matrix.inverse());
        const degrees = (Math.atan2(local.y - cy, local.x - cx) * 180) / Math.PI;
        let sweep = (((degrees - START_ANGLE) % 360) + 360) % 360;

        // The gap at the bottom snaps to the nearer end
        if (sweep > SWEEP) {
            sweep = sweep > SWEEP + (360 - SWEEP) / 2 ? 0 : SWEEP;
        }

        choose((sweep / SWEEP) * SPEED_STEPS);
    };

    const onKeyDown = (event: KeyboardEvent<SVGGElement>) => {
        if ('Home' === event.key) {
            choose(0);
        } else if ('End' === event.key) {
            choose(SPEED_STEPS);
        } else if (event.key in KEY_STEPS) {
            choose(step + KEY_STEPS[event.key]);
        } else {
            return;
        }

        event.preventDefault();
    };

    const onPointerDown = (event: PointerEvent<SVGGElement>) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        setDragging(true);
        chooseByPointer(event);
    };

    const onPointerMove = (event: PointerEvent<SVGGElement>) => {
        if (dragging) {
            chooseByPointer(event);
        }
    };

    const stopDragging = () => {
        setDragging(false);
    };

    return { step, onKeyDown, onPointerDown, onPointerMove, onPointerUp: stopDragging, onPointerCancel: stopDragging };
};
