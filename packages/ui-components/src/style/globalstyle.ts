import { css } from "@linaria/core";
import "normalize.css";
import { colorProperties } from "./colorProperties";
import { colorClassNames } from "./colorClassNames";
import { colorVars } from "./colorVars";
import { darkTheme, lightTheme, toCSS } from "../tokens/themes";

console.log(colorProperties);
console.log(colorClassNames);

export const globalStyles = css`
  :global() {
    ${colorProperties}
    :root {
      ${colorVars}

      --typo-h1-size: 3rem;
      --typo-h2-size: 2.75rem;
      --typo-h3-size: 2.25rem;
      --typo-h4-size: 1.75rem;
      --typo-h5-size: 1.25rem;
      --typo-h6-size: 1rem;

      --header-height: calc(100vw * 500 / 1280);
    }

    :root[data-theme="dark"] {
      ${toCSS(darkTheme)}
    }
    :root[data-theme="light"] {
      ${toCSS(lightTheme)}
    }
    @media (prefers-color-scheme: dark) {
      :root:not([data-theme]) {
        ${toCSS(darkTheme)}
      }
    }
    @media (prefers-color-scheme: light) {
      :root:not([data-theme]) {
        ${toCSS(lightTheme)}/*
        animation-rangeimation: to-light linear both;
        animation-timeline: scroll();
        animation-range: calc(var(--header-height) + 20px)
          calc(var(--header-height) + 50px);
*/
      }
    }
    @keyframes to-light {
      from {
        --primitive-aubergine: oklch(84.97% 0.037 30);
        --primitive-ivory: oklch(22% 0.05 300);
      }
      to {
        --primitive-aubergine: oklch(22% 0.05 300);
        --primitive-ivory: oklch(84.97% 0.037 30);
      }
    }

    /** Pick a css reset */
    figure {
      display: block;
      margin: 0;
    }
    figure pre {
      padding: 1rem;
    }

    html {
      font-size: 20px;
      background-color: var(--color-background);
      color: var(--color-foreground);
      font-family: var(--font-sans);
      transition:
        background-color 100ms ease,
        color 100ms ease;
    }
    /*
    .hill-before-green-tower,
    .hill4100 {
      fill: var(--color-background);
      transition: fill 100ms ease;
    }
*/
    .storybook-wrapper {
      font-family: var(--font-sans);
    }

    body {
      font-family: var(--font-sans);
      letter-spacing: 0.01em;
    }

    div.color {
      width: 100px;
      height: 100px;
      margin: 1rem;
    }

    div.color.background {
      background-color: var(--color-background);
    }
    div.color.foreground {
      background-color: var(--color-foreground);
    }

    ${colorClassNames}
  }
`;
