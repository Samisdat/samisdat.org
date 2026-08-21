"use client";

import { styled } from "@linaria/react";
import { DemoAnimation } from "@samisdat/ui-components/DemoAnimation";
import { useEffect, useRef, useState } from "react";

const SvgRow = styled.div`
  display: flex;
  gap: 0;
  width: 100%;
  & > svg {
    width: 50%;
    flex-shrink: 0;
  }
`;

const BadSvgStyling = styled.svg`
  .shape {
    fill: none;
    stroke-width: 4;
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke: #d94a4a;
  }

  .point circle {
    stroke: white;
    stroke-width: 0;
    fill: #d94a4a;
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

const BadSvg = () => (
  <BadSvgStyling viewBox="0 0 300 300">
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
                C 60 60 240 240 240 240
                C 240 240 240 60 240 60
                C 240 60 60 240 60 240
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

    <Point label={0} cxValues="150;60;150" cyValues="35;60;35" />
    <Point label={1} cxValues="265;240;265" cyValues="150;240;150" />
    <Point label={2} cxValues="150;240;150" cyValues="265;60;265" />
    <Point label={3} cxValues="35;60;35" cyValues="150;240;150" />
  </BadSvgStyling>
);

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

    <Point label={0} cxValues="150;60;150" cyValues="35;60;35" />
    <Point label={1} cxValues="265;240;265" cyValues="150;60;150" />
    <Point label={2} cxValues="150;240;150" cyValues="265;240;265" />
    <Point label={3} cxValues="35;60;35" cyValues="150;240;150" />
  </SvgStyling>
);

export const DemoAnimationsMorphGood = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [speed, setSpeed] = useState(40);
  const [isPlaying, setIsPlaying] = useState(false);

  const getSvgs = () =>
    containerRef.current?.querySelectorAll<SVGSVGElement>("svg") ?? [];

  useEffect(() => {
    const svgs = getSvgs();
    svgs.forEach((svg) => {
      svg.pauseAnimations();
      svg.setCurrentTime(0);
    });
  }, []);

  useEffect(() => {
    return;
    containerRef.current
      ?.querySelectorAll("animate")
      .forEach((el) => el.setAttribute("dur", `${speed}s`));
  }, [speed]);

  const onSpeedChange = (value: number) => {
    setSpeed(value);
  };

  const onPlay = () => {
    getSvgs().forEach((svg) => svg.unpauseAnimations());
    setIsPlaying(true);
  };

  const onPause = () => {
    getSvgs().forEach((svg) => svg.pauseAnimations());
    setIsPlaying(false);
  };

  const onReset = () => {
    getSvgs().forEach((svg) => {
      svg.pauseAnimations();
      svg.setCurrentTime(0);
    });
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
      <SvgRow>
        <Svg />
        <BadSvg />
      </SvgRow>
    </DemoAnimation>
  );
};
