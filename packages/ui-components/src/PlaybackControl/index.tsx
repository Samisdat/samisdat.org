import { styled } from "@linaria/react";

import { ChangeEvent, FC, HTMLAttributes, useRef, useState } from "react";
import { LotOfHassleForSmallFx } from "./LotOfHassleForSmallFx";

const Icon = styled.span`
  display: inline-block;
  width: 1ch;
  text-align: center;
`;

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

  background-color: transparent;
`;

export const PlayText = () => {
  return (
    <>
      <Icon>▶</Icon> Play&nbsp;&nbsp;
    </>
  );
};

export const PauseText = () => {
  return (
    <>
      <Icon>⏸</Icon> Pause&nbsp;
    </>
  );
};

const Styling = styled.div`
  border: 1px solid var(--color-background-muted);
  background-color: var(--color-background-secondary);
  padding: 1rem;
  font-family: var(--font-code);
  font-weight: bold;
  background-color: var(--color-yellow);
  color: var(--color-background);
`;

interface PlaybackControlProps {
  isPlaying: boolean;
  speed: number;
  speedMin?: number;
  speedMax?: number;
  speedStep?: number;
  onPlayPause: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
}

export const PlaybackControl = ({
  isPlaying,
  speed,
  speedMin = 1,
  speedMax = 100,
  speedStep = 1,
  onPlayPause,
  onReset,
  onSpeedChange,
}: PlaybackControlProps) => {
  const handleSpeedChange = () => (e: ChangeEvent<HTMLInputElement>) => {
    onSpeedChange(Number(e.target.value));
  };

  return (
    <Styling>
      <PlayPause onClick={onPlayPause}>
        [ {isPlaying ? <PauseText /> : <PlayText />}]
      </PlayPause>
      <PlayPause onClick={onReset}>[ ↺ Reset ]</PlayPause>
      <PlayPause>[ - ]</PlayPause>[
      <LotOfHassleForSmallFx
        onChange={handleSpeedChange}
        step={speedStep}
        min={speedMin}
        max={speedMax}
        value={speed}
      />
      ]<PlayPause>[ + ]</PlayPause>
      Speed ({speed}x)
    </Styling>
  );
};
