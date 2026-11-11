import { styled } from '@linaria/react';

const Ring = styled.circle`
    fill: none;
    stroke: var(--ghost-color, var(--color-ink-sapphire));
    stroke-width: 0.9;
    pointer-events: none;
`;

export type RippleProps = {
    /** Center in SVG units of the surrounding `<svg viewBox="0 0 150 100">`. */
    x: number;
    y: number;
    /** 0 = just started (small, opaque), 1 = finished (large, invisible). */
    progress: number;
};

const R_START = 4;
const R_GROW = 12;
const OPACITY = 0.7;

export const Ripple = ({ x, y, progress }: RippleProps) => {
    const k = Math.min(1, Math.max(0, progress));
    const opacity = k < 1 ? OPACITY * (1 - k) : 0;

    return <Ring aria-hidden="true" cx={x} cy={y} r={R_START + k * R_GROW} opacity={opacity} />;
};
