import { type NormSource, pointerSource, usePrefersReducedMotion } from '@samisdat/tools';
import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react';

import { createComposedSource, RESUME_BLEND_MS, TAKEOVER_BLEND_MS } from './composedSource';
import { createTakeoverDetector, TAKEOVER_DISTANCE } from './takeover';
import { useGhostPlayer } from './useGhostPlayer';
import { useResumeAfterIdle } from './useResumeAfterIdle';
import { useTakeoverListeners } from './useTakeoverListeners';

import type { Frame, Script } from './script';

export type UseInteractionGhostOptions = {
    script: Script;
    playing: boolean;
    speed?: number;
    onDone?: () => void;
    onTakeover?: () => void;
    /** cumulative pointer travel in px that counts as takeover */
    takeoverDistance?: number;
    /** play even though the person prefers reduced motion (explicit Play press) */
    forceMotion?: boolean;
    /**
     * After a takeover, continue the recording from the paused position once no input came for this long
     * (ms); the scene blends back over 0.5 s. Undefined = the person keeps control.
     */
    resumeAfterMs?: number;
    /** wrap around instead of finishing (never calls onDone) */
    loop?: boolean;
    /** the recording continues after a takeover */
    onResume?: () => void;
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
    /** continue the recording after a takeover right away (blends back over 0.5 s) */
    resume: () => void;
    /** script time in seconds */
    position: number;
    /** script length in seconds */
    duration: number;
    /** jump to script time (seconds); drives the scene even while paused, is not a takeover */
    seek: (tSeconds: number) => void;
};

type ActivityInput = { playing: boolean; reducedMotion: boolean; takenOver: boolean; done: boolean; scrubbed: boolean };

/** active: the player runs. holding: the ghost owns the scene (also paused after a seek). */
const deriveActivity = ({ playing, reducedMotion, takenOver, done, scrubbed }: ActivityInput) => {
    const free = !reducedMotion && !takenOver;
    const active = free && playing && !done;

    return { active, holding: free && (active || scrubbed) };
};

export const useInteractionGhost = ({
    script,
    playing,
    speed = 1,
    onDone,
    onTakeover,
    takeoverDistance = TAKEOVER_DISTANCE,
    forceMotion = false,
    resumeAfterMs,
    loop = false,
    onResume,
}: UseInteractionGhostOptions): InteractionGhost => {
    const prefersReducedMotion = usePrefersReducedMotion();
    const reducedMotion = prefersReducedMotion && !forceMotion;
    const containerRef = useRef<HTMLDivElement | null>(null);
    const composed = useMemo(() => createComposedSource(), []);
    const detector = useMemo(() => createTakeoverDetector(takeoverDistance), [takeoverDistance]);
    const [takenOver, setTakenOver] = useState(false);
    const [done, setDone] = useState(false);
    // a seek parks the ghost on the scene even while paused
    const [scrubbed, setScrubbed] = useState(false);
    // the recording was running when the person took over (only then it continues by itself)
    const [resumable, setResumable] = useState(false);
    const [heldAtTakeover, setHeldAtTakeover] = useState(false);
    const callbacks = useRef({ onTakeover, onResume });
    useEffect(() => {
        callbacks.current = { onTakeover, onResume };
    });

    const { active, holding } = deriveActivity({ playing, reducedMotion, takenOver, done, scrubbed });

    const handleDone = useCallback(() => {
        setDone(true);
        setScrubbed(false);
        onDone?.();
    }, [onDone]);

    const player = useGhostPlayer(script, { playing: active, speed, loop, onDone: handleDone });
    const { norm, finger, phase, press, tilt, position, duration } = player;
    const frame: Frame = useMemo(() => ({ norm, finger, phase, press, tilt }), [norm, finger, phase, press, tilt]);

    useEffect(() => {
        if (holding) composed.engage();
        else composed.release();
    }, [holding, composed]);

    useEffect(() => composed.pushGhost(norm), [norm, composed]);

    useEffect(() => () => composed.destroy(), [composed]);

    // the real pointer feeds the source all the time; it only reaches the demo once the ghost let go
    useEffect(() => {
        const element = containerRef.current;
        if (!element) return;
        return pointerSource(element).subscribe(composed.pushPointer);
    }, [composed]);

    const takeover = useCallback((event: Event) => {
        if (!composed.takeover(TAKEOVER_BLEND_MS)) return;
        setResumable(playing);
        setHeldAtTakeover(event.type === 'pointerdown' || event.type === 'touchstart');
        setTakenOver(true);
        setScrubbed(false);
        callbacks.current.onTakeover?.();
    }, [composed, playing]);

    useTakeoverListeners({ enabled: holding, element: containerRef, detector, onTakeover: takeover });

    const resume = useCallback(() => {
        detector.reset();
        composed.resume(RESUME_BLEND_MS);
        setTakenOver(false);
        callbacks.current.onResume?.();
    }, [composed, detector]);

    useResumeAfterIdle({
        enabled: takenOver && resumable && resumeAfterMs !== undefined && !reducedMotion,
        element: containerRef,
        idleMs: resumeAfterMs ?? 0,
        initiallyPressed: heldAtTakeover,
        onIdle: resume,
    });

    const restart = useCallback(() => {
        detector.reset();
        composed.reset();
        if (playing && !reducedMotion) composed.engage();
        setTakenOver(false);
        setScrubbed(false);
        setDone(false);
        player.restart();
    }, [composed, detector, player, playing, reducedMotion]);

    const { seek: seekPlayer } = player;
    const seek = useCallback(
        (tSeconds: number) => {
            setDone(false);
            setScrubbed(true);
            setTakenOver(false);
            seekPlayer(tSeconds);
        },
        [seekPlayer]
    );

    return { containerRef, source: composed.source, frame, reducedMotion, takenOver, restart, resume, position, duration, seek };
};
