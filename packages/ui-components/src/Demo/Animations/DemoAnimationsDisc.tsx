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
    const group = ref.current;
    if (!group) {
      return;
    }

    const svgNs = "http://www.w3.org/2000/svg";
    const count = 20;
    const startRadius = 100;

    const diff = 5;
    let x = 100;
    let className = "black";

    for (let i = 0; i < count; i++) {
      const circle = document.createElementNS(svgNs, "circle");

      circle.setAttribute("cx", `${x}`);
      circle.setAttribute("cy", "100");
      circle.setAttribute("r", `${startRadius - i * diff}`);
      circle.setAttribute("class", className);
      group.appendChild(circle);

      className = "black" === className ? "white" : "black";
      if (i <= 11) {
        x += diff;
      } else {
        x -= diff;
      }
    }
    const circle = document.createElementNS(svgNs, "circle");

    circle.setAttribute("cx", `${x + diff / 2}`);
    circle.setAttribute("cy", "100");
    circle.setAttribute("r", `${diff / 2}`);
    circle.setAttribute("class", className);

    group.appendChild(circle);

    const animate = document.createElementNS(svgNs, "animateTransform");
    animate.setAttribute("attributeName", "transform");
    animate.setAttribute("attributeType", "XML");
    animate.setAttribute("type", "rotate");
    animate.setAttribute("from", "0 100 100");
    animate.setAttribute("to", "360 100 100");
    animate.setAttribute("dur", "3s");
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
