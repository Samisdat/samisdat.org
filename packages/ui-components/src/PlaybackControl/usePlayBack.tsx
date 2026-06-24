import { useState } from "react";

export const usePlayback = ({ initialSpeed = 1 } = {}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(initialSpeed);

  return { isPlaying, speed, toggle: () => setIsPlaying((p) => !p), setSpeed };
};
