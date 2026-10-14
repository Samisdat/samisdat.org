import { useState } from "react";

export const SPEED_MULTIPLIER_PROPS = {
  speedMin: 0.25,
  speedMax: 4,
  speedStep: 0.25,
} as const;

/**
 * Speed is a multiplier of the initial duration: x1 keeps it, x2 halves it,
 * x0.5 doubles it.
 */
export const useSpeedDuration = (baseDuration: number) => {
  const [speed, setSpeed] = useState(1);

  return {
    speed,
    setSpeed,
    resetSpeed: () => setSpeed(1),
    duration: baseDuration / speed,
  };
};

export const formatDuration = (duration: number) =>
  `${Number(duration.toFixed(2))}s`;
