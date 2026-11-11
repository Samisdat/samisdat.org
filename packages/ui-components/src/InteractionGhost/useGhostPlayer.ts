import { useCallback, useEffect, useRef, useState } from 'react';

import { evaluate, totalDuration } from './timeline';

import type { Frame, Script } from './script';

export type GhostPlayerOptions = {
    playing: boolean;
    /** time scale, 2 = twice as fast */
    speed?: number;
    onDone?: () => void;
};

export type GhostPlayer = Frame & {
    /** jump back to the start and play again (if playing) */
    restart: () => void;
};

export const useGhostPlayer = (script: Script, { playing, speed = 1, onDone }: GhostPlayerOptions): GhostPlayer => {
    const [frame, setFrame] = useState<Frame>(() => evaluate(script, 0));
    const [run, setRun] = useState(0);
    const elapsed = useRef(0);
    const done = useRef(false);
    const scriptRef = useRef(script);
    const speedRef = useRef(speed);
    const onDoneRef = useRef(onDone);

    useEffect(() => {
        speedRef.current = speed;
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
        const total = totalDuration(script);
        let raf = 0;
        let last: number | undefined;

        const tick = (now: number) => {
            elapsed.current += (now - (last ?? now)) * speedRef.current;
            last = now;
            setFrame(evaluate(script, elapsed.current));
            if (elapsed.current >= total) {
                done.current = true;
                onDoneRef.current?.();
                return;
            }
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(raf);
    }, [playing, script, run]);

    const restart = useCallback(() => {
        elapsed.current = 0;
        done.current = false;
        setFrame(evaluate(script, 0));
        setRun(r => r + 1);
    }, [script]);

    return { ...frame, restart };
};
