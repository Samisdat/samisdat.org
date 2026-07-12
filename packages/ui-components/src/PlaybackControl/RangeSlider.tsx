import { styled } from "@linaria/react";
import { ComponentProps } from "react";

const Styling = styled.input`
  appearance: none;
  background: transparent;
  height: 10px;
  margin: 0;
  cursor: pointer;

  /* ---- Track ---- */
  &::-webkit-slider-runnable-track {
    height: 2px;
    background: var(--color-background);
    border-radius: 1px;
  }

  &::-moz-range-track {
    height: 2px;
    background: var(--color-background);
    border-radius: 1px;
  }

  /* ---- Thumb ---- */
  &::-webkit-slider-thumb {
    appearance: none;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--color-background);
    margin-top: -4px;
  }

  &::-moz-range-thumb {
    width: 10px;
    height: 10px;
    border: none;
    border-radius: 50%;
    background: var(--color-background);
  }

  &:focus-visible::-webkit-slider-thumb {
    outline: 2px solid var(--color-background);
    outline-offset: 2px;
  }

  &:focus-visible::-moz-range-thumb {
    outline: 2px solid var(--color-background);
    outline-offset: 2px;
  }
`;

/**
 * Themed range slider matching the monospace aesthetic of PlaybackControl.
 */
export const RangeSlider = (
  props: Omit<ComponentProps<"input">, "type">,
) => <Styling {...props} type="range" />;
