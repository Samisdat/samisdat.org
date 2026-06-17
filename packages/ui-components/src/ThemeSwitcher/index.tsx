"use client";

import { styled } from "@linaria/react";
import { ChangeEvent } from "react";
import { MiniPano } from "./MiniPano";

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

const Fieldset = styled.fieldset`
  border: none;
  margin: 0;
  padding: 0;
  min-inline-size: 0;
`;

const Legend = styled.legend`
  ${screenreaderOnly}
`;
const Label = styled.label`
  span {
    ${screenreaderOnly}
  }
`;

const Input = styled.input`
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
    const checked = e.target.checked;

    onUpdate(checked ? "dark" : "light");
  };
  return (
    <Fieldset>
      <Legend>Farbschema</Legend>
      <Label>
        <span>
          {"dark" === theme
            ? "Dark Mode eingeschaltet"
            : "Light Mode eingeschaltet"}
        </span>
        <Input
          type="checkbox"
          aria-description={"Aktiv: dark"}
          checked={"dark" === theme}
          onChange={onChange}
        />
        <MiniPano />
      </Label>
    </Fieldset>
  );
};
