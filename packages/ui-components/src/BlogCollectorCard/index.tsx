'use client';

import { css } from '@linaria/core';
import { styled } from '@linaria/react';
import { useParallax } from '@samisdat/tools';
import { useRef, useState } from 'react';

import { ScreenReaderOnly } from '../ScreenReaderOnly';
import { BackContent } from './BackContent';
import { CardData, FrontContent } from './FrontContent';

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

    transform-style: preserve-3d;
    transition: --progress 1.1s cubic-bezier(0.5, 0, 0.2, 1);
    will-change: transform;
    cursor: pointer;
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
    display: grid;
    grid-template-rows: minmax(0, 1fr);
    grid-template-columns: minmax(0, 1fr);
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    border-radius: 5cqw;
    padding: 3.2cqw;
    overflow: hidden;
    background: var(--color-surface-raised);
    box-shadow: inset 0 0 0 0.5cqw var(--color-border-default);
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
    /* Keyboard-only control: pointer events go to the faces, so the back can scroll */
    pointer-events: none;

    &:focus-visible {
        outline: 3px solid var(--color-border-focus);
        outline-offset: 4px;
    }
`;

export type BlogCollectorCardProps = CardData;

export const BlogCollectorCard = (card: BlogCollectorCardProps) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [flipped, setFlipped] = useState(false);
    const toggle = () => setFlipped(value => !value);

    // The pointer is tracked on the unrotated wrapper, so the tilt does not feed back into the measured rect
    // and the overlay button does not swallow pointer events.
    useParallax(ref);

    return (
        <BlogCollectorCardStyling ref={ref}>
            <CardFaces
                data-flipped={flipped}
                onClick={toggle}
            >
                <FrontFace aria-hidden={flipped}>
                    <FrontContent {...card} />
                </FrontFace>
                <BackFace aria-hidden={!flipped}>
                    <BackContent {...card} />
                </BackFace>
            </CardFaces>
            <FlipCard
                type="button"
                aria-pressed={flipped}
                onClick={toggle}
            >
                <ScreenReaderOnly>Karte umdrehen</ScreenReaderOnly>
            </FlipCard>
        </BlogCollectorCardStyling>
    );
};
