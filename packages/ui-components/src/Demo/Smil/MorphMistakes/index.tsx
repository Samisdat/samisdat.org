"use client";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { styled } from "@linaria/react";

import { aubergine } from "@samisdat/color-scheme/primitives";
import { DemoAnimation } from "@samisdat/ui-components/DemoAnimation";
import { useSpeedDuration,  SPEED_MULTIPLIER_PROPS } from "../../../PlaybackControl/useSpeedDuration";

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

  .point .ring {
    fill: none;
    stroke: currentColor;
    stroke-width: 3;
  }

  .target {
    fill: none;
    stroke: ${aubergine[950]};
    stroke-width: 3;
    stroke-dasharray: 8 6;
  }

  .good {
    color: var(--color-ink-jade);
  }

  .middle {
    color: var(--color-ink-gold);
  }

  .bad {
    color: var(--color-ink-ruby);
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

  const animations = (xName: string, yName: string) => (
    <>
      <animate
        attributeName={xName}
        dur="3s"
        repeatCount="indefinite"
        values={cxValues}
      />
      <animate
        attributeName={yName}
        dur="3s"
        repeatCount="indefinite"
        values={cyValues}
      />
    </>
  );

  return (
    <g className="point">
      {label === 0 ? (
        <circle className="ring" cx={cx} cy={cy} r={21}>
          {animations("cx", "cy")}
        </circle>
      ) : null}
      <circle cx={cx} cy={cy} r={15}>
        {animations("cx", "cy")}
      </circle>

      <text x={cx} y={cy}>
        {label}
        {animations("x", "y")}
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

// Starts at the opposite corner: every point travels through the center.
const middleSquarePath = `
  M 240 240
  C 240 240 60 240 60 240
  C 60 240 60 60 60 60
  C 60 60 240 60 240 60
  C 240 60 240 240 240 240
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

const Case = ({
  className,
  x,
  morphTo,
  children,
}: {
  className: string;
  x: number;
  morphTo: string;
  children: ReactNode;
}) => (
  <g className={className} transform={`translate(${x}, 0)`}>
    <rect className="target" x={60} y={60} width={180} height={180} />
    <MorphShape morphTo={morphTo} />
    {children}
  </g>
);

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
      <SvgStyling viewBox="0 0 900 300">
        <Case
          className="good"
          x={0}
          morphTo={goodSquarePath}
        >
          <Point label={0} cxValues="150;60;150" cyValues="35;60;35" />
          <Point label={1} cxValues="265;240;265" cyValues="150;60;150" />
          <Point label={2} cxValues="150;240;150" cyValues="265;240;265" />
          <Point label={3} cxValues="35;60;35" cyValues="150;240;150" />
        </Case>
        <Case
          className="middle"
          x={300}
          morphTo={middleSquarePath}
        >
          <Point label={0} cxValues="150;240;150" cyValues="35;240;35" />
          <Point label={1} cxValues="265;60;265" cyValues="150;240;150" />
          <Point label={2} cxValues="150;60;150" cyValues="265;60;265" />
          <Point label={3} cxValues="35;240;35" cyValues="150;60;150" />
        </Case>
        <Case
          className="bad"
          x={600}
          morphTo={badSquarePath}
        >
          <Point label={0} cxValues="150;60;150" cyValues="35;60;35" />
          <Point label={1} cxValues="265;240;265" cyValues="150;240;150" />
          <Point label={2} cxValues="150;240;150" cyValues="265;60;265" />
          <Point label={3} cxValues="35;60;35" cyValues="150;240;150" />
        </Case>
      </SvgStyling>
    </DemoAnimation>
  );
};

