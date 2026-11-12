import { styled } from '@linaria/react';
import { ChangeEvent } from 'react';

import { RangeSlider } from './RangeSlider';

export type Mark = { at: number; label?: string } | { from: number; to: number; label: string };

export interface TimelineProps {
    /** Current position in seconds. */
    position: number;
    /** Total length in seconds. */
    duration: number;
    marks: Mark[];
    onSeek: (position: number) => void;
}

export const formatTimecode = (seconds: number) => {
    const total = Math.floor(Math.max(0, seconds) * 100 + 1e-6);
    const hundredths = String(total % 100).padStart(2, '0');
    const secs = String(Math.floor(total / 100) % 60).padStart(2, '0');
    const minutes = String(Math.floor(total / 6000)).padStart(2, '0');

    return `${minutes}:${secs}.${hundredths}`;
};

const Styling = styled.div`
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;

    & > input {
        grid-column: 2;
        grid-row: 1;
        position: relative;
        z-index: 1;
        width: 100%;
        min-width: 0;
    }
`;

/** Sits on the slider track, behind the thumb. */
const Marks = styled.div`
    grid-column: 2;
    grid-row: 1;
    position: relative;
    align-self: stretch;
    margin-inline: 5px;
    pointer-events: none;
`;

const Diamond = styled.span`
    position: absolute;
    top: 50%;
    width: 7px;
    height: 7px;
    margin: -3.5px 0 0 -3.5px;
    background: currentColor;
    transform: rotate(45deg);
`;

const Bar = styled.span`
    position: absolute;
    top: 50%;
    height: 6px;
    margin-top: -3px;
    background: currentColor;
    border-radius: 3px;
    opacity: 0.55;
`;

const percent = (seconds: number, duration: number) =>
    duration > 0 ? Math.min(100, Math.max(0, (seconds / duration) * 100)) : 0;

const MarkView = ({ mark, duration }: { mark: Mark; duration: number }) =>
    'at' in mark ? (
        <Diamond style={{ left: `${percent(mark.at, duration)}%` }} />
    ) : (
        <Bar
            style={{
                left: `${percent(mark.from, duration)}%`,
                width: `${percent(mark.to, duration) - percent(mark.from, duration)}%`,
            }}
        />
    );

export const Timeline = ({ position, duration, marks, onSeek }: TimelineProps) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onSeek(Number(e.target.value));
    };

    return (
        <Styling>
            <span aria-hidden="true">[</span>
            <Marks aria-hidden="true">
                {marks.map(mark => (
                    <MarkView
                        key={`${'at' in mark ? mark.at : `${mark.from}-${mark.to}`}-${mark.label ?? ''}`}
                        mark={mark}
                        duration={duration}
                    />
                ))}
            </Marks>
            <RangeSlider
                aria-label="Position in der Aufzeichnung"
                aria-valuetext={formatTimecode(position)}
                min={0}
                max={duration}
                step={0.01}
                value={position}
                onChange={handleChange}
            />
            <span aria-hidden="true">]</span>
        </Styling>
    );
};
