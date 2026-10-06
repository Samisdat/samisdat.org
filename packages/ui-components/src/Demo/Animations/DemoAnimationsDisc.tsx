"use client";

import { styled } from "@linaria/react";
import { aubergine, ivory } from "@samisdat/color-scheme/primitives";
import { DemoAnimation } from "@samisdat/ui-components/DemoAnimation";
import { useEffect, useRef, useState } from "react";

const svgNamespace = "http://www.w3.org/2000/svg";
const initialSpeed = 6;

const DiscStyling = styled.svg`
  circle.white {
    fill: ${ivory[100]};
  }

  circle.black {
    fill: ${aubergine[950]};
  }
`;

const DiscSvg = ({ initialDur }: { initialDur: number }) => {
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
    animate.setAttribute("dur", `${initialDur}s`);
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

const Layout = styled.div`
  display: grid;
  align-items: start;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const CodeColumn = styled.div`
  @media (min-width: 640px) {
    position: sticky;
    top: calc(var(--navi-height, 0px) + 1rem);
  }

  & pre {
    background: var(--color-surface-default);
    margin: 0;
    font-size: 0.8rem;
  }
`;

export const DemoAnimationsDisc = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const codeColRef = useRef<HTMLDivElement | null>(null);
  const durSpanRef = useRef<Element | null>(null);

  const [speed, setSpeed] = useState(initialSpeed);
  const [isPlaying, setIsPlaying] = useState(false);

  const getSvg = () =>
    containerRef.current?.querySelector<SVGSVGElement>("svg") ?? null;

  useEffect(() => {
    const svg = getSvg();
    if (!svg) return;
    svg.pauseAnimations();
    svg.setCurrentTime(0);
  }, []);

  // Cache the span containing the dur value from the static code block.
  // rehype-pretty-code renders each line as a direct <span> child of <code>,
  // without a .line class — so we select code > span.
  useEffect(() => {
    const code = codeColRef.current?.querySelector("code");
    if (!code) return;
    for (const line of code.children) {
      if (!line.textContent?.trim().startsWith("dur=")) continue;
      for (const span of line.querySelectorAll("span")) {
        const t = span.textContent ?? "";
        if (
          !span.children.length &&
          (t === `${initialSpeed}s` || t === `"${initialSpeed}s"`)
        ) {
          durSpanRef.current = span;
          return;
        }
      }
    }
  }, []);

  useEffect(() => {
    containerRef.current
      ?.querySelector("animate, animateTransform")
      ?.setAttribute("dur", `${speed}s`);

    if (durSpanRef.current) {
      const quoted = durSpanRef.current.textContent?.startsWith('"');
      durSpanRef.current.textContent = quoted ? `"${speed}s"` : `${speed}s`;
    }
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
    <Layout>
      <div>
        <DemoAnimation
          ref={containerRef}
          playbackControl={{
            isPlaying,
            speedMin: 1,
            speedMax: 80,
            speedControl: true,
            speed,
            onSpeedChange,
            onPlay,
            onPause,
            onReset,
          }}
        >
          <DiscSvg initialDur={speed} />
        </DemoAnimation>
      </div>
      <CodeColumn ref={codeColRef}>{children}</CodeColumn>
    </Layout>
  );
};
