import { css } from '@linaria/core';
import 'normalize.css';

export const globalStyles = css`
    :global() {
        :root {
            --color-aubergine: oklch(22% 0.05 300);
            --color-warm-ivory: oklch(84.97% 0.037 29.7);

            --color-soft-ivory: oklch(96.27% 0.034 30.2);
            --color-deep-aubergine: oklch(27.65% 0.092 230.5);

            color-scheme: dark;

            --background-color: var(--color-aubergine);
            --foreground-color: var(--color-warm-ivory);

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

        div.background-color {
            background-color: var(--background-color);
        }
        div.foreground-color-color {
            background-color: var(--foreground-color);
        }
    }
`;
