import { type NormSource, pointerSource, usePrefersReducedMotion } from '@samisdat/tools';
import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react';

import { createComposedSource, TAKEOVER_BLEND_MS } from './composedSource';
import { createTakeoverDetector, TAKEOVER_DISTANCE } from './takeover';
import { useGhostPlayer } from './useGhostPlayer';

import type { Frame, Script } from './script';

export type UseInteractionGhostOptions = {
    script: Script;
    playing: boolean;
    speed?: number;
    onDone?: () => void;
    onTakeover?: () => void;
    /** cumulative pointer travel in px that counts as takeover */
    takeoverDistance?: number;
};

export type InteractionGhost = {
    /** attach to the element that contains the demo (pointer events are read from it) */
    containerRef: RefObject<HTMLDivElement | null>;
    /** give this to the demo's `source` prop */
    source: NormSource;
    frame: Frame;
    /** reduced motion: nothing plays, show the static path overview */
    reducedMotion: boolean;
    takenOver: boolean;
    /** play again from the start and give the ghost control back */
    restart: () => void;
};

export const useInteractionGhost = ({
    script,
    playing,
    speed = 1,
    onDone,
    onTakeover,
    takeoverDistance = TAKEOVER_DISTANCE,
}: UseInteractionGhostOptions): InteractionGhost => {
    const reducedMotion = usePrefersReducedMotion();
    const containerRef = useRef<HTMLDivElement | null>(null);
    const composed = useMemo(() => createComposedSource(), []);
    const detector = useMemo(() => createTakeoverDetector(takeoverDistance), [takeoverDistance]);
    const [takenOver, setTakenOver] = useState(false);
    const [done, setDone] = useState(false);
    const onTakeoverRef = useRef(onTakeover);
    useEffect(() => {
        onTakeoverRef.current = onTakeover;
    });

    const active = playing && !reducedMotion && !takenOver && !done;

    const handleDone = useCallback(() => {
        setDone(true);
        onDone?.();
    }, [onDone]);

    const player = useGhostPlayer(script, { playing: active, speed, onDone: handleDone });
    const { norm, finger, phase } = player;
    const frame: Frame = useMemo(() => ({ norm, finger, phase }), [norm, finger, phase]);

    useEffect(() => {
        if (active) composed.engage();
        else composed.release();
    }, [active, composed]);

    useEffect(() => composed.pushGhost(norm), [norm, composed]);

    useEffect(() => () => composed.destroy(), [composed]);

    // the real pointer feeds the source all the time; it only reaches the demo once the ghost let go
    useEffect(() => {
        const element = containerRef.current;
        if (!element) return;
        return pointerSource(element).subscribe(composed.pushPointer);
    }, [composed]);

    useEffect(() => {
        const element = containerRef.current;
        if (!element || !active) return;

        const takeover = () => {
            if (!composed.takeover(TAKEOVER_BLEND_MS)) return;
            setTakenOver(true);
            onTakeoverRef.current?.();
        };
        const onMove = (event: PointerEvent) => {
            if (detector.move(event.clientX, event.clientY)) takeover();
        };

        // registered after the pointerSource subscription, so the pointer norm is already known
        element.addEventListener('pointerdown', takeover, { passive: true });
        element.addEventListener('touchstart', takeover, { passive: true });
        element.addEventListener('pointermove', onMove, { passive: true });
        return () => {
            element.removeEventListener('pointerdown', takeover);
            element.removeEventListener('touchstart', takeover);
            element.removeEventListener('pointermove', onMove);
        };
    }, [active, composed, detector]);

    const restart = useCallback(() => {
        detector.reset();
        if (playing && !reducedMotion) composed.engage();
        else composed.reset();
        setTakenOver(false);
        setDone(false);
        player.restart();
    }, [composed, detector, player, playing, reducedMotion]);

    return { containerRef, source: composed.source, frame, reducedMotion, takenOver, restart };
};
