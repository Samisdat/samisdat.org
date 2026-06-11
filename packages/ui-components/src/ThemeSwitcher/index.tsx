"use client";

import { faMoon, faSun } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { styled } from "@linaria/react";
import { ChangeEvent } from "react";

export type ThemeName = "light" | "dark";

export const screenreaderOnly = ` 
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    clip-path: inset(50%);
    white-space: nowrap;
    border: 0;
`;

const Pill = styled.div`
  border: 1px solid red;
  border-radius: 99px;
  padding: 8px 16px;
  display: flex;
  gap: 8px;
`;

const Fieldset = styled.fieldset`
  border: none;
  margin: 0;
  padding: 0;
  min-inline-size: 0;
`;

const ScreenreaderOnly = styled.span`
  ${screenreaderOnly}
`;

const Legend = styled.legend`
  ${screenreaderOnly}
`;
const Label = styled.label`
  cursor: pointer;
  & > svg {
    color: red;
    transition: color 150ms;
  }
  &:has(input:checked) > svg {
    color: green;
  }
  &:has(input:focus-visible) > svg {
    color: yellow;
  }
`;

const HiddenInput = styled.input`
  ${screenreaderOnly}
`;

interface ThemeSwitcherProps {
  onUpdate: (a: ThemeName) => void;
  theme: ThemeName;
}

export const ThemeSwitcher = ({
  theme = "dark",
  onUpdate,
}: ThemeSwitcherProps) => {
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    onUpdate(value as ThemeName);
  };
  return (
    <>
      <Pill>
        <Fieldset>
          <Legend>ThemeSwitcher</Legend>
          <Label>
            <FontAwesomeIcon icon={faSun} aria-hidden={true} />
            <ScreenreaderOnly>Light</ScreenreaderOnly>
            <HiddenInput
              type="radio"
              name="themeSwitcher"
              value="light"
              onChange={onChange}
              checked={"light" === theme}
            />
          </Label>
          <Label>
            <FontAwesomeIcon icon={faMoon} aria-hidden={true} />
            <ScreenreaderOnly>Dark</ScreenreaderOnly>
            <HiddenInput
              type="radio"
              name="themeSwitcher"
              value="dark"
              onChange={onChange}
              checked={"dark" === theme}
            />
          </Label>
        </Fieldset>
      </Pill>
    </>
  );
};
