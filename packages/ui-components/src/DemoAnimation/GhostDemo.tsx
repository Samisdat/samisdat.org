'use client';

import { styled } from '@linaria/react';
import { useState, type ReactNode } from 'react';

import { DeviceSketch } from '../InteractionGhost/devices/DeviceSketch';
import { GhostStage, type InteractionGhostProps } from '../InteractionGhost/InteractionGhost';
import { scriptDevice } from '../InteractionGhost/script';
import { marksFromScript } from '../InteractionGhost/timeline';
import { useInteractionGhost } from '../InteractionGhost/useInteractionGhost';

import { DemoAnimation } from './index';

import type { PlaybackControlProps } from '../PlaybackControl';

const Hint = styled.p`
    margin: 0.5rem 0 0;
    font-size: 0.875rem;
    color: var(--color-text-subtle);
`;

export type GhostDemoProps = Pick<InteractionGhostProps, 'script' | 'aspectRatio' | 'labels' | 'children'> & {
    /** Fixed text below the controls (outside the checkerboard canvas). */
    hint?: ReactNode;
    initialSpeed?: number;
    playbackControl?: Pick<PlaybackControlProps, 'speedMin' | 'speedMax' | 'speedStep' | 'extra'>;
    /** Show the speed slider (default false). */
    speedControl?: boolean;
    /** After a takeover the recording continues once no input came for this long (ms). Default: never. */
    resumeAfterMs?: number;
    /** Wrap around at the end instead of finishing. */
    loop?: boolean;
};

const seconds = (ms: number) => String(ms / 1000).replace('.', ',');

const takeoverNotice = (resumeAfterMs?: number) =>
    resumeAfterMs === undefined
        ? 'Du steuerst.'
        : `Du steuerst. Die Aufnahme läuft nach ${seconds(resumeAfterMs)} s Ruhe weiter.`;

/**
 * DemoAnimation (play once) + InteractionGhost. The ghost sits directly around the demo, inside the canvas padding.
 * Play/Pause/Reset/Timeline of the PlaybackControl drive the ghost; done and takeover pause it (unless
 * `resumeAfterMs` lets it continue), Play then starts a new round.
 */
export const GhostDemo = ({
    script,
    aspectRatio,
    labels,
    children,
    hint,
    initialSpeed = 1,
    playbackControl,
    speedControl = false,
    resumeAfterMs,
    loop = false,
}: GhostDemoProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(initialSpeed);
    const [finished, setFinished] = useState(false);
    const [explicit, setExplicit] = useState(false);

    const ghost = useInteractionGhost({
        script,
        playing: isPlaying,
        speed,
        loop,
        resumeAfterMs,
        forceMotion: explicit,
        onDone: () => {
            setFinished(true);
            setIsPlaying(false);
        },
        onTakeover: () => {
            setIsPlaying(false);
            // without resume a takeover ends the round: Play starts a new one
            if (resumeAfterMs === undefined) setFinished(true);
        },
        onResume: () => setIsPlaying(true),
    });
    const { frame, takenOver, position, duration } = ghost;

    const handlePlay = () => {
        // under reduced motion DemoAnimation never autoplays, so any Play here is an explicit wish
        setExplicit(true);
        setIsPlaying(true);
        if (takenOver && resumeAfterMs !== undefined) ghost.resume();
        if (finished) {
            setFinished(false);
            ghost.restart();
        }
    };

    const handleSeek = (to: number) => {
        setExplicit(true);
        setFinished(false);
        ghost.seek(to);
    };

    return (
        <div>
            <DemoAnimation
                playOnce
                playbackControl={{
                    speedMin: 0.25,
                    speedMax: 3,
                    speedStep: 0.25,
                    ...playbackControl,
                    speedControl,
                    isPlaying,
                    speed,
                    onPlay: handlePlay,
                    onPause: () => setIsPlaying(false),
                    onReset: () => {
                        setFinished(false);
                        setExplicit(true);
                        setIsPlaying(true);
                        ghost.restart();
                    },
                    onSpeedChange: setSpeed,
                    device: (
                        <DeviceSketch
                            kind={scriptDevice(script)}
                            frame={frame}
                            dimmed={takenOver}
                        />
                    ),
                    timeline: { position, duration, marks: marksFromScript(script), onSeek: handleSeek },
                    notice: takenOver ? takeoverNotice(resumeAfterMs) : undefined,
                }}
            >
                <GhostStage
                    ghost={ghost}
                    script={script}
                    aspectRatio={aspectRatio}
                    labels={labels}
                >
                    {children}
                </GhostStage>
            </DemoAnimation>
            {hint && <Hint>{hint}</Hint>}
        </div>
    );
};
