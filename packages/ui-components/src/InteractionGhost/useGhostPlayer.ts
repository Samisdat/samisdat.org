import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { evaluate, totalDuration } from './timeline';

import type { Frame, Script } from './script';

export type GhostPlayerOptions = {
    playing: boolean;
    /** time scale, 2 = twice as fast */
    speed?: number;
    /** wrap around at the end instead of finishing; onDone does not fire while looping */
    loop?: boolean;
    onDone?: () => void;
};

export type GhostPlayer = Frame & {
    /** script time in seconds */
    position: number;
    /** script length in seconds */
    duration: number;
    /** jump to script time (seconds, clamped); works while paused and updates the frame */
    seek: (tSeconds: number) => void;
    /** jump back to the start and play again (if playing) */
    restart: () => void;
};

type State = { frame: Frame; ms: number };

export const useGhostPlayer = (
    script: Script,
    { playing, speed = 1, loop = false, onDone }: GhostPlayerOptions
): GhostPlayer => {
    const [state, setState] = useState<State>(() => ({ frame: evaluate(script, 0), ms: 0 }));
    const [run, setRun] = useState(0);
    const elapsed = useRef(0);
    const done = useRef(false);
    const scriptRef = useRef(script);
    const speedRef = useRef(speed);
    const loopRef = useRef(loop);
    const onDoneRef = useRef(onDone);
    const total = useMemo(() => totalDuration(script), [script]);

    useEffect(() => {
        speedRef.current = speed;
        loopRef.current = loop;
        onDoneRef.current = onDone;
    });

    useEffect(() => {
        if (scriptRef.current !== script) {
            scriptRef.current = script;
            elapsed.current = 0;
            done.current = false;
        }
        if (!playing || done.current) {
            return;
        }
        let raf = 0;
        let last: number | undefined;

        const tick = (now: number) => {
            elapsed.current += (now - (last ?? now)) * speedRef.current;
            last = now;
            if (loopRef.current && total > 0 && elapsed.current >= total) {
                elapsed.current %= total;
            }
            setState({ frame: evaluate(script, elapsed.current), ms: Math.min(elapsed.current, total) });
            if (elapsed.current >= total) {
                done.current = true;
                onDoneRef.current?.();
                return;
            }
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(raf);
    }, [playing, script, total, run]);

    const seek = useCallback(
        (tSeconds: number) => {
            const ms = Math.min(total, Math.max(0, tSeconds * 1000));
            elapsed.current = ms;
            const wasDone = done.current;
            done.current = false;
            setState({ frame: evaluate(script, ms), ms });
            if (wasDone) {
                setRun(r => r + 1);
            }
        },
        [script, total]
    );

    const restart = useCallback(() => {
        elapsed.current = 0;
        done.current = false;
        setState({ frame: evaluate(script, 0), ms: 0 });
        setRun(r => r + 1);
    }, [script]);

    return { ...state.frame, position: state.ms / 1000, duration: total / 1000, seek, restart };
};
