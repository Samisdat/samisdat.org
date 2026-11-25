import './panorama.css';

import { useAnimationFrame, useParallax } from '@samisdat/tools';
import { ReactElement, ReactNode, useRef } from 'react';

import { TimeControl } from '@/components/Clock/TimeControl';
import { Heaven } from '@/components/Heaven/Heaven';
import { Landscape } from '@/components/Landscape';
import { useTal } from '@/lib/TalContext';


import type { Star } from '@/lib/stars';

interface PanoramaProps {
    stars?: readonly Star[];
    controls?: ReactNode;
    /** Draw the sun and moon path for the parallax extremes. */
    arcGuides?: boolean;
}

export const Panorama = ({ stars, arcGuides, controls }: PanoramaProps): ReactElement => {
    const ref = useRef<HTMLDivElement | null>(null);

    useParallax(ref, { scroll: true });

    const { windowOpacity } = useTal().sunTimes;

    const applyTwilight = () => ref.current?.style.setProperty('--twilight', String(windowOpacity));

    useAnimationFrame(applyTwilight);

    return (
        <>
            <div
                ref={ref}
                className={'panorama'}
            >
                <svg
                    aria-hidden="true"
                    height="100%"
                    viewBox="0 0 1700 500"
                >
                    <Heaven
                        stars={stars}
                        arcGuides={arcGuides}
                    />
                    <Landscape />
                </svg>
                <TimeControl footer={controls} />
            </div>
        </>
    );
};
