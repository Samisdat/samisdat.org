"use client";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

import { DemoAnimation } from "@samisdat/ui-components/DemoAnimation";
import { useSpeedDuration,  SPEED_MULTIPLIER_PROPS } from "../../../PlaybackControl/useSpeedDuration";
import { MorphMistakesSvg } from "./Svg";

export const DemoSmilMorphMistakes = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { speed, setSpeed, resetSpeed, duration } = useSpeedDuration(40);
  const [isPlaying, setIsPlaying] = useState(false);

  const getSvg = useCallback(
    () => containerRef.current?.querySelector<SVGSVGElement>("svg") ?? null,
    []
  );

  useEffect(() => {
    const svg = getSvg();
    if (!svg) return;
    svg.pauseAnimations();
    svg.setCurrentTime(0);
  }, [getSvg]);

  useEffect(() => {
    const svg = getSvg();
    if (!svg) return;
    svg.querySelectorAll("animate")
      .forEach((el) => el.setAttribute("dur", `${duration}s`));
  }, [getSvg, duration]);

  const onSpeedChange = setSpeed;

  const onPlay = useCallback(() => {
    getSvg()?.unpauseAnimations();
    setIsPlaying(true);
  }, [getSvg]);

  const onPause = useCallback(() => {
    getSvg()?.pauseAnimations();
    setIsPlaying(false);
  }, [getSvg]);

  const onReset = useCallback(() => {
    const svg = getSvg();
    if (svg) {
      svg.pauseAnimations();
      svg.setCurrentTime(0);
    }
    resetSpeed();
    setIsPlaying(false);
  }, [getSvg, resetSpeed]);

  return (
    <DemoAnimation
      ref={containerRef}
      playbackControl={{
        isPlaying,
        ...SPEED_MULTIPLIER_PROPS,
        speed,
        onSpeedChange,
        onPlay,
        onPause,
        onReset,
      }}
    >
      <MorphMistakesSvg />
   </DemoAnimation>
  );
};

