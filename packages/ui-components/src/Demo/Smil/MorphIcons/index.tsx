'use client';

import { useDemoContext } from '@samisdat/ui-components/Demo/DemoContext';
import { DemoAnimation } from '@samisdat/ui-components/DemoAnimation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { formatDuration, SPEED_MULTIPLIER_PROPS, useSpeedDuration } from '../../../PlaybackControl/useSpeedDuration';
import { SmilMorphIcons } from './Svg';

export const DemoSmilMorphIcons = () => {
    const ctx = useDemoContext();
    const [baseDuration] = useState(() => parseFloat(ctx?.values.duration ?? '3') || 3);
    const { speed, setSpeed, resetSpeed, duration } = useSpeedDuration(baseDuration);
    const setContextValue = ctx?.setValue;

    const containerRef = useRef<HTMLDivElement | null>(null);

    const [isPlaying, setIsPlaying] = useState(false);

    const getSvg = useCallback(() => containerRef.current?.querySelector<SVGSVGElement>('svg') ?? null, []);

    useEffect(() => {
        const svg = getSvg();
        if (!svg) return;
        svg.pauseAnimations();
        svg.setCurrentTime(0);
    }, [getSvg]);

    useEffect(() => {
        const svg = getSvg();
        if (!svg) return;
        svg.querySelectorAll('animate').forEach(el => el.setAttribute('dur', `${duration}s`));
    }, [getSvg, duration]);

    const onSpeedChange = useCallback(
        (value: number) => {
            setSpeed(value);
            setContextValue?.('duration', formatDuration(baseDuration / value));
        },
        [baseDuration, setContextValue, setSpeed]
    );

    const onPlay = useCallback(() => {
        getSvg()?.unpauseAnimations();
        setIsPlaying(true);
    }, [getSvg]);

    const onPause = useCallback(() => {
        getSvg()?.pauseAnimations();
        setIsPlaying(false);
    }, [getSvg]);

    const onReset = useCallback(() => {
        const svg = getSvg();
        if (svg) {
            svg.pauseAnimations();
            svg.setCurrentTime(0);
        }
        resetSpeed();
        setContextValue?.('duration', formatDuration(baseDuration));
        setIsPlaying(false);
    }, [getSvg, baseDuration, setContextValue, resetSpeed]);

    return (
        <DemoAnimation
            ref={containerRef}
            playbackControl={{
                isPlaying,
                ...SPEED_MULTIPLIER_PROPS,
                speed,
                onSpeedChange,
                onPlay,
                onPause,
                onReset,
            }}
        >
            <SmilMorphIcons />
        </DemoAnimation>
    );
};
