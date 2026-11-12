import { usePrefersReducedMotion } from '@samisdat/tools';
import { HTMLAttributes, ReactNode, RefObject, useEffect, useRef } from 'react';

import { DemoCanvas } from '../DemoCanvas';
import { PlaybackControl, PlaybackControlProps } from '../PlaybackControl';

export interface DemoAnimationProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    playbackControl: PlaybackControlProps;
    ref?: RefObject<HTMLDivElement | null>;
    /**
     * Autoplay only the first time the demo becomes visible, pause when it leaves the viewport and never
     * restart automatically. Playing again is up to Play / Reset.
     */
    playOnce?: boolean;
}

const REDUCED_MOTION_NOTICE = '⚠ Reduced motion aktiv — Autoplay deaktiviert. Drücke Play für manuellen Start.';

export const DemoAnimation = ({ children, playbackControl, playOnce = false, ref: outerRef, ...props }: DemoAnimationProps) => {
    const innerRef = useRef<HTMLDivElement | null>(null);
    const ref = outerRef ?? innerRef;
    const reducedMotion = usePrefersReducedMotion();

    const playbackControlRef = useRef(playbackControl);
    useEffect(() => {
        playbackControlRef.current = playbackControl;
    });

    const startedRef = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        // When reduced-motion is preferred, don't autoplay on scroll
        if (reducedMotion) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                const { isPlaying, onPlay, onPause } = playbackControlRef.current;

                if (entry.isIntersecting) {
                    if (playOnce && startedRef.current) return;
                    startedRef.current = true;
                    if (!isPlaying) onPlay();
                } else {
                    if (isPlaying) onPause();
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [reducedMotion, ref, playOnce]);

    return (
        <>
            <DemoCanvas
                ref={ref}
                {...props}
            >
                {children}
            </DemoCanvas>
            <PlaybackControl
                {...playbackControl}
                notice={playbackControl.notice ?? (reducedMotion ? REDUCED_MOTION_NOTICE : undefined)}
            />
        </>
    );
};
