import { css } from '@linaria/core';
import 'normalize.css';

export const globalStyles = css`
    :global() {
        :root {
            /* base */
            --hue-aubergine: 300;
            --hue-ivory: 30;

            /* base */

            --color-aubergine: oklch(22% 0.05 var(--hue-aubergine));
            --color-ivory: oklch(84.97% 0.037 var(--hue-ivory));

            /* aubergine range */

            --color-aubergine-deep: oklch(from var(--color-aubergine) calc(l - 0.07) c h);
            --color-aubergine-soft: oklch(from var(--color-aubergine) calc(l + 0.08) calc(c * 1.2) h);
            --color-aubergine-soft-2: oklch(from var(--color-aubergine) calc(l + 0.15) calc(c * 1.2) h);
            --color-aubergine-border: oklch(from var(--color-aubergine) calc(l + 0.22) calc(c * 1) h);
            --color-aubergine-muted: oklch(from var(--color-aubergine) calc(l + 0.35) calc(c * 0.8) h);
            --color-aubergine-faded: oklch(from var(--color-aubergine) calc(l + 0.5) calc(c * 0.6) h);

            /* ivory Scale */

            --color-ivory-soft: oklch(from var(--color-ivory) calc(l + 0.11) c h);
            --color-ivory-deep: oklch(from var(--color-ivory) calc(l - 0.55) calc(c * 2) h);

            /* legacy, rm after refactoring*/
            --color-soft-ivory: var(--color-ivory-soft);
            --color-deep-aubergine: var(--color-aubergine-deep);
            --color-warm-ivory: var(--color-ivory);

            color-scheme: dark;

            --background-color: var(--color-aubergine);
            --foreground-color: var(--color-ivory);

            --typo-h1-size: 3rem;
            --typo-h2-size: 2.75rem;
            --typo-h3-size: 2.25rem;
            --typo-h4-size: 1.75rem;
            --typo-h5-size: 1.25rem;
            --typo-h6-size: 1rem;
        }

        :root[data-theme='dark'] {
            color-scheme: dark;

            --background-color: var(--color-aubergine);
            --foreground-color: var(--color-warm-ivory);
        }

        /*
        :root[data-theme='light'] {

            
            color-scheme: light;

            background-color: color-mix(
                in oklab,
                var(--color-aubergine) calc((1 - var(--mix)) * 100%),
                var(--color-soft-ivory) calc(var(--mix) * 100%)
            );
            --foreground-color: color-mix(
                in oklab,
                var(--color-warm-ivory) calc((1 - var(--mix)) * 100%),
                var(--color-deep-aubergine) calc(var(--mix) * 100%)
            );
          
        }

        @media (prefers-color-scheme: light) {
            :root:not([data-theme]) {
                color-scheme: light;

                --background-color: color-mix(
                    in oklab,
                    var(--color-aubergine) calc((1 - var(--mix)) * 100%),
                    var(--color-soft-ivory) calc(var(--mix) * 100%)
                );

                --foreground-color: color-mix(
                    in oklab,
                    var(--color-warm-ivory) calc((1 - var(--mix)) * 100%),
                    var(--color-deep-aubergine) calc(var(--mix) * 100%)
                );
            }
        }
         */

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
            border: 1px solid red;
        }

        div.background-color {
            background-color: var(--background-color);
        }
        div.foreground-color {
            background-color: var(--foreground-color);
        }
    }
`;
