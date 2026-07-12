import { HTMLAttributes, ReactNode, RefObject, useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@samisdat/tools";
import { PlaybackControl, PlaybackControlProps } from "../PlaybackControl";
import { DemoCanvas } from "../DemoCanvas";

export interface DemoAnimationProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  playbackControl: PlaybackControlProps;
  ref?: RefObject<HTMLDivElement | null>;
}

const REDUCED_MOTION_NOTICE =
  "⚠ Reduced motion aktiv — Autoplay deaktiviert. Drücke Play für manuellen Start.";

export const DemoAnimation = ({
  children,
  playbackControl,
  ref: outerRef,
  ...props
}: DemoAnimationProps) => {
  const innerRef = useRef<HTMLDivElement | null>(null);
  const ref = outerRef ?? innerRef;
  const reducedMotion = usePrefersReducedMotion();

  const playbackControlRef = useRef(playbackControl);
  useEffect(() => {
    playbackControlRef.current = playbackControl;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // When reduced-motion is preferred, don't autoplay on scroll
    if (reducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const { isPlaying, onPlay, onPause } = playbackControlRef.current;

        if (entry.isIntersecting) {
          if (!isPlaying) onPlay();
        } else {
          if (isPlaying) onPause();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <>
      <DemoCanvas ref={ref} {...props}>
        {children}
      </DemoCanvas>
      <PlaybackControl
        {...playbackControl}
        notice={reducedMotion ? REDUCED_MOTION_NOTICE : undefined}
      />
    </>
  );
};
