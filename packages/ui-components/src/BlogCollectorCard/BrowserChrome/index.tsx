import { styled } from '@linaria/react';

import { light } from '../light';

export const BrowserChrome = styled.div`
    position: absolute;
    left: 5cqw;
    right: 5cqw;
    top: 5.5cqw;
    height: 53cqw;
    display: grid;
    grid-template-rows: 5.5cqw minmax(0, 1fr);
    padding: 1.5cqw;
    border-radius: 2.8cqw;
    background: var(--color-surface-raised);
    overflow: hidden;
    /* Ring like the card edge, then a drop shadow that lifts the screenshot off the card */
    box-shadow:
        0 0 0 0.5cqw var(--color-border-default),
        0 1.6cqw 2cqw rgb(15 5 29 / 0.45);

    img {
        display: block;
        width: 100%;
        height: 100%;
        min-height: 0;
        border-radius: 0 0 1.4cqw 1.4cqw;
        background: var(--color-surface-emphasis);
        box-shadow: 0 0 0 0.3cqw var(--color-surface-raised);
        object-fit: cover;
        object-position: top center;
    }

    ${light(`
        box-shadow:
            0 0 0 0.5cqw var(--color-border-default),
            0 1.6cqw 2cqw rgb(30 20 46 / 0.35);
    `)}

    /* With a light screenshot both images are rendered and the theme picks one */
    img[data-theme-shot='light'] {
        display: none;
    }

    ${light(`
        img[data-theme-shot='dark'] {
            display: none;
        }

        img[data-theme-shot='light'] {
            display: block;
        }
    `)}
`;

export const BrowserChromeBar = styled.div`
    display: flex;
    align-items: center;
    gap: 1.2cqw;
    padding-inline: 2.4cqw;
    border-radius: 1.4cqw 1.4cqw 0 0;
    background: var(--hue);

    i {
        width: 1.8cqw;
        height: 1.8cqw;
        border-radius: 50%;
        background: color-mix(in oklab, var(--color-surface-default) 75%, transparent);
    }

    span {
        margin-left: 2cqw;
        font-size: 2.6cqw;
        font-weight: 700;
        color: var(--color-surface-default);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;
