import { css } from '@linaria/core';
import { FC } from 'react';

interface SunProps {
    x: number;
    y: number;
}

const sunCss = css`
    fill: #f0ff5e;
`;

export const Sun: FC<SunProps> = ({ x, y }) => (
    <circle
        className={sunCss}
        cx={x}
        cy={y}
        r="25"
    />
);
