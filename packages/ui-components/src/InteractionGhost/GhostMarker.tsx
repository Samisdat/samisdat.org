import { styled } from '@linaria/react';

const Group = styled.g`
    fill: var(--ghost-color, var(--color-ink-sapphire));
    pointer-events: none;
`;

export type GhostMarkerProps = {
    /** Center in SVG units of the surrounding `<svg viewBox="0 0 150 100">`. */
    x: number;
    y: number;
    /** 0 = invisible, 1 = fully shown. */
    presence: number;
    /** Finger pressed: halo contracts and gets denser. */
    down?: boolean;
};

const HALO_R = 6.5;
const CORE_R = 2.1;

export const GhostMarker = ({ x, y, presence, down = false }: GhostMarkerProps) => (
    <Group aria-hidden="true" opacity={Math.min(1, Math.max(0, presence))}>
        <circle cx={x} cy={y} r={down ? HALO_R * 0.88 : HALO_R} opacity={down ? 0.46 : 0.16} />
        <circle cx={x} cy={y} r={CORE_R} />
    </Group>
);
