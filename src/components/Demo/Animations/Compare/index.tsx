import { styled } from '@linaria/react';
import { useState } from 'react';
import { Css } from './Css';
import { Js } from './Js';
import { Smil } from './Smil';

const DemoAnimationsCompareStyling = styled.div`
    max-width: 450px;

    .controls {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
    }
`;

export const DemoAnimationsCompare = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [resetCounter, setResetCounter] = useState(0);

    const handlePlayPause = () => {
        setIsPlaying(prev => !prev);
    };

    const handleReset = () => {
        setIsPlaying(false);
        setResetCounter(prev => prev + 1);
    };

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
