"use client";

import { styled } from "@linaria/react";
import { DemoAnimation } from "@samisdat/ui-components/DemoAnimation";
import { useEffect, useRef, useState } from "react";

const DiscStyling = styled.svg`
  circle.white {
    fill: var(--color-ivory-bright);
  }

  circle.black {
    fill: var(--color-aubergine-deep);
  }
`;

const DiscSvg = () => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) {
      return;
    }

    const svgNs = "http://www.w3.org/2000/svg";
    const count = 10;
    const startRadius = 100;

    let x = 100;

    for (let i = 0; i < count; i++) {
      const circle = document.createElementNS(svgNs, "circle");

      circle.setAttribute("cx", `${x}`);
      circle.setAttribute("cy", "100");
      circle.setAttribute("r", `${startRadius - i * 10}`);
      circle.setAttribute("class", i % 2 === 0 ? "black" : "white");
      svg.appendChild(circle);

      if (i <= 5) {
        x += 10;
      } else {
        x -= 10;
      }
    }

    return () => {
      svg.replaceChildren();
    };
  }, []);

  return <DiscStyling ref={ref} viewBox="0 0 200 200"></DiscStyling>;
};

export const DemoAnimationsDisc = () => {
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
      <DiscSvg />
    </DemoAnimation>
  );
};
