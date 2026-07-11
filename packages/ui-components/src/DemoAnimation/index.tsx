import { HTMLAttributes, ReactNode, RefObject, useEffect, useRef } from "react";
import { PlaybackControl, PlaybackControlProps } from "../PlaybackControl";
import { DemoCanvas } from "../DemoCanvas";

export interface DemoAnimationProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  playbackControl: PlaybackControlProps;
  ref?: RefObject<HTMLDivElement | null>;
}

export const DemoAnimation = ({
  children,
  playbackControl,
  ref: outerRef,
  ...props
}: DemoAnimationProps) => {
  const innerRef = useRef<HTMLDivElement | null>(null);
  const ref = outerRef ?? innerRef;

  const playbackControlRef = useRef(playbackControl);
  useEffect(() => {
    playbackControlRef.current = playbackControl;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

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
  }, []);

  return (
    <>
      <DemoCanvas ref={ref} {...props}>
        {children}
      </DemoCanvas>
      <PlaybackControl {...playbackControl} />
    </>
  );
};
