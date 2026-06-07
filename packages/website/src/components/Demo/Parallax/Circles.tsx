'use client';

import { styled } from '@linaria/react';
import { CSSProperties, useRef } from 'react';
import { useParallax } from './useParallax';

const Styling = styled.div`
    svg {
        width: 100%;
        height: 100%;
        fill-rule: evenodd;
        clip-rule: evenodd;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-miterlimit: 1.5;
        display: block;
        border-radius: 0.5rem;

 border: 1px solid var(--color-background-muted);
  background-color: var(--color-background-secondary);

        &:hover {
            border-color: var(--color-foreground-subtle);
        }
    }
 
    }
    & .parallax {
        transition: transform 10ms ease;
        transform: translateX(calc(150px * var(--parallax-x) * var(--depth)))
            translateY(calc(150px * var(--parallax-y) * var(--depth)));
    }

    & rect {
        fill: var(--color-background-secondary); 
    }
    & circle.red {
        fill: var(--color-red); 
    }
    & circle.blue {
        fill: var(--color-blue); 
    }
    & circle.yellow {
        fill: var(--color-yellow); 
    }
`;

export const DemoParallaxCircles = () => {
    const ref = useRef<HTMLDivElement | null>(null);

    useParallax(ref);

    return (
        <>
            <div className="color orange"></div>
            <div className="color red"></div>
            <div className="color blue"></div>

            <Styling ref={ref}>
                <svg
                    viewBox="0 0 400 400"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    xmlSpace="preserve"
                >
                    <rect
                        x1={0}
                        x2={400}
                        y1={400}
                        y2={400}
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
                </svg>
            </Styling>
        </>
    );
};
