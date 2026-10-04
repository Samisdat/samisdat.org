"use client";

import { styled } from "@linaria/react";
import { aubergine, ivory } from "@samisdat/color-scheme";
import { DemoAnimation } from "@samisdat/ui-components/DemoAnimation";
import { useEffect, useRef, useState } from "react";

const initialSpeed = 40;

const CrankStyling = styled.svg`
  .plate {
    fill: ${ivory[100]};
  }

  .arm {
    fill: ${aubergine[950]};
  }

  .hub {
    fill: ${aubergine[950]};
  }

  .grip {
    fill: ${aubergine[950]};
  }

  .grip-highlight {
    fill: ${ivory[100]};
  }
`;

const CrankSvg = () => {
  return (
    <CrankStyling viewBox="0 0 200 200">
      <circle cx={100} cy={100} r={80} className="plate"></circle>
      <g>
        <rect x={96} y={30} width={8} height={72} rx={4} className="arm"></rect>
        <circle cx={100} cy={100} r={12} className="hub"></circle>
        <circle cx={100} cy={30} r={16} className="grip"></circle>
        <circle cx={100} cy={30} r={6} className="grip-highlight"></circle>
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 100 100"
          to="360 100 100"
          dur="40s"
          repeatCount="indefinite"
        ></animateTransform>
      </g>
    </CrankStyling>
  );
};

export const DemoAnimationsCrank = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [speed, setSpeed] = useState(initialSpeed);
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
    const duration = 41 - speed;

    containerRef.current
      ?.querySelector("animate, animateTransform")
      ?.setAttribute("dur", `${duration}s`);
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
    setSpeed(initialSpeed);
    setIsPlaying(false);
  };

  return (
    <DemoAnimation
      ref={containerRef}
      playbackControl={{
        isPlaying,
        speedMin: 1,
        speedMax: 40,
        speed,
        onSpeedChange,
        onPlay,
        onPause,
        onReset,
      }}
    >
      <CrankSvg />
    </DemoAnimation>
  );
};
