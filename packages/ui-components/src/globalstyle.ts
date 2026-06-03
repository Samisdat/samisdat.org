import { css } from "@linaria/core";
import "normalize.css";
import { color } from "./tokens/color";

console.log(color.aubergine);

export const globalStyles = css`
  :global() {
    :root {
      /* base */
      --hue-aubergine: 300;
      --hue-ivory: 30;

      /* base */

      --color-aubergine: ${color.aubergine};
      --color-ivory: oklch(84.97% 0.037 var(--hue-ivory));

      /* aubergine range */

      --color-aubergine-deep: oklch(
        from var(--color-aubergine) calc(l - 0.07) c h
      );
      --color-aubergine-soft: oklch(
        from var(--color-aubergine) calc(l + 0.08) calc(c * 1.2) h
      );
      --color-aubergine-soft-2: oklch(
        from var(--color-aubergine) calc(l + 0.15) calc(c * 1.2) h
      );
      --color-aubergine-border: oklch(
        from var(--color-aubergine) calc(l + 0.22) calc(c * 1) h
      );
      --color-aubergine-muted: oklch(
        from var(--color-aubergine) calc(l + 0.35) calc(c * 0.8) h
      );
      --color-aubergine-faded: oklch(
        from var(--color-aubergine) calc(l + 0.5) calc(c * 0.6) h
      );

      /* ivory Scale */

      --color-ivory-soft: oklch(from var(--color-ivory) calc(l + 0.11) c h);
      --color-ivory-deep: oklch(
        from var(--color-ivory) calc(l - 0.55) calc(c * 2) h
      );

      /* legacy, rm after refactoring*/
      --color-soft-ivory: var(--color-ivory-soft);
      --color-deep-aubergine: var(--color-aubergine-deep);

      /* accents  */
      --color-red: oklch(64% 0.22 10);
      --color-orange: oklch(73% 0.16 60);
      --color-yellow: oklch(83% 0.16 85);
      --color-green: oklch(68% 0.17 155);
      --color-teal: oklch(78% 0.11 190);
      --color-blue: oklch(62% 0.19 265);
      --color-purple: oklch(60% 0.22 305);
      --color-pink: oklch(75% 0.13 355);

      /* /base */

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
      border: 10px solid red;
    }

    div.aubergine.color {
      background-color: var(--color-aubergine);
    }
    div.ivory.color {
      background-color: var(--color-ivory);
    }
    div.background.color {
      background-color: var(--background-color);
    }
    div.foreground.color {
      background-color: var(--foreground-color);
    }
    div.red {
      background-color: var(--color-red);
    }

    div.orange {
      background-color: var(--color-orange);
    }

    div.yellow {
      background-color: var(--color-yellow);
    }

    div.green {
      background-color: var(--color-green);
    }

    div.teal {
      background-color: var(--color-teal);
    }

    div.blue {
      background-color: var(--color-blue);
    }

    div.purple {
      background-color: var(--color-purple);
    }

    div.pink {
      background-color: var(--color-pink);
    }
  }
`;
