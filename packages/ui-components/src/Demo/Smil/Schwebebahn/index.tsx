'use client';

import { DemoAnimation } from '@samisdat/ui-components/DemoAnimation';
import { useEffect, useRef, useState } from 'react';

import { Schwebebahn } from './Svg';

export const DemoSmilSchwebebahn = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const [speed, setSpeed] = useState(40);
    const [isPlaying, setIsPlaying] = useState(false);

    const getSvg = () => containerRef.current?.querySelector<SVGSVGElement>('svg') ?? null;

    useEffect(() => {
        const svg = getSvg();
        if (!svg) {
            return;
        }
        svg.pauseAnimations();
        svg.setCurrentTime(0);
    }, []);

    useEffect(() => {
        containerRef.current?.querySelector('animate')?.setAttribute('dur', `${speed}s`);
    }, [speed]);

    const onSpeedChange = (value: number) => {
        setSpeed(value);
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
        setSpeed(40);
        setIsPlaying(false);
    };

    return (
        <DemoAnimation
            ref={containerRef}
            playbackControl={{
                isPlaying,
                speedMin: 1,
                speedMax: 80,
                speed,
                onSpeedChange,
                onPlay,
                onPause,
                onReset,
            }}
        >
            <Schwebebahn />
        </DemoAnimation>
    );
};
