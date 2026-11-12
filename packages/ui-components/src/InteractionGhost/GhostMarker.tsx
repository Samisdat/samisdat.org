import { styled } from '@linaria/react';

import { NameTag } from './NameTag';
import { PointerMarker } from './PointerMarker';
import { TiltMarker } from './TiltMarker';

const Group = styled.g`
    --ghost-kind-color: var(--color-text-emphasis);
    fill: var(--ghost-color, var(--ghost-kind-color));
    pointer-events: none;
`;

const Ripple = styled.circle`
    fill: none;
    stroke: var(--ghost-color, var(--ghost-kind-color));
    stroke-width: 0.7;
`;

export type GhostMarkerKind = 'pad' | 'touch' | 'mouse' | 'tilt';

export type GhostMarkerProps = {
    /** Center in SVG units of the surrounding `<svg viewBox="0 0 150 100">`. */
    x: number;
    y: number;
    /** 0 = invisible, 1 = fully shown. */
    presence: number;
    /** Finger/button pressed: halo contracts and gets denser, the arrow shrinks. */
    down?: boolean;
    /** Device the marker stands for; decides its shape. Defaults to 'touch'. */
    kind?: GhostMarkerKind;
    /** Seconds since the press started; drives the click ripple (not for 'tilt'). */
    age?: number;
    /** Normalized tilt (-1…1), only used by 'tilt'. */
    norm?: { x: number; y: number };
};

const HALO_R = 6.5;
const CORE_R = 2.1;
const RIPPLE_S = 0.6;

const DotMarker = ({ x, y, presence, down = false, age = Infinity }: GhostMarkerProps) => {
    const k = Math.min(1, Math.max(0, age / RIPPLE_S));

    return (
        <Group aria-hidden="true" opacity={Math.min(1, Math.max(0, presence))}>
            <circle cx={x} cy={y} r={down ? HALO_R * 0.88 : HALO_R} opacity={down ? 0.46 : 0.16} />
            <Ripple cx={x} cy={y} r={4 + k * 12} opacity={k < 1 ? 0.7 * (1 - k) : 0} />
            <circle cx={x} cy={y} r={CORE_R} />
            <NameTag x={x + 6} y={y + 6} />
        </Group>
    );
};

export const GhostMarker = ({ kind = 'touch', ...props }: GhostMarkerProps) => {
    if (kind === 'mouse') {
        return <PointerMarker {...props} />;
    }

    if (kind === 'tilt') {
        return <TiltMarker x={props.x} y={props.y} presence={props.presence} norm={props.norm} />;
    }

    return <DotMarker {...props} />;
};
