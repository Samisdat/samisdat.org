import { styled } from '@linaria/react';

import { NameTag } from './NameTag';

const Group = styled.g`
    --ghost-kind-color: var(--color-ink-sapphire);
    pointer-events: none;
`;

const Arrow = styled.path`
    fill: var(--color-surface-emphasis);
    stroke: var(--ghost-color, var(--ghost-kind-color));
    stroke-width: 2.4;
    stroke-linejoin: round;
`;

const Click = styled.circle`
    fill: none;
    stroke: var(--ghost-color, var(--ghost-kind-color));
    stroke-width: 0.8;
`;

export type PointerMarkerProps = {
    /** Hotspot (arrow tip) in SVG units of the surrounding `<svg viewBox="0 0 150 100">`. */
    x: number;
    y: number;
    /** 0 = invisible, 1 = fully shown. */
    presence: number;
    /** Button pressed: the arrow shrinks. */
    down?: boolean;
    /** Seconds since the press started; drives the click ripple. */
    age?: number;
};

const ARROW =
    'M4.04,4.69 a0.5,0.5 0 0 1 0.65,-0.65 l16,6.5 a0.5,0.5 0 0 1 -0.06,0.95 l-6.12,1.58 a2,2 0 0 0 -1.44,1.44 l-1.58,6.12 a0.5,0.5 0 0 1 -0.95,0.06 z';
const TIP = 4.3;
const RIPPLE_S = 0.5;

export const PointerMarker = ({ x, y, presence, down = false, age = Infinity }: PointerMarkerProps) => {
    const k = Math.min(1, Math.max(0, age / RIPPLE_S));
    const scale = down ? 0.42 : 0.48;

    return (
        <Group aria-hidden="true" opacity={Math.min(1, Math.max(0, presence))}>
            <Click cx={x} cy={y} r={2 + k * 9} opacity={k < 1 ? 0.7 * (1 - k) : 0} />
            <Arrow d={ARROW} transform={`translate(${x} ${y}) scale(${scale}) translate(${-TIP} ${-TIP})`} />
            <NameTag x={x + 6} y={y + 8} />
        </Group>
    );
};
