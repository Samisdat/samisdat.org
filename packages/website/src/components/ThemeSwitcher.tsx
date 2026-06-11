'use client';

import { ThemeSwitcher as ThemeSwitcherUi } from '@samisdat/ui-components/ThemeSwitcher';

import { useMediaQuery } from '@samisdat/tools';
import { useEffect, useState } from 'react';

type ColorTheme = 'light' | 'dark';

export const ThemeSwitcher = () => {
    /*
  const prefersLight = useMediaQuery(`(prefers-color-scheme: light)`, false);

console.log(prefersLight)

  const [theme, setTheme] = useState<ColorTheme>(() => {
    if (typeof window === "undefined") return "dark";
    return ((sessionStorage.getItem("theme") as ColorTheme) ?? prefersLight)
      ? "light"
      : "dark";
  });

  useEffect(() => {
    const root = document.documentElement;

    if (prefersLight && "light" === theme) {
      root.removeAttribute("data-theme");
      return;
    } else if (!prefersLight && "dark" === theme) {
      root.removeAttribute("data-theme");
      return;
    } else {
      root.setAttribute("data-theme", theme);
    }

    sessionStorage.setItem("theme", theme);
  }, [theme]);

  */
    return (
        <>
            <ThemeSwitcherUi />
        </>
    );
};
