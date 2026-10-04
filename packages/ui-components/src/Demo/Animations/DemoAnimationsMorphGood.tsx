"use client";

import { styled } from "@linaria/react";
import { DemoAnimation } from "@samisdat/ui-components/DemoAnimation";
import { useCallback, useEffect, useRef, useState } from "react";

const SvgStyling = styled.svg`
  .shape {
    fill: none;
    stroke: currentColor;
    stroke-width: 4;
    stroke-linejoin: round;
    stroke-linecap: round;
  }

  .point circle {
    fill: currentColor;
    stroke: white;
    stroke-width: 0;
  }

  .point text {
    fill: white;
    font-size: 14px;
    font-weight: 800;
    text-anchor: middle;
    dominant-baseline: central;
    pointer-events: none;
  }

  .good {
    color: var(--color-green);
  }

  .bad {
    color: var(--color-red);
  }
`;

const Point = ({
  label,
  cxValues,
  cyValues,
}: {
  label: number;
  cxValues: string;
  cyValues: string;
}) => {
  const cx = cxValues.split(";")[0].trim();
  const cy = cyValues.split(";")[0].trim();

  return (
    <g className="point">
      <circle cx={cx} cy={cy} r={15}>
        <animate
          attributeName="cx"
          dur="3s"
          repeatCount="indefinite"
          values={cxValues}
        />
        <animate
          attributeName="cy"
          dur="3s"
          repeatCount="indefinite"
          values={cyValues}
        />
      </circle>

      <text x={cx} y={cy}>
        {label}
        <animate
          attributeName="x"
          dur="3s"
          repeatCount="indefinite"
          values={cxValues}
        />
        <animate
          attributeName="y"
          dur="3s"
          repeatCount="indefinite"
          values={cyValues}
        />
      </text>
    </g>
  );
};

const circlePath = `
  M 150 35
  C 213.5 35 265 86.5 265 150
  C 265 213.5 213.5 265 150 265
  C 86.5 265 35 213.5 35 150
  C 35 86.5 86.5 35 150 35
  Z
`;

const goodSquarePath = `
  M 60 60
  C 60 60 240 60 240 60
  C 240 60 240 240 240 240
  C 240 240 60 240 60 240
  C 60 240 60 60 60 60
  Z
`;

const badSquarePath = `
  M 60 60
  C 60 60 240 240 240 240
  C 240 240 240 60 240 60
  C 240 60 60 240 60 240
  C 60 240 60 60 60 60
  Z
`;

const MorphShape = ({ morphTo }: { morphTo: string }) => (
  <path className="shape" d={circlePath}>
    <animate
      attributeName="d"
      dur="3s"
      repeatCount="indefinite"
      values={`${circlePath};${morphTo};${circlePath}`}
    />
  </path>
);

export const DemoAnimationsMorphGood = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [speed, setSpeed] = useState(40);
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
      .forEach((el) => el.setAttribute("dur", `${speed}s`));
  }, [getSvg, speed]);

  const onSpeedChange = useCallback((value: number) => {
    setSpeed(value);
  }, []);

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
    setSpeed(40);
    setIsPlaying(false);
  }, [getSvg]);

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
      <SvgStyling viewBox="0 0 600 300">
        <g className="good">
          <MorphShape morphTo={goodSquarePath} />
          <Point label={0} cxValues="150;60;150" cyValues="35;60;35" />
          <Point label={1} cxValues="265;240;265" cyValues="150;60;150" />
          <Point label={2} cxValues="150;240;150" cyValues="265;240;265" />
          <Point label={3} cxValues="35;60;35" cyValues="150;240;150" />
        </g>
        <g className="bad" transform="translate(300, 0)">
          <MorphShape morphTo={badSquarePath} />
          <Point label={0} cxValues="150;60;150" cyValues="35;60;35" />
          <Point label={1} cxValues="265;240;265" cyValues="150;240;150" />
          <Point label={2} cxValues="150;240;150" cyValues="265;60;265" />
          <Point label={3} cxValues="35;60;35" cyValues="150;240;150" />
        </g>
      </SvgStyling>
    </DemoAnimation>
  );
};
