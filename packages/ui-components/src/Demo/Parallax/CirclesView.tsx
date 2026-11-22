'use client';

import { styled } from '@linaria/react';
import { CSSProperties, Ref } from 'react';

const Svg = styled.svg`
    width: 100%;
    height: 100%;
    fill-rule: evenodd;
    clip-rule: evenodd;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-miterlimit: 1.5;
    display: block;

    /* vertical swipes keep scrolling the page, horizontal drags go to the demo */
    touch-action: pan-y;
    border-radius: 0.5rem;
    border: 1px solid var(--color-border-default);
    background-color: var(--color-surface-raised);

    &:hover {
        border-color: var(--color-text-subtle);
    }

    & .parallax {
        transition: transform 10ms ease;
        transform: translateX(calc(150px * var(--parallax-x) * var(--depth)))
            translateY(calc(150px * var(--parallax-y) * var(--depth)));
    }

    & rect {
        fill: var(--color-surface-raised);
    }

    & circle.red {
        fill: var(--color-ink-ruby);
    }

    & circle.blue {
        fill: var(--color-ink-sapphire);
    }

    & circle.yellow {
        fill: var(--color-ink-gold);

        [data-theme='light'] & {
            fill: var(--color-ink-jade);
        }

        @media (prefers-color-scheme: light) {
            :root:not([data-theme]) & {
                fill: var(--color-ink-jade);
            }
        }
    }
`;

export const CirclesView = ({ ref }: { ref?: Ref<SVGSVGElement> }) => (
    <Svg
        ref={ref}
        viewBox="0 0 400 400"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        xmlSpace="preserve"
    >
        <rect
            x="0"
            y="0"
            width="400"
            height="400"
        />

        <circle
            className={'red parallax'}
            style={{ '--depth': -1 } as CSSProperties}
            cx="200"
            cy="125"
            r="100"
        />
        <circle
            className={'yellow'}
            cx="200"
            cy="205"
            r="100"
        />
        <circle
            className={'blue parallax'}
            style={{ '--depth': 1 } as CSSProperties}
            cx="200"
            cy="275"
            r="100"
        />
    </Svg>
);
