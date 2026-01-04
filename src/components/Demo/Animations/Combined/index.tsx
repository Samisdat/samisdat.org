import { styled } from '@linaria/react';
import { useState } from 'react';
import { DemoAnimationsCombinedCss } from './Css';
import { DemoAnimationsCombinedJs } from './Js';
import { DemoAnimationsCombinedSmil } from './Smil';

export interface DemoAnimationsCombinedProps {
    isPlaying: boolean;
    resetTrigger: number;
}

const SvgCombinedStyling = styled.div`
    max-width: 450px;

    .controls {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
    }
`;

export const DemoAnimationsCombined = () => {
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
        <SvgCombinedStyling>
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
            <DemoAnimationsCombinedSmil
                isPlaying={isPlaying}
                resetTrigger={resetCounter}
            />
            <DemoAnimationsCombinedCss
                isPlaying={isPlaying}
                resetTrigger={resetCounter}
            />
            <DemoAnimationsCombinedJs
                isPlaying={isPlaying}
                resetTrigger={resetCounter}
            />
        </SvgCombinedStyling>
    );
};
