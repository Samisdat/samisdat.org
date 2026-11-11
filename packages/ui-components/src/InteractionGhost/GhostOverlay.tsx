import { styled } from '@linaria/react';
import { useState } from 'react';

import { GhostMarker } from './GhostMarker';
import { GhostPath } from './GhostPath';
import { Ripple } from './Ripple';
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

export const RIPPLE_MS = 600;
export const TRAIL_POINTS = 19;
const VIEW_WIDTH = 150;

export type PhaseLabels = Record<Phase, string>;
export const DEFAULT_PHASE_LABELS: PhaseLabels = { tap: 'Tap', pan: 'Pan' };

type XY = { x: number; y: number };

export type GhostOverlayProps = {
    finger: Finger;
    phase: Phase | null;
    /** width / height of the demo the overlay sits on; the viewBox is 150 wide. */
    aspectRatio: number;
    /** Shows the static path overview of this script instead of the live ghost. */
    still?: Script;
    labels?: PhaseLabels;
};

/** Trail history and ripple origin, derived while rendering (no extra commit per frame). */
const useFingerTrace = (finger: Finger, toSvg: (x: number, y: number) => XY) => {
    const [seen, setSeen] = useState(finger);
    const [trail, setTrail] = useState<XY[]>([]);
    const [origin, setOrigin] = useState<XY | null>(null);

    if (seen !== finger) {
        setSeen(finger);
        const point = toSvg(finger.x, finger.y);
        setTrail(finger.presence > 0 ? [...trail.slice(-(TRAIL_POINTS - 1)), point] : []);
        if (Number.isFinite(finger.age) && (!Number.isFinite(seen.age) || finger.age < seen.age)) {
            setOrigin(point);
        }
    }

    return { trail, origin };
};

export const GhostOverlay = ({ finger, phase, aspectRatio, still, labels = DEFAULT_PHASE_LABELS }: GhostOverlayProps) => {
    const height = VIEW_WIDTH / aspectRatio;
    const toSvg = (x: number, y: number): XY => ({ x: (x + 1) * (VIEW_WIDTH / 2), y: (y + 1) * (height / 2) });
    const { trail, origin } = useFingerTrace(finger, toSvg);

    if (still) {
        return (
            <Svg aria-hidden="true" viewBox={`0 0 ${VIEW_WIDTH} ${height}`}>
                {scriptPaths(still).map((path, i) => (
                    // paths are positional and never reorder
                    // eslint-disable-next-line react/no-array-index-key
                    <GhostPath key={i} points={path.map(([x, y]) => toSvg(x, y))} />
                ))}
            </Svg>
        );
    }

    const at = toSvg(finger.x, finger.y);
    const rippleProgress = finger.age / RIPPLE_MS;

    return (
        <Svg aria-hidden="true" viewBox={`0 0 ${VIEW_WIDTH} ${height}`}>
            <Trail points={trail} presence={finger.presence} />
            {origin && rippleProgress < 1 && <Ripple x={origin.x} y={origin.y} progress={rippleProgress} />}
            <GhostMarker x={at.x} y={at.y} presence={finger.presence} down={finger.down} />
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
