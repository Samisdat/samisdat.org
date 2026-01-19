'use client';

import { styled } from '@linaria/react';
import { ChangeEvent, useRef } from 'react';

const Styling = styled.div`
    max-width: 450px;

    & svg {
        width: 450px;
        height: 300px;
        background: var(--color-soft-ivory);
    }
    & svg path {
        fill: none;
        stroke: var(--color-aubergine);
        stroke-width: 2px;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-miterlimit: 1.5;
    }
`;

const Svg = () => (
    <svg
        height="100%"
        viewBox="0 0 150 100"
    >
        <path d="M0,50l148,0" />
        <path d="M75,0l0,98" />
        <path d="M143.362,45.362l4.638,4.638l-4.638,4.638" />
        <path d="M79.638,93.362l-4.638,4.638l-4.638,-4.638" />
    </svg>
);

export const DemoParallaxSectors = () => {
    const ref = useRef<HTMLDivElement>(null);

    const onChange = (evt: ChangeEvent<HTMLInputElement>) => {
        if (!ref.current) {
            return;
        }

        ref.current.querySelector('animate')?.setAttribute('dur', `${evt.currentTarget.value}s`);
    };

    return (
        <Styling ref={ref}>
            <label>
                Geschwindigkeit
                <input
                    type="range"
                    name="speed"
                    min="1"
                    max="60"
                    defaultValue={'40'}
                    onChange={onChange}
                />
            </label>
            <Svg />
        </Styling>
    );
};
