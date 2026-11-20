'use client';

import { type NormSource, useParallax } from '@samisdat/tools';
import { useRef } from 'react';

import { HillsView } from './HillsView';

type HillsPictureProps = {
    /** Drives the picture instead of the pointer on the container. */
    source?: NormSource;
};

/** The hills image alone (no grid), so an overlay can sit exactly on it. */
export const HillsPicture = ({ source }: HillsPictureProps) => {
    const ref = useRef<SVGSVGElement | null>(null);

    useParallax(ref, {}, source);

    return <HillsView ref={ref} />;
};
