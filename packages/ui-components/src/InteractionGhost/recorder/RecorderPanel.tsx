import { useId } from 'react';

import { Button, Code, DevicePicker, Hint, Panel, Row, Status, ToleranceLabel } from './RecorderControls';
import { useCopy } from './useCopy';

import type { Device, Script } from '../script';

const COPY_LABEL = { idle: 'Kopieren', done: 'Kopiert', failed: 'Kopieren nicht möglich, Text markieren' } as const;

const pointCount = (script: Script) =>
    script.reduce((sum, s) => sum + ('pan' in s ? s.pan.length : 'move' in s ? s.move.length : 0), 0);

export type RecorderPanelProps = {
    device: Device;
    recording: boolean;
    playing: boolean;
    tolerance: number;
    script: Script;
    snippet: string;
    onDevice: (device: Device) => void;
    onTolerance: (tolerance: number) => void;
    /** start or stop recording */
    onToggle: () => void;
    onPlay: () => void;
};

/** Controls, status and result of the recorder; all state lives in GhostRecorder. */
export const RecorderPanel = ({
    device,
    recording,
    playing,
    tolerance,
    script,
    snippet,
    onDevice,
    onTolerance,
    onToggle,
    onPlay,
}: RecorderPanelProps) => {
    const id = useId();
    const { state: copyState, copy } = useCopy(snippet);
    const hasScript = script.length > 0;

    return (
        <Panel>
            <Row>
                <DevicePicker
                    name={`${id}-device`}
                    value={device}
                    disabled={recording || playing}
                    onChange={onDevice}
                />
                <Status data-testid="recorder-status">{recording ? 'Aufnahme läuft' : 'Bereit'}</Status>
            </Row>
            <Row>
                <Button
                    type="button"
                    disabled={playing}
                    onClick={onToggle}
                >
                    {recording ? 'Stopp' : 'Aufnehmen'}
                </Button>
                <ToleranceLabel htmlFor={`${id}-tolerance`}>
                    Toleranz {tolerance.toFixed(3).replace('.', ',')}
                    <input
                        id={`${id}-tolerance`}
                        type="range"
                        min={0.005}
                        max={0.15}
                        step={0.005}
                        value={tolerance}
                        onChange={(e) => onTolerance(Number(e.target.value))}
                    />
                </ToleranceLabel>
                {hasScript && <span data-testid="recorder-points">{pointCount(script)} Wegpunkte</span>}
            </Row>
            <Hint>
                Die Aufnahme braucht einen Zeiger (Maus, Trackpad oder Touch); Bedienung per Tastatur nicht möglich.
            </Hint>
            {hasScript && !recording && (
                <>
                    <Code
                        tabIndex={0}
                        aria-label="Skript-Snippet"
                    >
                        <code>{snippet}</code>
                    </Code>
                    <Row>
                        <Button
                            type="button"
                            onClick={copy}
                        >
                            {COPY_LABEL[copyState]}
                        </Button>
                        <Button
                            type="button"
                            disabled={playing}
                            onClick={onPlay}
                        >
                            Abspielen
                        </Button>
                    </Row>
                </>
            )}
        </Panel>
    );
};
