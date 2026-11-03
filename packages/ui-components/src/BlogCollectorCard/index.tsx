'use client';

import { styled } from '@linaria/react';
import { useParallax } from '@samisdat/tools';
import { FC, HTMLAttributes, useRef } from 'react';

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

const BackFace = styled(Face)``;

export const BlogCollectorCard: FC<HTMLAttributes<HTMLDivElement>> = ({ children }) => {
    const ref = useRef<HTMLDivElement | null>(null);

    useParallax(ref);

    return (
        <BlogCollectorCardStyling>
            <CardFaces ref={ref}>
                <FrontFace>{children}</FrontFace>
                <BackFace>{children}</BackFace>
            </CardFaces>
        </BlogCollectorCardStyling>
    );
};
