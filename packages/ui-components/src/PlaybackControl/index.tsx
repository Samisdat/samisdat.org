import { styled } from "@linaria/react";

import { FC, HTMLAttributes, useRef, useState } from "react";
import {
  faBackwardFast,
  faPause,
  faPlay,
  faReply,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const PlayPause = styled.button`
  /* ghost button */
  appearance: none;
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  text-align: inherit;
  cursor: pointer;

  witdh: 90px;
  background-color: transparent;
`;
const SpeedRange = styled.input``;

const Styling = styled.div`
  border: 1px solid var(--color-background-muted);
  background-color: var(--color-background-secondary);
  padding: 1rem;
  font-family: var(--font-code);
  font-weight: bold;
  background-color: var(--color-yellow);
  color: var(--color-background);
`;

export const PlaybackControl: FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
}) => {
  const speedRef = useRef<number>(1);
  const [isPlaying, setIsPlaying] = useState(true);

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleReset = () => {
    setIsPlaying(false);
  };

  return (
    <Styling>
      [
      <PlayPause onClick={handlePlayPause}>
        {isPlaying ? "‖ Pause" : ["▶ Play", "&npsp;"]}
      </PlayPause>
      ]<PlayPause onClick={handlePlayPause}>[ ↺ Reset ]</PlayPause>
      <PlayPause>[ - ]</PlayPause>
      <SpeedRange type="range" min="7" max="100" value="30" />
      <PlayPause>[ + ]</PlayPause>
      Speed (2.0x)
    </Styling>
  );
};
