'use client';

import { useDemoContext } from '@samisdat/ui-components/Demo/DemoContext';
import { DemoAnimation } from '@samisdat/ui-components/DemoAnimation';
import { useEffect, useRef, useState } from 'react';

import { SPEED_MULTIPLIER_PROPS, useSpeedDuration } from '../../../PlaybackControl/useSpeedDuration';
import { BASE_DURATION_FALLBACK, type CrankEvent } from './crankEvents';
import { CrankSvg } from './CrankSvg';
import { useCrankEffects, useCrankHandles } from './useCrankEffects';

export { DemoSmilCrankFormula } from './Formula';

export const DemoSmilCrank = () => {
    const ctx = useDemoContext();
    const [baseDuration] = useState(() => parseFloat(ctx?.values.duration ?? '') || BASE_DURATION_FALLBACK);
    const publish = (event: CrankEvent) => ctx?.live.publish(event);

    const { speed, setSpeed, resetSpeed, duration } = useSpeedDuration(baseDuration);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const handles = useCrankHandles(containerRef, baseDuration);
    const { animRef, ghostRef, ghostAnimationRef, durRef, getSvg } = handles;

    const [isPlaying, setIsPlaying] = useState(false);

    // The rAF loop is set up once; it must always call the latest closure.
    const resetRef = useRef<(reason: 'button' | 'limit') => void>(() => {});

    useCrankEffects({ handles, publish, resetRef, duration });

    const onPlay = () => {
        getSvg()?.unpauseAnimations();
        setIsPlaying(true);
    };

    const onPause = () => {
        getSvg()?.pauseAnimations();
        setIsPlaying(false);
    };

    const reset = (reason: 'button' | 'limit') => {
        const svg = getSvg();
        if (svg) {
            svg.pauseAnimations();
            svg.setCurrentTime(0);
        }

        // Apply the base duration right away so the duration effect sees no
        // change and does not report a jump for a reset.
        durRef.current = baseDuration;
        animRef.current?.setAttribute('dur', `${baseDuration}s`);
        resetSpeed();

        ghostAnimationRef.current?.cancel();
        if (ghostRef.current) {
            ghostRef.current.style.opacity = '0';
        }
        publish({ kind: 'reset', reason });
        setIsPlaying(false);
    };
    useEffect(() => {
        resetRef.current = reset;
    });

    return (
        <DemoAnimation
            ref={containerRef}
            playbackControl={{
                isPlaying,
                ...SPEED_MULTIPLIER_PROPS,
                speed,
                onSpeedChange: setSpeed,
                onPlay,
                onPause,
                onReset: () => reset('button'),
            }}
        >
            <CrankSvg
                groupRef={handles.groupRef}
                animRef={animRef}
                ghostRef={ghostRef}
                baseDuration={baseDuration}
            />
        </DemoAnimation>
    );
};
