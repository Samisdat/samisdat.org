'use client';

import { css } from '@linaria/core';
import { styled } from '@linaria/react';
import { useParallax } from '@samisdat/tools';
import { FC, HTMLAttributes, useRef } from 'react';

export const globals = css`
    :global() {
        @property --progress {
            syntax: '<number>';
            inherits: true;
            initial-value: 0;
        }
    }
`;

const BlogCollectorCardStyling = styled.article`
    position: relative;
    display: block;
    width: 100%;
    max-width: 15rem;
`;

const CardFaces = styled.div`
    --parallax-x: 0;
    --parallax-y: 0;
    --tilt: 12deg;

    aspect-ratio: 5 / 7;
    width: 100%;
    border: 1px solid var(--color-border-default);
    background-color: var(--color-surface-raised);

    transform-style: preserve-3d;
    transition: transform 10ms ease;
    transform: perspective(60rem) rotateY(calc(var(--tilt) * var(--parallax-x)))
        rotateX(calc(var(--tilt) * var(--parallax-y) * -1));
`;

const Face = styled.div`
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
`;

export const BlogCollectorCard: FC<HTMLAttributes<HTMLDivElement>> = ({ children }) => {
    const ref = useRef<HTMLDivElement | null>(null);

    useParallax(ref);

    return (
        <BlogCollectorCardStyling>
            <CardFaces ref={ref}>
                <FrontFace>Front</FrontFace>
                <BackFace>Back</BackFace>
            </CardFaces>
            <FlipCard>Drehen</FlipCard>
        </BlogCollectorCardStyling>
    );
};
