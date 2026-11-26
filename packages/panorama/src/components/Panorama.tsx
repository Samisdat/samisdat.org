import './panorama.css';

import { useAnimationFrame, useParallax } from '@samisdat/tools';
import { ReactElement, ReactNode, useRef } from 'react';

import { TimeControl } from '@/components/Clock/TimeControl';
import { Heaven } from '@/components/Heaven/Heaven';
import { Landscape } from '@/components/Landscape';
import { useTal } from '@/lib/TalContext';

import { VIEW_HEIGHT, VIEW_WIDTH } from './viewBox';

import type { Star } from '@/lib/stars';

interface PanoramaProps {
    stars?: readonly Star[];
    controls?: ReactNode;
}

export const Panorama = ({ stars, controls }: PanoramaProps): ReactElement => {
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
                    viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
                >
                    <Heaven stars={stars} />
                    <Landscape />
                </svg>
                <TimeControl footer={controls} />
            </div>
        </>
    );
};
