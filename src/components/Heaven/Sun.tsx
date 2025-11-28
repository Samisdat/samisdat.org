import { FC } from 'react';
import { css } from '@linaria/core';

interface SunProps {
    x: number;
    y: number;
}

const sunCss = css`
    fill: #F0FF5E;
`;

export const Sun: FC<SunProps> = ({ x, y }) => (
    <circle className={sunCss}
        cx={x}
        cy={y}
        r="25"
    />
);
