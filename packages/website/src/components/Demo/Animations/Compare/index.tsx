'use client';

import { faPause, faPlay, faReply } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { styled } from '@linaria/react';
import { DemoCanvas } from '@samisdat/ui-components/DemoCanvas';
import { PlaybackControl } from '@samisdat/ui-components/PlaybackControl';
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
    const containerRef = useRef<HTMLDivElement | null>(null);

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [resetCounter, setResetCounter] = useState(0);

    const handlePlayPause = () => {
        setIsPlaying(prev => !prev);
    };

    const handleReset = () => {
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

    const onChangeSpeed = (value: number) => {
        console.log(value);
    };

    return (
        <DemoCanvas ref={containerRef}>
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
            <PlaybackControl
                isPlaying={isPlaying}
                speedMin={1}
                speedMax={80}
                speed={100}
                onSpeedChange={onChangeSpeed}
                onPlayPause={handlePlayPause}
                onReset={handleReset}
            />
        </DemoCanvas>
    );
};
