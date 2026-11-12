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

/** Seconds a point mark keeps its label visible. */
const POINT_LABEL_SECONDS = 0.8;

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
        width: 100%;
        min-width: 0;
    }
`;

const Marks = styled.div`
    grid-column: 2;
    position: relative;
    height: 1.3rem;
    margin-inline: 5px;
`;

const Diamond = styled.span`
    position: absolute;
    top: 2px;
    width: 6px;
    height: 6px;
    margin-left: -3px;
    background: currentColor;
    transform: rotate(45deg);
`;

const Bar = styled.span`
    position: absolute;
    top: 3px;
    height: 4px;
    background: currentColor;
    border-radius: 2px;
    opacity: 0.55;
`;

const Label = styled.span`
    position: absolute;
    top: 8px;
    font-size: 0.7rem;
    font-weight: 500;
    line-height: 1.2;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.2s ease;

    &[data-active='true'] {
        opacity: 1;
    }

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`;

const percent = (seconds: number, duration: number) =>
    duration > 0 ? Math.min(100, Math.max(0, (seconds / duration) * 100)) : 0;

const getRange = (mark: Mark) => ('at' in mark ? [mark.at, mark.at + POINT_LABEL_SECONDS] : [mark.from, mark.to]);

/** Labels in the right half grow leftwards so they stay inside the track. */
const labelPosition = (start: number, duration: number) => {
    const left = percent(start, duration);

    return left > 60 ? { right: `${100 - left}%` } : { left: `${left}%` };
};

const MarkView = ({ mark, position, duration }: { mark: Mark; position: number; duration: number }) => {
    const [start, end] = getRange(mark);
    const active = position >= start && position < end;

    return (
        <>
            {'at' in mark ? (
                <Diamond style={{ left: `${percent(mark.at, duration)}%` }} />
            ) : (
                <Bar
                    style={{
                        left: `${percent(mark.from, duration)}%`,
                        width: `${percent(mark.to, duration) - percent(mark.from, duration)}%`,
                    }}
                />
            )}
            {mark.label && (
                <Label
                    data-active={active}
                    style={labelPosition(start, duration)}
                >
                    {mark.label}
                </Label>
            )}
        </>
    );
};

export const Timeline = ({ position, duration, marks, onSeek }: TimelineProps) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onSeek(Number(e.target.value));
    };

    return (
        <Styling>
            <span aria-hidden="true">[</span>
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
            <Marks aria-hidden="true">
                {marks.map((mark) => (
                    <MarkView
                        key={`${'at' in mark ? mark.at : `${mark.from}-${mark.to}`}-${mark.label ?? ''}`}
                        mark={mark}
                        position={position}
                        duration={duration}
                    />
                ))}
            </Marks>
        </Styling>
    );
};
