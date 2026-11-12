import { styled } from '@linaria/react';

const Pill = styled.rect`
    fill: var(--color-surface-default);
    stroke: var(--ghost-color, var(--ghost-kind-color));
    stroke-width: 0.5;
`;

const Label = styled.text`
    fill: var(--ghost-color, var(--ghost-kind-color));
    font-size: 3.6px;
    font-weight: 600;
    font-family: inherit;
`;

export type NameTagProps = {
    /** Top-left corner of the pill in SVG units. */
    x: number;
    y: number;
    label?: string;
};

const WIDTH = 14;
const HEIGHT = 5.6;

/** Pill with a short label; takes its color from the surrounding marker group. */
export const NameTag = ({ x, y, label = 'Demo' }: NameTagProps) => (
    <g aria-hidden="true">
        <Pill
            x={x}
            y={y}
            width={WIDTH}
            height={HEIGHT}
            rx={HEIGHT / 2}
        />
        <Label
            x={x + 2.6}
            y={y + 4}
        >
            {label}
        </Label>
    </g>
);
