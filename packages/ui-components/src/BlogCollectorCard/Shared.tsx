import { styled } from '@linaria/react';

export const Inner = styled.div`
    position: relative;
    box-sizing: border-box;
    height: 100%;
    border-radius: 3cqw;
    background: var(--color-surface-emphasis);
    color: var(--color-text-default);
    overflow: hidden;
    box-shadow: inset 0 0 0 0.4cqw var(--color-surface-raised);
`;

export const Banner = styled.div`
    --notch: 4cqw;

    padding: 0.6cqw;
    background: var(--color-border-default);
    clip-path: polygon(
        var(--notch) 0,
        calc(100% - var(--notch)) 0,
        100% 50%,
        calc(100% - var(--notch)) 100%,
        var(--notch) 100%,
        0 50%
    );

    > span {
        display: block;
        text-align: center;
        white-space: nowrap;
        text-transform: uppercase;
        color: var(--color-text-emphasis);
        position: relative;
        clip-path: inherit;
        text-shadow: 0 0.3cqw 0.6cqw color-mix(in oklab, var(--color-surface-emphasis) 80%, transparent);
    }
`;
