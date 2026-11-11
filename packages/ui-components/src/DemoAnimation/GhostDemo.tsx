'use client';

import { styled } from '@linaria/react';
import { useState, type ReactNode } from 'react';

import { InteractionGhost, type InteractionGhostProps } from '../InteractionGhost/InteractionGhost';

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
};

/**
 * DemoAnimation (play once) + InteractionGhost. The ghost sits directly around the demo, inside the canvas padding.
 * Play/Pause/Reset/Speed of the PlaybackControl drive the ghost; done and takeover pause it, Play then starts a new round.
 */
export const GhostDemo = ({
    script,
    aspectRatio,
    labels,
    children,
    hint,
    initialSpeed = 1,
    playbackControl,
}: GhostDemoProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(initialSpeed);
    const [finished, setFinished] = useState(false);
    const [explicit, setExplicit] = useState(false);
    const [round, setRound] = useState(0);

    const restart = () => {
        setFinished(false);
        setRound((r) => r + 1);
    };

    const handleStop = () => {
        setFinished(true);
        setIsPlaying(false);
    };

    const handlePlay = () => {
        // under reduced motion DemoAnimation never autoplays, so any Play here is an explicit wish
        setExplicit(true);
        setIsPlaying(true);
        if (finished) restart();
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
                    isPlaying,
                    speed,
                    onPlay: handlePlay,
                    onPause: () => setIsPlaying(false),
                    onReset: () => {
                        restart();
                        setExplicit(true);
                        setIsPlaying(true);
                    },
                    onSpeedChange: setSpeed,
                }}
            >
                <InteractionGhost
                    script={script}
                    aspectRatio={aspectRatio}
                    labels={labels}
                    playing={isPlaying}
                    speed={speed}
                    restartToken={round}
                    forceMotion={explicit}
                    onDone={handleStop}
                    onTakeover={handleStop}
                >
                    {children}
                </InteractionGhost>
            </DemoAnimation>
            {hint && <Hint>{hint}</Hint>}
        </div>
    );
};
