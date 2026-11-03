'use client';

import { useDemoContext } from '@samisdat/ui-components/Demo/DemoContext';
import { DemoAnimation } from '@samisdat/ui-components/DemoAnimation';
import { useEffect, useRef, useState } from 'react';

import { useSpeedDuration, formatDuration, SPEED_MULTIPLIER_PROPS } from '../../../PlaybackControl/useSpeedDuration';
import { DiscSvg } from './Svg';

export const DemoSmilDisc = () => {
    const ctx = useDemoContext();
    const [baseDuration] = useState(() => parseFloat(ctx?.values.duration ?? '6') || 6);
    const { speed, setSpeed, resetSpeed, duration } = useSpeedDuration(baseDuration);

    const containerRef = useRef<HTMLDivElement | null>(null);

    const [isPlaying, setIsPlaying] = useState(false);

    const getSvg = () => containerRef.current?.querySelector<SVGSVGElement>('svg') ?? null;

    useEffect(() => {
        const svg = getSvg();
        if (!svg) return;
        svg.pauseAnimations();
        svg.setCurrentTime(0);
    }, []);

    useEffect(() => {
        containerRef.current?.querySelector('animate, animateTransform')?.setAttribute('dur', `${duration}s`);
    }, [duration]);

    const onSpeedChange = (value: number) => {
        setSpeed(value);
        ctx?.setValue('duration', formatDuration(baseDuration / value));
    };

    const onPlay = () => {
        getSvg()?.unpauseAnimations();
        setIsPlaying(true);
    };

    const onPause = () => {
        getSvg()?.pauseAnimations();
        setIsPlaying(false);
    };

    const onReset = () => {
        const svg = getSvg();
        if (svg) {
            svg.pauseAnimations();
            svg.setCurrentTime(0);
        }
        resetSpeed();
        ctx?.setValue('duration', formatDuration(baseDuration));
        setIsPlaying(false);
    };

    return (
        <DemoAnimation
            ref={containerRef}
            playbackControl={{
                isPlaying,
                ...SPEED_MULTIPLIER_PROPS,
                speedControl: true,
                speed,
                onSpeedChange,
                onPlay,
                onPause,
                onReset,
            }}
        >
            <DiscSvg initialDur={duration} />
        </DemoAnimation>
    );
};
