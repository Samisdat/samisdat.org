"use client";

import { styled } from "@linaria/react";
type ColorTheme = "light" | "dark";

const Pill = styled.div`
  border: 1px solid red;
  border-radius: 99px;
  padding: 8px 16px;
  display: flex;
  gap: 8px;
`;

export const ThemeSwitcher = ({ theme = "dark", setTheme }) => {
  return (
    <>
      <Pill>
        <button>🌙</button>
        <button>☀️</button>
      </Pill>
    </>
  );
};
