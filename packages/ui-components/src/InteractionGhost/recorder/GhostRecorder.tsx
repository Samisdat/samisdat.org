'use client';

import { styled } from '@linaria/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { GhostOverlay } from '../GhostOverlay';
import { scriptDevice, type Device, type Script } from '../script';
import { useInteractionGhost } from '../useInteractionGhost';

import { recordScript } from './recordScript';
import { RecorderPanel } from './RecorderPanel';
import { RecorderPreview } from './RecorderPreview';
import { scriptToSnippet } from './snippet';
import { useRecorder } from './useRecorder';

import type { NormSource } from '@samisdat/tools';
import type { ReactNode } from 'react';

const Stage = styled.div`
    position: relative;

    /* while recording every gesture belongs to the recorder, otherwise vertical swipes keep scrolling */
    &[data-recording='true'] {
        touch-action: none;
    }

    &[data-recording='false'] {
        touch-action: pan-y;
    }
`;

const MAX_POINTS = 12;
const EMPTY: Script = [];

export type GhostRecorderProps = {
    /** Receives the source to pass to the demo's `source` prop (the container's real pointer). */
    children: (source: NormSource) => ReactNode;
    device?: Extract<Device, 'pad' | 'touch' | 'mouse'>;
    /** width / height of the demo (default 3/2) */
    aspectRatio?: number;
    /** Called whenever the recorded script or its simplification changes. */
    onScript?: (script: Script, snippet: string) => void;
};

/**
 * Authoring tool: records pointer gestures over a demo and turns them into a ghost script.
 * Not meant for readers (dev only).
 */
export const GhostRecorder = ({
    children,
    device: initialDevice = 'pad',
    aspectRatio = 3 / 2,
    onScript,
}: GhostRecorderProps) => {
    const stageRef = useRef<HTMLDivElement | null>(null);
    const [device, setDevice] = useState<Device>(initialDevice);
    const [tolerance, setTolerance] = useState(0.03);
    const [playing, setPlaying] = useState(false);
    const [explicit, setExplicit] = useState(false);

    const recorder = useRecorder(stageRef, device);
    const { recording, events } = recorder;
    const script = useMemo(
        () => (events.length > 0 ? recordScript(events, device, { tolerance, maxPoints: MAX_POINTS }) : EMPTY),
        [events, device, tolerance]
    );
    const snippet = useMemo(() => (script.length > 0 ? scriptToSnippet(script) : ''), [script]);

    const ghost = useInteractionGhost({
        script,
        playing,
        forceMotion: explicit,
        onDone: () => setPlaying(false),
        onTakeover: () => setPlaying(false),
    });
    const { containerRef, restart, takenOver } = ghost;
    const setStage = useCallback(
        (el: HTMLDivElement | null) => {
            containerRef.current = el;
            stageRef.current = el;
        },
        [containerRef]
    );

    const onScriptRef = useRef(onScript);
    useEffect(() => {
        onScriptRef.current = onScript;
    });
    useEffect(() => {
        if (script.length > 0) onScriptRef.current?.(script, snippet);
    }, [script, snippet]);

    const hasScript = script.length > 0;

    const play = () => {
        setExplicit(true);
        restart();
        setPlaying(true);
    };
    const changeDevice = (next: Device) => {
        recorder.clear();
        setDevice(next);
    };

    return (
        <div>
            <Stage
                ref={setStage}
                data-recording={recording}
            >
                {children(ghost.source)}
                {!recording && !playing && hasScript && (
                    <RecorderPreview
                        events={events}
                        script={script}
                        aspectRatio={aspectRatio}
                    />
                )}
                {playing && !takenOver && (
                    <GhostOverlay
                        finger={ghost.frame.finger}
                        phase={ghost.frame.phase}
                        aspectRatio={aspectRatio}
                        kind={scriptDevice(script)}
                    />
                )}
            </Stage>
            <RecorderPanel
                device={device}
                recording={recording}
                playing={playing}
                tolerance={tolerance}
                script={script}
                snippet={snippet}
                onDevice={changeDevice}
                onTolerance={setTolerance}
                onToggle={recording ? recorder.stop : recorder.start}
                onPlay={play}
            />
        </div>
    );
};
