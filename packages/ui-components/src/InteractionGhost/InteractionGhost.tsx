'use client';

import { styled } from '@linaria/react';
import { useEffect, useRef } from 'react';

import { GhostOverlay, type PhaseLabels } from './GhostOverlay';
import { useInteractionGhost, type UseInteractionGhostOptions } from './useInteractionGhost';

import type { NormSource } from '@samisdat/tools';
import type { ReactNode } from 'react';

const Stage = styled.div`
    position: relative;
    /* vertical swipes keep scrolling the page, horizontal drags go to the demo */
    touch-action: pan-y;
`;

const Hint = styled.p`
    margin: 0.5rem 0 0;
    font-size: 0.875rem;
    color: var(--color-text-subtle);
`;

export type InteractionGhostProps = UseInteractionGhostOptions & {
    /** Receives the source to pass to the demo's `source` prop. */
    children: (source: NormSource) => ReactNode;
    /** Fixed, always visible text below the demo (plain paragraph, no live region). */
    hint?: ReactNode;
    /** width / height of the demo, needed so markers are not distorted (default 3/2). */
    aspectRatio?: number;
    /** Text of the aria-hidden Tap / Pan label next to the marker. */
    labels?: PhaseLabels;
    /** Increment to play again from the start and give the ghost control back. */
    restartToken?: number;
};

/**
 * Plays `script` over the demo and hands control to the person as soon as they touch or move the pointer.
 * `<InteractionGhost script={s} playing>{(source) => <Demo source={source} />}</InteractionGhost>`
 */
export const InteractionGhost = ({ children, hint, aspectRatio = 3 / 2, labels, restartToken = 0, ...options }: InteractionGhostProps) => {
    const { containerRef, source, frame, reducedMotion, takenOver, restart } = useInteractionGhost(options);
    const restartRef = useRef(restart);
    const lastToken = useRef(restartToken);
    useEffect(() => {
        restartRef.current = restart;
    });
    useEffect(() => {
        if (lastToken.current === restartToken) return;
        lastToken.current = restartToken;
        restartRef.current();
    }, [restartToken]);

    return (
        <div>
            <Stage ref={containerRef}>
                {children(source)}
                {!takenOver && (
                    <GhostOverlay
                        finger={frame.finger}
                        phase={frame.phase}
                        aspectRatio={aspectRatio}
                        still={reducedMotion ? options.script : undefined}
                        labels={labels}
                    />
                )}
            </Stage>
            {hint && <Hint>{hint}</Hint>}
        </div>
    );
};
