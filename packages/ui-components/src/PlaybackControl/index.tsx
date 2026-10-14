import { styled } from "@linaria/react";

import { ChangeEvent, MouseEvent } from "react";
import { RangeSlider } from "./RangeSlider";

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
  border: 1px solid var(--color-border-default);
  padding: 1rem;
  font-family: var(--font-code);
  font-weight: bold;
  background-color: var(--color-ink-gold);

  [data-theme="light"] & {
    background-color: var(--color-ink-rose);
  }

  @media (prefers-color-scheme: light) {
    :root:not([data-theme]) & {
      background-color: var(--color-ink-rose);
    }
  }

  color: var(--color-surface-default);

  /* Wraps the speed group below the buttons once it no longer fits */
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  row-gap: 0.5rem;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;
`;

const SpeedRow = styled(Row)`
  flex: 1 1 22rem;
  min-width: 0;
`;

const SliderWrap = styled.span`
  display: flex;
  align-items: center;
  flex: 1 1 8rem;
  min-width: 8rem;

  & > input {
    flex: 1 1 auto;
    min-width: 0;
  }
`;

const Notice = styled.div`
  flex: 0 0 100%;
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
  speedControl?: boolean;
  resetControl?: boolean;
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
  speedControl = true,
  resetControl: _resetControl = true,
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

  const getSpeedControls = () => {
    if (!speedControl) {
      return null;
    }

    return (
      <SpeedRow>
        <PlayPauseButton
          type="button"
          value="decrement"
          onClick={handleSpeedIncrement}
        >
          [ - ]
        </PlayPauseButton>
        <SliderWrap>
          [
          <RangeSlider
            aria-label="Speed"
            onChange={handleSpeedChange}
            step={speedStep}
            min={speedMin}
            max={speedMax}
            value={speed}
          />
          ]
        </SliderWrap>
        <PlayPauseButton
          type="button"
          value="increment"
          onClick={handleSpeedIncrement}
        >
          [ + ]
        </PlayPauseButton>
        Speed ({speed}x)
      </SpeedRow>
    );
  };

  return (
    <Styling>
      <Row>
        {isPlaying ? (
          <PlayPauseButton type="button" onClick={onPause}>
            [ <Icon>⏸</Icon> Pause ]
          </PlayPauseButton>
        ) : (
          <PlayPauseButton type="button" onClick={onPlay}>
            [ <Icon>▶</Icon> Play ]
          </PlayPauseButton>
        )}
        <PlayPauseButton type="button" onClick={onReset}>
          [ ↺ Reset ]
        </PlayPauseButton>
      </Row>
      {getSpeedControls()}
      {notice && <Notice>{notice}</Notice>}
    </Styling>
  );
};
