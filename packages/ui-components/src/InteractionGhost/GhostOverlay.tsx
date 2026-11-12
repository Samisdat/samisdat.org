import { styled } from '@linaria/react';
import { useState } from 'react';

import { GhostMarker, type GhostMarkerKind } from './GhostMarker';
import { GhostPath } from './GhostPath';
import { scriptPaths } from './scriptPaths';
import { Trail } from './Trail';

import type { Finger, Phase, Script } from './script';

const Svg = styled.svg`
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;

    & .label {
        fill: var(--ghost-color, var(--color-ink-sapphire));
        font-family: monospace;
        font-size: 5px;
        pointer-events: none;
    }
`;

/** Kept for consumers; the click wave now lives inside the markers (`age`). */
export const RIPPLE_MS = 600;
export const TRAIL_POINTS = 19;
const VIEW_WIDTH = 150;

export type PhaseLabels = Record<Phase, string>;
export const DEFAULT_PHASE_LABELS: PhaseLabels = { tap: 'Tap', pan: 'Pan', click: 'Click', move: 'Move', tilt: 'Tilt' };

type XY = { x: number; y: number };

export type GhostOverlayProps = {
    finger: Finger;
    phase: Phase | null;
    /** width / height of the demo the overlay sits on; the viewBox is 150 wide. */
    aspectRatio: number;
    /** Shows the static path overview of this script instead of the live ghost. */
    still?: Script;
    labels?: PhaseLabels;
    /** Device the marker stands for (default 'touch'); 'tilt' draws no marker. */
    kind?: GhostMarkerKind;
};

/** Trail history, derived while rendering (no extra commit per frame). */
const useFingerTrail = (finger: Finger, toSvg: (x: number, y: number) => XY) => {
    const [seen, setSeen] = useState(finger);
    const [trail, setTrail] = useState<XY[]>([]);

    if (seen !== finger) {
        setSeen(finger);
        setTrail(finger.presence > 0 ? [...trail.slice(-(TRAIL_POINTS - 1)), toSvg(finger.x, finger.y)] : []);
    }

    return trail;
};

export const GhostOverlay = ({
    finger,
    phase,
    aspectRatio,
    still,
    labels = DEFAULT_PHASE_LABELS,
    kind = 'touch',
}: GhostOverlayProps) => {
    const height = VIEW_WIDTH / aspectRatio;
    const toSvg = (x: number, y: number): XY => ({ x: (x + 1) * (VIEW_WIDTH / 2), y: (y + 1) * (height / 2) });
    const trail = useFingerTrail(finger, toSvg);

    if (still) {
        return (
            <Svg
                aria-hidden="true"
                viewBox={`0 0 ${VIEW_WIDTH} ${height}`}
            >
                {scriptPaths(still).map((path, i) => (
                    <GhostPath
                        // paths are positional and never reorder
                        // eslint-disable-next-line react/no-array-index-key
                        key={i}
                        points={path.map(([x, y]) => toSvg(x, y))}
                    />
                ))}
            </Svg>
        );
    }

    const tilting = kind === 'tilt';
    // tilting has no marker; its phase label sits in the middle of the demo
    const at = tilting ? { x: VIEW_WIDTH / 2, y: height / 2 } : toSvg(finger.x, finger.y);

    return (
        <Svg
            aria-hidden="true"
            viewBox={`0 0 ${VIEW_WIDTH} ${height}`}
        >
            {!tilting && (
                <Trail
                    points={trail}
                    presence={finger.presence}
                />
            )}
            <GhostMarker
                x={at.x}
                y={at.y}
                presence={finger.presence}
                down={finger.down}
                kind={kind}
                age={finger.age / 1000}
            />
            {phase && finger.presence > 0 && (
                <text
                    className="label"
                    x={at.x > VIEW_WIDTH * 0.75 ? at.x - 8 : at.x + 8}
                    y={Math.max(6, at.y - 8)}
                    textAnchor={at.x > VIEW_WIDTH * 0.75 ? 'end' : 'start'}
                    opacity={finger.presence}
                >
                    {labels[phase]}
                </text>
            )}
        </Svg>
    );
};
