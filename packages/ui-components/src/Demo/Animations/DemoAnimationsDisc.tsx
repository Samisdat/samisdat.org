"use client";

import { styled } from "@linaria/react";
import { DemoAnimation } from "@samisdat/ui-components/DemoAnimation";
import { useEffect, useRef, useState } from "react";

const svgNamespace = "http://www.w3.org/2000/svg";
const initialSpeed = 6;

const DiscStyling = styled.svg`
  circle.white {
    fill: var(--color-ivory-bright);
  }

  circle.black {
    fill: var(--color-aubergine-deep);
  }
`;

const DiscSvg = () => {
  const ref = useRef<SVGGElement>(null);

  useEffect(() => {
    const group = ref.current;
    if (!group) {
      return;
    }

    const count = 20;
    const startRadius = 100;
    const diff = 5;

    const createCircle = (cx: number, r: number, className: string) => {
      const circle = document.createElementNS(svgNamespace, "circle");
      circle.setAttribute("cx", `${cx}`);
      circle.setAttribute("cy", "100");
      circle.setAttribute("r", `${r}`);
      circle.setAttribute("class", className);
      return circle;
    };

    let x = 100;
    let className = "black";

    for (let i = 0; i < count; i++) {
      group.appendChild(createCircle(x, startRadius - i * diff, className));

      className = className === "black" ? "white" : "black";
      x += i <= 11 ? diff : -diff;
    }

    group.appendChild(createCircle(x + diff / 2, diff / 2, className));

    const animate = document.createElementNS(svgNamespace, "animateTransform");
    animate.setAttribute("attributeName", "transform");
    animate.setAttribute("type", "rotate");
    animate.setAttribute("from", "0 100 100");
    animate.setAttribute("to", "360 100 100");
    animate.setAttribute("dur", `${initialSpeed}s`);
    animate.setAttribute("repeatCount", "indefinite");
    group.appendChild(animate);

    return () => {
      group.replaceChildren();
    };
  }, []);

  return (
    <DiscStyling viewBox="0 0 200 200">
      <g ref={ref}></g>
    </DiscStyling>
  );
};

export const DemoAnimationsDisc = () => {
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
    containerRef.current
      ?.querySelector("animate, animateTransform")
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
    setSpeed(initialSpeed);
    setIsPlaying(false);
  };

  return (
    <DemoAnimation
      ref={containerRef}
      playbackControl={{
        isPlaying,
        speedMin: 1,
        speedMax: 80,
        speedControl: false,
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
