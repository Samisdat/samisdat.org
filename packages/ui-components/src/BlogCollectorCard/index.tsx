'use client';

import { css } from '@linaria/core';
import { styled } from '@linaria/react';
import { useParallax } from '@samisdat/tools';
import { FC, HTMLAttributes, useRef, useState } from 'react';

export const globals = css`
    :global() {
        @property --progress {
            syntax: '<number>';
            inherits: true;
            initial-value: 0;
        }
    }
`;

const BlogCollectorCardStyling = styled.div`
    --parallax-x: 0;
    --parallax-y: 0;
    --tilt: 12deg;

    position: relative;
    display: block;
    width: 100%;
    max-width: 15rem;
    container-type: inline-size;
`;

const CardFaces = styled.div`
    --progress: 0;

    position: relative;
    aspect-ratio: 5 / 7;
    width: 100%;
    border: 1px solid var(--color-border-default);
    background-color: var(--color-surface-raised);

    transform-style: preserve-3d;
    transition: --progress 1.1s cubic-bezier(0.5, 0, 0.2, 1);
    will-change: transform;
    transform: perspective(60rem) rotateY(calc(var(--tilt) * var(--parallax-x)))
        rotateX(calc(var(--tilt) * var(--parallax-y) * -1)) rotateY(calc(var(--progress) * 180deg));

    &[data-flipped='true'] {
        --progress: 1;
    }

    @media (prefers-reduced-motion: reduce) {
        transition-duration: 0.01s;
    }
`;

const Face = styled.div`
    position: absolute;
    inset: 0;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    border-radius: 5cqw;
    padding: 3.2cqw;
    overflow: hidden;
`;
const FrontFace = styled(Face)``;

const BackFace = styled(Face)`
    transform: rotateY(180deg);
`;

const FlipCard = styled.button`
    position: absolute;
    inset: 0;
    z-index: 2;
    margin: 0;
    padding: 0;
    border: 0;
    background: none;
    cursor: pointer;
    border-radius: 5cqw;
    color: inherit;
    font: inherit;

    &:focus-visible {
        outline: 3px solid var(--color-border-focus);
        outline-offset: 4px;
    }
`;

const SrOnly = styled.span`
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
    border: 0;
`;

export const BlogCollectorCard: FC<HTMLAttributes<HTMLDivElement>> = ({ children: _children }) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [flipped, setFlipped] = useState(false);

    // The pointer is tracked on the unrotated wrapper, so the tilt does not feed back into the measured rect
    // and the overlay button does not swallow pointer events.
    useParallax(ref);

    return (
        <BlogCollectorCardStyling ref={ref}>
            <CardFaces data-flipped={flipped}>
                <FrontFace aria-hidden={flipped}>Front</FrontFace>
                <BackFace aria-hidden={!flipped}>Back</BackFace>
            </CardFaces>
            <FlipCard
                type="button"
                aria-pressed={flipped}
                onClick={() => setFlipped((value) => !value)}
            >
                <SrOnly>Karte umdrehen</SrOnly>
            </FlipCard>
        </BlogCollectorCardStyling>
    );
};
