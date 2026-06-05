import { css } from "@linaria/core";
import "normalize.css";
import { colorProperties } from "./colorProperties";
import { colorClassNames } from "./colorClassNames";
import { colorVars } from "./colorVars";

console.log(colorProperties);
console.log(colorClassNames);

export const globalStyles = css`
  :global() {
    ${colorProperties}
    :root {
      ${colorVars}
      /* legacy, rm after refactoring*/
      --color-soft-ivory: var(--color-ivory-soft);
      --color-deep-aubergine: var(--color-aubergine-deep);

      color-scheme: dark;

      /* Surfaces */
      --bg: var(--color-aubergine);
      --bg-elevated: var(--color-aubergine-soft);
      --bg-elevated-2: var(--color-aubergine-soft-2);
      --bg-sunken: var(--color-aubergine-deep);

      /* text */
      --fg: var(--color-ivory);
      --fg-muted: var(--color-aubergine-faded);
      --fg-subtle: var(--color-aubergine-muted);

      /* borders */
      --border: var(--color-aubergine-border);
      --border-subtle: color-mix(
        in oklab,
        var(--color-aubergine-border) 50%,
        transparent
      );
      --border-strong: var(--color-aubergine-muted);

      --background-color: var(--bg);
      --foreground-color: var(--color-ivory);

      --typo-h1-size: 3rem;
      --typo-h2-size: 2.75rem;
      --typo-h3-size: 2.25rem;
      --typo-h4-size: 1.75rem;
      --typo-h5-size: 1.25rem;
      --typo-h6-size: 1rem;
    }

    :root[data-theme="dark"] {
      color-scheme: dark;

      --background-color: var(--color-aubergine);
      --foreground-color: var(--color-ivory);
    }

    :root[data-theme="light"] {
      color-scheme: light;

      --background-color: var(--color-ivory);
      --foreground-color: var(--color-aubergine);
    }

    @media (prefers-color-scheme: light) {
      :root:not([data-theme]) {
        color-scheme: light;

        --background-color: var(--color-ivory);
        --foreground-color: var(--color-aubergine);
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
      background-color: var(--background-color);
      color: var(--foreground-color);
      font-family: var(--font-sans);
      transition:
        background-color 100ms ease,
        color 100ms ease;
    }

    .hill-before-green-tower,
    .hill4100 {
      fill: var(--background-color);
      transition: fill 100ms ease;
    }
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

    div.background.color {
      background-color: var(--background-color);
    }
    div.foreground.color {
      background-color: var(--foreground-color);
    }

    ${colorClassNames}
  }
`;
