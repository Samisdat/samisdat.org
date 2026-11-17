'use client';

import { useParallax } from '@samisdat/tools';
import { useRef } from 'react';

import { CirclesView } from './CirclesView';

export const DemoParallaxCircles = () => {
    const ref = useRef<SVGSVGElement | null>(null);

    useParallax(ref);

    return <CirclesView ref={ref} />;
};
