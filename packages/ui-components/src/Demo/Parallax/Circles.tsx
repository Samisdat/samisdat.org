'use client';

import { useParallax } from '@samisdat/tools';
import { useRef } from 'react';

import { CirclesView } from './CirclesView';

export const DemoParallaxCircles = () => {
    const ref = useRef<HTMLDivElement | null>(null);

    useParallax(ref);

    return (
        <div ref={ref}>
            <CirclesView />
        </div>
    );
};
