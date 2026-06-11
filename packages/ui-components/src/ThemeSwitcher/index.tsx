"use client";

import { faMoon } from "@fortawesome/free-regular-svg-icons";
import { faSun } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { styled } from "@linaria/react";
type ColorTheme = "light" | "dark";

const Pill = styled.div`
  border: 1px solid red;
  border-radius: 99px;
`;

export const ThemeSwitcher = ({ theme = "dark", setTheme }) => {
  return (
    <>
      <Pill>
        <FontAwesomeIcon icon={faMoon} />
        <FontAwesomeIcon icon={faSun} />
      </Pill>
    </>
  );
};
