import { DemoAnimation } from "@samisdat/ui-components/DemoAnimation";
import { useEffect, useRef, useState } from "react";
import { SmilMorphHills } from "./Svg";
const BACK_FACTOR = 1.6;

export const DemoSmilMorphHills = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [speed, setSpeed] = useState<number>(10);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const onSpeedChange = (value: number) => {
    setSpeed(value);
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const animates =
      containerRef.current.querySelectorAll<SVGAnimateElement>("animate");
    animates[0]?.setAttribute("dur", `${speed * BACK_FACTOR}s`);
    animates[1]?.setAttribute("dur", `${speed}s`);
  }, [speed]);

  const onPlay = () => {
    setIsPlaying(true);
  };
  const onPause = () => {
    setIsPlaying(false);
  };
  const onReset = () => {
    setIsPlaying(false);
  };

  return (
    <DemoAnimation
      ref={containerRef}
      playbackControl={{
        isPlaying,
        speedMin: 1,
        speedMax: 30,
        speed,
        speedControl: false,
        onSpeedChange,
        onPlay,
        onPause,
        onReset,
      }}
    >
      <SmilMorphHills speed={speed} />
    </DemoAnimation>
  );
};
