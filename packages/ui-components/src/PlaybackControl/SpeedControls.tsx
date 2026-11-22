import { styled } from '@linaria/react';
import { ChangeEvent, MouseEvent } from 'react';

import { PlayPauseButton } from './PlayPauseButton';
import { RangeSlider } from './RangeSlider';

export const Row = styled.div`
    display: flex;
    align-items: center;
    white-space: nowrap;
`;

const SpeedRow = styled(Row)`
    flex: 1 1 22rem;
    min-width: 0;

    /* Below ~320px the label no longer fits next to the slider, so it wraps */
    flex-wrap: wrap;
    row-gap: 0.5rem;
`;

const SliderWrap = styled.span`
    display: flex;
    align-items: center;
    flex: 1 1 8rem;
    min-width: 8rem;

    & > input {
        flex: 1 1 auto;
        min-width: 0;
    }
`;

const SpeedLabel = styled.span`
    display: inline-block;
    flex: none;
    white-space: pre;
`;

const formatSpeed = (speed: number) => `${Number(speed.toFixed(2))}x`;

const countDecimals = (value: number) => Math.min(2, (String(value).split('.')[1] ?? '').length);

/** Width in ch of the longest label the slider range can produce. */
const getLabelWidth = (min: number, max: number, step: number) => {
    const decimals = Math.max(countDecimals(step), countDecimals(min));
    const digits = Math.max(String(Math.trunc(min)).length, String(Math.trunc(max)).length);
    const number = digits + (decimals > 0 ? decimals + 1 : 0);

    // " Speed (" + number + "x)"
    return 8 + number + 2;
};

export interface SpeedControlsProps {
    speed: number;
    speedMin: number;
    speedMax: number;
    speedStep: number;
    onSpeedChange: (speed: number) => void;
}

export const SpeedControls = ({ speed, speedMin, speedMax, speedStep, onSpeedChange }: SpeedControlsProps) => {
    const handleSpeedChange = (e: ChangeEvent<HTMLInputElement>) => {
        onSpeedChange(Number(e.target.value));
    };

    const handleSpeedIncrement = (e: MouseEvent<HTMLButtonElement>) => {
        const direction = e.currentTarget.value;
        const delta = direction === 'increment' ? speedStep : -speedStep;
        onSpeedChange(Math.min(speedMax, Math.max(speedMin, speed + delta)));
    };

    return (
        <SpeedRow>
            <PlayPauseButton
                type="button"
                value="decrement"
                onClick={handleSpeedIncrement}
            >
                [ - ]
            </PlayPauseButton>
            <SliderWrap>
                [
                <RangeSlider
                    aria-label="Speed"
                    onChange={handleSpeedChange}
                    step={speedStep}
                    min={speedMin}
                    max={speedMax}
                    value={speed}
                />
                ]
            </SliderWrap>
            <PlayPauseButton
                type="button"
                value="increment"
                onClick={handleSpeedIncrement}
            >
                [ + ]
            </PlayPauseButton>
            <SpeedLabel
                style={{
                    width: `${getLabelWidth(speedMin, speedMax, speedStep)}ch`,
                }}
            >
                {' '}
                Speed ({formatSpeed(speed)})
            </SpeedLabel>
        </SpeedRow>
    );
};

