import { styled } from "@linaria/react";

import { ChangeEvent, MouseEvent } from "react";
import { LotOfHassleForSmallFx } from "./LotOfHassleForSmallFx";

const Icon = styled.span`
  display: inline-block;
  width: 1ch;
  text-align: center;
`;

const PlayPauseButton = styled.button`
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

  background-color: transparent;
`;

const Styling = styled.div`
  border: 1px solid var(--color-background-muted);
  background-color: var(--color-background-secondary);
  padding: 1rem;
  font-family: var(--font-code);
  font-weight: bold;
  background-color: var(--color-yellow);
  color: var(--color-background);
`;

const Notice = styled.div`
  margin-top: 0.5rem;
  font-size: 0.85em;
  opacity: 0.8;
`;

export interface PlaybackControlProps {
  isPlaying: boolean;
  speed: number;
  speedMin?: number;
  speedMax?: number;
  speedStep?: number;
  notice?: string;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
}

export const PlaybackControl = ({
  isPlaying,
  speed,
  speedMin = 1,
  speedMax = 100,
  speedStep = 1,
  notice,
  onPlay,
  onPause,
  onReset,
  onSpeedChange,
}: PlaybackControlProps) => {
  const handleSpeedChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSpeedChange(Number(e.target.value));
  };

  const handleSpeedIncrement = (e: MouseEvent<HTMLButtonElement>) => {
    const direction = e.currentTarget.value;
    const delta = direction === "increment" ? speedStep : -speedStep;
    onSpeedChange(Math.min(speedMax, Math.max(speedMin, speed + delta)));
  };

  return (
    <Styling>
      {isPlaying ? (
        <PlayPauseButton type="button" onClick={onPause}>
          [ <Icon>⏸</Icon> Pause ]
        </PlayPauseButton>
      ) : (
        <PlayPauseButton type="button" onClick={onPlay}>
          [ <Icon>▶</Icon> Play&nbsp; ]
        </PlayPauseButton>
      )}
      <PlayPauseButton type="button" onClick={onReset}>
        [ ↺ Reset ]
      </PlayPauseButton>
      <PlayPauseButton
        type="button"
        value="decrement"
        onClick={handleSpeedIncrement}
      >
        [ - ]
      </PlayPauseButton>
      [
      <LotOfHassleForSmallFx
        aria-label="Speed"
        onChange={handleSpeedChange}
        step={speedStep}
        min={speedMin}
        max={speedMax}
        value={speed}
      />
      ]
      <PlayPauseButton
        type="button"
        value="increment"
        onClick={handleSpeedIncrement}
      >
        [ + ]
      </PlayPauseButton>
      Speed ({speed}x)
      {notice && <Notice>{notice}</Notice>}
    </Styling>
  );
};
