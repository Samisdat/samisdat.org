import { styled } from '@linaria/react';
import { ReactNode } from 'react';

import { PlayPauseButton } from './PlayPauseButton';
import { Row, SpeedControls } from './SpeedControls';
import { formatTimecode, Timeline, type Mark, type TimelineProps } from './Timeline';

export { PlayPauseButton };
export type { Mark, TimelineProps };

const Icon = styled.span`
    display: inline-block;
    width: 1ch;
    text-align: center;
`;

const Styling = styled.div`
    border: 1px solid var(--color-border-default);
    padding: 1rem;
    font-family: var(--font-code);
    font-weight: bold;
    background-color: var(--color-ink-gold);

    [data-theme='light'] & {
        background-color: var(--color-ink-rose);
    }

    @media (prefers-color-scheme: light) {
        :root:not([data-theme]) & {
            background-color: var(--color-ink-rose);
        }
    }

    color: var(--color-surface-default);

    /* Wraps the speed group below the buttons once it no longer fits */
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    row-gap: 0.5rem;
`;

const Notice = styled.div`
    flex: 0 0 100%;
    margin-top: 0.5rem;
    font-size: 0.85em;
    opacity: 0.8;
`;

const ExtraRow = styled.div`
    flex: 0 0 100%;
    margin-top: 0.5rem;
`;

const Device = styled.div`
    flex: none;
    color: inherit;
`;

const Controls = styled.div`
    flex: 1 1 12rem;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    /* Rows size to their content; the speed row's wrap basis only applies in the horizontal layout */
    && > * {
        flex: 0 0 auto;
    }
`;

const ControlRow = styled(Row)`
    flex-wrap: wrap;
    row-gap: 0.25rem;
`;

const Timecode = styled.span`
    margin-left: auto;
    padding-left: 1ch;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
`;

const Footer = ({ notice, extra }: Pick<PlaybackControlProps, 'notice' | 'extra'>) => (
    <>
        {notice && <Notice>{notice}</Notice>}
        {extra && <ExtraRow>{extra}</ExtraRow>}
    </>
);

export interface PlaybackControlProps {
    isPlaying: boolean;
    speed: number;
    speedMin?: number;
    speedMax?: number;
    speedStep?: number;
    speedControl?: boolean;
    resetControl?: boolean;
    notice?: string;
    /** Slot for a demo-specific control (e.g. a checkbox) rendered below the playback row. */
    extra?: ReactNode;
    /** Sketch rendered left of the rows; inherits currentColor. */
    device?: ReactNode;
    /** Adds a seekable timeline row with a timecode and event marks. */
    timeline?: TimelineProps;
    onPlay: () => void;
    onPause: () => void;
    onReset: () => void;
    onSpeedChange: (speed: number) => void;
}

export const PlaybackControl = ({
    isPlaying,
    speed,
    speedMin = 1,
    speedMax = 100,
    speedStep = 1,
    speedControl = true,
    resetControl: _resetControl = true,
    notice,
    extra,
    device,
    timeline,
    onPlay,
    onPause,
    onReset,
    onSpeedChange,
}: PlaybackControlProps) => {
    const playRow = (
        <>
            {isPlaying ? (
                <PlayPauseButton
                    type="button"
                    onClick={onPause}
                >
                    [ <Icon>⏸</Icon> Pause ]
                </PlayPauseButton>
            ) : (
                <PlayPauseButton
                    type="button"
                    onClick={onPlay}
                >
                    [ <Icon>▶</Icon> Play ]
                </PlayPauseButton>
            )}
            <PlayPauseButton
                type="button"
                onClick={onReset}
            >
                [ ↺ Reset ]
            </PlayPauseButton>
        </>
    );

    const footer = (
        <Footer
            notice={notice}
            extra={extra}
        />
    );

    if (!device && !timeline) {
        return (
            <Styling>
                <Row>{playRow}</Row>
                {speedControl && (
                    <SpeedControls
                        speed={speed}
                        speedMin={speedMin}
                        speedMax={speedMax}
                        speedStep={speedStep}
                        onSpeedChange={onSpeedChange}
                    />
                )}
                {footer}
            </Styling>
        );
    }

    return (
        <Styling>
            {device && <Device aria-hidden="true">{device}</Device>}
            <Controls>
                <ControlRow>
                    {playRow}
                    {timeline && <Timecode aria-hidden="true">{formatTimecode(timeline.position)}</Timecode>}
                </ControlRow>
                {timeline && <Timeline {...timeline} />}
                {speedControl && (
                    <SpeedControls
                        speed={speed}
                        speedMin={speedMin}
                        speedMax={speedMax}
                        speedStep={speedStep}
                        onSpeedChange={onSpeedChange}
                    />
                )}
            </Controls>
            {footer}
        </Styling>
    );
};
