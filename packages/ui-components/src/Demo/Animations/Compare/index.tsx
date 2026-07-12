'use client';

import { styled } from '@linaria/react';
import { DemoAnimation } from '@samisdat/ui-components/DemoAnimation';
import { useEffect, useRef, useState } from 'react';
import { Css } from './Css';
import { Js } from './Js';
import { JsCss } from './JsCss';
import { Smil } from './Smil';
import { config } from './shared';

const DemoAnimationsCompareStyling = styled.div`
    max-width: 450px;
`;

export const DemoAnimationsCompare = () => {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [resetCounter, setResetCounter] = useState(0);
    const [speed, setSpeed] = useState(1);

    const onPlay = () => {
        setIsPlaying(true);
    };

    const onPause = () => {
        setIsPlaying(false);
    };

    const onReset = () => {
        setIsPlaying(false);
        setResetCounter(prev => prev + 1);

        if (timerRef.current !== null) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    useEffect(() => {
        if (!isPlaying) {
            if (timerRef.current !== null) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
            return;
        }

        timerRef.current = setTimeout(() => {
            setIsPlaying(false);
            setResetCounter(prev => prev + 1);
            timerRef.current = null;
        }, config.totalDuration);

        return () => {
            if (timerRef.current !== null) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [isPlaying]);

    const onSpeedChange = (value: number) => {
        setSpeed(value);
    };

    return (
        <DemoAnimation
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
            <DemoAnimationsCompareStyling>
                <Smil
                    isPlaying={isPlaying}
                    resetTrigger={resetCounter}
                />
                <Css
                    isPlaying={isPlaying}
                    resetTrigger={resetCounter}
                />
                <Js
                    isPlaying={isPlaying}
                    resetTrigger={resetCounter}
                />
                <JsCss
                    isPlaying={isPlaying}
                    resetTrigger={resetCounter}
                />
            </DemoAnimationsCompareStyling>
        </DemoAnimation>
    );
};
