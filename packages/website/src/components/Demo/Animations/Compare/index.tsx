'use client';

import { faPause, faPlay, faReply } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { styled } from '@linaria/react';
import { useEffect, useRef, useState } from 'react';
import { Css } from './Css';
import { Js } from './Js';
import { JsCss } from './JsCss';
import { Smil } from './Smil';
import { config } from './shared';

const DemoAnimationsCompareStyling = styled.div`
    max-width: 450px;

    .controls {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
    }
`;

export const DemoAnimationsCompare = () => {
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

    return (
        <DemoAnimationsCompareStyling>
            <div className="controls">
                <button
                    type="button"
                    onClick={handlePlayPause}
                >
                    <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
                </button>
                <button
                    type="button"
                    onClick={handleReset}
                >
                    <FontAwesomeIcon icon={faReply} />
                </button>
            </div>
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
    );
};
