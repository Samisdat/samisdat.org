"use client";

import { styled } from "@linaria/react";
import { DemoAnimation } from "@samisdat/ui-components/DemoAnimation";
import { useEffect, useRef, useState } from "react";

const SvgStyling = styled.svg`
  .shape {
    fill: none;
    stroke-width: 4;
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke: #27a65a;
  }

  .point circle {
    stroke: white;
    stroke-width: 0;
    fill: #27a65a;
  }

  .point text {
    fill: white;
    font-size: 14px;
    font-weight: 800;
    text-anchor: middle;
    dominant-baseline: central;
    pointer-events: none;
  }
`;

const Svg = () => (
  <SvgStyling viewBox="0 0 300 300">
    <path
      className="shape"
      d="
              M 150 35
              C 213.5 35 265 86.5 265 150
              C 265 213.5 213.5 265 150 265
              C 86.5 265 35 213.5 35 150
              C 35 86.5 86.5 35 150 35
              Z
            "
    >
      <animate
        attributeName="d"
        dur="3s"
        repeatCount="indefinite"
        values="
                M 150 35
                C 213.5 35 265 86.5 265 150
                C 265 213.5 213.5 265 150 265
                C 86.5 265 35 213.5 35 150
                C 35 86.5 86.5 35 150 35
                Z;

                M 60 60
                C 60 60 240 60 240 60
                C 240 60 240 240 240 240
                C 240 240 60 240 60 240
                C 60 240 60 60 60 60
                Z;

                M 150 35
                C 213.5 35 265 86.5 265 150
                C 265 213.5 213.5 265 150 265
                C 86.5 265 35 213.5 35 150
                C 35 86.5 86.5 35 150 35
                Z
              "
      />
    </path>

    <g className="point">
      <circle cx="150" cy="35" r="15">
        <animate
          attributeName="cx"
          dur="3s"
          repeatCount="indefinite"
          values="150;60;150"
        />
        <animate
          attributeName="cy"
          dur="3s"
          repeatCount="indefinite"
          values="35;60;35"
        />
      </circle>

      <text x="150" y="35">
        0
        <animate
          attributeName="x"
          dur="3s"
          repeatCount="indefinite"
          values="150;60;150"
        />
        <animate
          attributeName="y"
          dur="3s"
          repeatCount="indefinite"
          values="35;60;35"
        />
      </text>
    </g>

    <g className="point">
      <circle cx="265" cy="150" r="15">
        <animate
          attributeName="cx"
          dur="3s"
          repeatCount="indefinite"
          values="265;240;265"
        />
        <animate
          attributeName="cy"
          dur="3s"
          repeatCount="indefinite"
          values="150;60;150"
        />
      </circle>

      <text x="265" y="150">
        1
        <animate
          attributeName="x"
          dur="3s"
          repeatCount="indefinite"
          values="265;240;265"
        />
        <animate
          attributeName="y"
          dur="3s"
          repeatCount="indefinite"
          values="150;60;150"
        />
      </text>
    </g>

    <g className="point">
      <circle cx="150" cy="265" r="15">
        <animate
          attributeName="cx"
          dur="3s"
          repeatCount="indefinite"
          values="150;240;150"
        />
        <animate
          attributeName="cy"
          dur="3s"
          repeatCount="indefinite"
          values="265;240;265"
        />
      </circle>

      <text x="150" y="265">
        2
        <animate
          attributeName="x"
          dur="3s"
          repeatCount="indefinite"
          values="150;240;150"
        />
        <animate
          attributeName="y"
          dur="3s"
          repeatCount="indefinite"
          values="265;240;265"
        />
      </text>
    </g>

    <g className="point">
      <circle cx="35" cy="150" r="15">
        <animate
          attributeName="cx"
          dur="3s"
          repeatCount="indefinite"
          values="35;60;35"
        />
        <animate
          attributeName="cy"
          dur="3s"
          repeatCount="indefinite"
          values="150;240;150"
        />
      </circle>

      <text x="35" y="150">
        3
        <animate
          attributeName="x"
          dur="3s"
          repeatCount="indefinite"
          values="35;60;35"
        />
        <animate
          attributeName="y"
          dur="3s"
          repeatCount="indefinite"
          values="150;240;150"
        />
      </text>
    </g>
  </SvgStyling>
);

export const DemoAnimationsMorphGood = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [speed, setSpeed] = useState(40);
  const [isPlaying, setIsPlaying] = useState(false);

  const getSvg = () =>
    containerRef.current?.querySelector<SVGSVGElement>("svg") ?? null;

  useEffect(() => {
    const svg = getSvg();
    if (!svg) {
      return;
    }
    svg.pauseAnimations();
    svg.setCurrentTime(0);
  }, []);

  useEffect(() => {
    return;
    containerRef.current
      ?.querySelector("animate")
      ?.setAttribute("dur", `${speed}s`);
  }, [speed]);

  const onSpeedChange = (value: number) => {
    setSpeed(value);
  };

  const onPlay = () => {
    getSvg()?.unpauseAnimations();
    setIsPlaying(true);
  };

  const onPause = () => {
    getSvg()?.pauseAnimations();
    setIsPlaying(false);
  };

  const onReset = () => {
    const svg = getSvg();
    if (svg) {
      svg.pauseAnimations();
      svg.setCurrentTime(0);
    }
    setSpeed(40);
    setIsPlaying(false);
  };

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
      <Svg />
    </DemoAnimation>
  );
};
