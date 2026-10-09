import { css } from "@linaria/core";
import "normalize.css";
import { breakpoints } from "../tokens/breakpoints";
import { borderWidth, borderRadius } from "../tokens/border";
import { scholionStyles } from "./scholion";
import { getDarkTheme, getThemeMixTokens } from "../tokens/themes";

export const globalStyles = css`
  :global() {
    @property --theme-progress {
      syntax: "<number>";
      inherits: true;
      initial-value: 0;
    }

    @property --theme-light {
      syntax: "<number>";
      inherits: true;
      initial-value: 0;
    }

    :root {
      --border-width-default: ${borderWidth.default};
      --border-radius-none: ${borderRadius.none};
      --typo-body-size: 1rem;
      --typo-h1-size: 3rem;
      --typo-h2-size: 2.75rem;
      --typo-h3-size: 2.25rem;
      --typo-h4-size: 1.75rem;
      --typo-h5-size: 1.25rem;
      --typo-h6-size: 1rem;
      --header-height: calc(100vw * 500 / 1280);
      --navi-height: 3.2rem;
    }

    @media (min-width: ${breakpoints.medium}) {
      :root {
        --navi-height: 4rem;
      }
    }

    /* Both themes share one token set that mixes dark and light by --theme-mix (see tokens/themes.ts).
       --theme-light switches 0/1 with the theme and is transitioned (on html below), --theme-progress
       is driven by scroll. Dark stays dark at any scroll position because --theme-mix is the product. */
    :root {
      ${getThemeMixTokens()}
      --theme-mix: calc(var(--theme-progress) * var(--theme-light));
      animation: to-light linear both;
      animation-timeline: scroll();
      animation-range: calc(var(--header-height))
        calc(var(--header-height) + 50px);
    }

    :root[data-theme="dark"] {
      color-scheme: dark;
      --theme-light: 0;
    }

    @media (prefers-color-scheme: dark) {
      :root:not([data-theme]) {
        color-scheme: dark;
        --theme-light: 0;
      }
    }

    :root[data-theme="light"] {
      color-scheme: light;
      --theme-light: 1;
    }

    @media (prefers-color-scheme: light) {
      :root:not([data-theme]) {
        color-scheme: light;
        --theme-light: 1;
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

    pre {
      margin-block: 0;
      /* Long code lines scroll inside the block instead of widening the page */
      overflow-x: auto;
    }

    p:first-child {
      margin-block-start: 0;
    }

    p:last-child {
      margin-block-end: 0;
    }


    html {
      font-size: 20px;
      background-color: var(--color-surface-default);
      color: var(--color-text-default);
      font-family: var(--font-sans);
      /* The theme switch fades the tokens through --theme-light; no extra color transitions, they would lag behind it */
      transition: --theme-light 450ms ease;
    }

    @media (prefers-reduced-motion: reduce) {
      html {
        transition: none;
      }
    }

    /*
    .hill-before-green-tower,
    .hill4100 {
      fill: var(--color-surface-default);
      transition: fill 100ms ease;
    }
*/
    .storybook-wrapper {
      font-family: var(--font-sans);
    }

    body {
      font-family: var(--font-sans);
      letter-spacing: 0.01em;
      line-height: 1.6;
    }

    ${scholionStyles}
  }
`;
