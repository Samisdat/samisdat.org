"use client";

import { styled } from "@linaria/react";
import { DemoAnimation } from "@samisdat/ui-components/DemoAnimation";
import { useCallback, useEffect, useRef, useState } from "react";

const SvgStyling = styled.svg`
  fill: none;
  stroke-width: 8;
  stroke-linejoin: round;
  stroke-linecap: round;

  color: var(--color-green);

  path {
    stroke: currentColor;
  }
`;

export const DemoAnimationsMorphHeart = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [speed, setSpeed] = useState(40);
  const [isPlaying, setIsPlaying] = useState(false);

  const getSvg = () =>
    containerRef.current?.querySelector<SVGSVGElement>("svg") ?? null;

  useEffect(() => {
    const svg = getSvg();
    if (!svg) return;
    svg.pauseAnimations();
    svg.setCurrentTime(0);
  }, []);

  useEffect(() => {
    const svg = getSvg();
    if (!svg) return;
    svg
      .querySelectorAll("animate")
      .forEach((el) => el.setAttribute("dur", `${speed}s`));
  }, [speed]);

  const onSpeedChange = useCallback((value: number) => {
    setSpeed(value);
  }, []);

  const onPlay = useCallback(() => {
    getSvg()?.unpauseAnimations();
    setIsPlaying(true);
  }, []);

  const onPause = useCallback(() => {
    getSvg()?.pauseAnimations();
    setIsPlaying(false);
  }, []);

  const onReset = useCallback(() => {
    const svg = getSvg();
    if (svg) {
      svg.pauseAnimations();
      svg.setCurrentTime(0);
    }
    setSpeed(40);
    setIsPlaying(false);
  }, []);

  return (
    <DemoAnimation
      ref={containerRef}
      playbackControl={{
        isPlaying,
        speedMin: 1,
        speedMax: 80,
        speed,
        onSpeedChange,
        onPlay,
        onPause,
        onReset,
      }}
    >
      <SvgStyling viewBox="0 80 600 240">
        <path d="M300,300 l-100,-100 a50,50 90 0,1 100,-75 a50,50 90 0,1 100,75 z">
          <animate
            attributeName="d"
            values="M300,300 l-100,-100 a50,50 90 0,1 100,-75 a50,50 90 0,1 100,75 z;
               M300,300 l-100,-100 a50,50 90 0,1 95,-75 a60,60 90 0,1 120,75 z;
               M300,300 l-100,-100 a50,50 90 0,1 100,-75 a50,50 90 0,1 100,75 z;
               M300,300 l-100,-100 a50,50 90 0,1 100,-75 a50,50 90 0,1 100,75 z;"
            dur="1s"
            repeatCount="indefinite"
          ></animate>
        </path>
      </SvgStyling>
    </DemoAnimation>
  );
};
