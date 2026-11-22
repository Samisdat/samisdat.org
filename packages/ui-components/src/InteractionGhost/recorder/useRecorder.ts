import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

import { normFromPointer } from './normFromPointer';

import type { Device } from '../script';
import type { RecordedEvent, RecordedEventType } from './types';

export type Recorder = {
    recording: boolean;
    /** events of the last finished session */
    events: readonly RecordedEvent[];
    start: () => void;
    stop: () => void;
    clear: () => void;
};

/**
 * Collects pointer events of `element` while recording (norm coordinates, performance.now() time).
 * pad / touch: down, moves while pressed, up. mouse: every move plus clicks.
 */
export const useRecorder = (element: RefObject<HTMLElement | null>, device: Device): Recorder => {
    const [recording, setRecording] = useState(false);
    const [events, setEvents] = useState<readonly RecordedEvent[]>([]);
    const buffer = useRef<RecordedEvent[]>([]);

    useEffect(() => {
        const target = element.current;
        if (!recording || !target) return;

        const isMouse = device === 'mouse';
        let pressed = false;
        const push = (type: RecordedEventType, event: PointerEvent | MouseEvent) => {
            const { x, y } = normFromPointer(event.clientX, event.clientY, target.getBoundingClientRect());
            buffer.current.push({ type, t: performance.now(), x, y });
        };

        const onDown = (event: PointerEvent) => {
            if (isMouse) return;
            pressed = true;
            try {
                target.setPointerCapture?.(event.pointerId);
            } catch {
                // synthetic pointers cannot be captured
            }
            push('down', event);
        };
        const onMove = (event: PointerEvent) => {
            if (isMouse || pressed) push('move', event);
        };
        const onUp = (event: PointerEvent) => {
            if (isMouse || !pressed) return;
            pressed = false;
            push('up', event);
        };
        const onClick = (event: MouseEvent) => {
            if (isMouse) push('click', event);
        };

        target.addEventListener('pointerdown', onDown);
        target.addEventListener('pointermove', onMove);
        target.addEventListener('pointerup', onUp);
        target.addEventListener('pointercancel', onUp);
        target.addEventListener('click', onClick);
        return () => {
            target.removeEventListener('pointerdown', onDown);
            target.removeEventListener('pointermove', onMove);
            target.removeEventListener('pointerup', onUp);
            target.removeEventListener('pointercancel', onUp);
            target.removeEventListener('click', onClick);
        };
    }, [recording, device, element]);

    const start = useCallback(() => {
        buffer.current = [];
        setEvents([]);
        setRecording(true);
    }, []);
    const stop = useCallback(() => {
        setEvents(buffer.current);
        setRecording(false);
    }, []);
    const clear = useCallback(() => setEvents([]), []);

    return { recording, events, start, stop, clear };
};
