import { styled } from '@linaria/react';
import { useEffect, useRef, useState } from 'react';
import { Css } from './Css';
import { Js } from './Js';
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
    };

    useEffect(() => {
        if (isPlaying) {
            timerRef.current = setTimeout(() => {
                console.log('10 sekunden rum. einmal reset und pause');

                setIsPlaying(false);
            }, config.totalDuration);
        }

        // 👇 Cleanup
        return () => {
            clearTimeout(timerRef.current);
        };
    }, [isPlaying, resetCounter, timerRef]);

    return (
        <DemoAnimationsCompareStyling>
            <div className="controls">
                <button
                    type="button"
                    onClick={handlePlayPause}
                >
                    {isPlaying ? 'Pause' : 'Play'}
                </button>
                <button
                    type="button"
                    onClick={handleReset}
                >
                    Reset
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
        </DemoAnimationsCompareStyling>
    );
};
