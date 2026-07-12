import { css } from "@linaria/core";
import "normalize.css";
import { colorProperties } from "./colorProperties";
import { colorClassNames } from "./colorClassNames";
import { colorVars } from "./colorVars";
import { getDarkTheme, getLightTheme } from "../tokens/themes";

export const globalStyles = css`
  :global() {
    ${colorProperties}
    @property --theme-progress {
      syntax: "<number>";
      inherits: true;
      initial-value: 0;
    }

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
      ${getDarkTheme()}
    }

    @media (prefers-color-scheme: dark) {
      :root:not([data-theme]) {
        ${getDarkTheme()}
      }
    }

    :root[data-theme="light"] {
      ${getLightTheme()}
      animation: to-light linear both;
      animation-timeline: scroll();
      animation-range: calc(var(--header-height))
        calc(var(--header-height) + 50px);
    }

    @media (prefers-color-scheme: light) {
      :root:not([data-theme]) {
        ${getLightTheme()}
        animation: to-light linear both;
        animation-timeline: scroll();
        animation-range: calc(var(--header-height) + 20px)
          calc(var(--header-height) + 50px);
      }
    }

    @keyframes to-light {
      from {
        --theme-progress: 0;
      }

      to {
        --theme-progress: 1;
      }
    }

    .force-theme-dark {
      ${getDarkTheme()}
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
