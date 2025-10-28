import { FC } from 'react';

interface SunProps {
    x: number;
    y: number;
}
export const Sun: FC<SunProps> = ({ x, y }) => (
    <circle
        cx={x}
        cy={y}
        r="30"
        style={{ fill: '#F0FF5E' }}
    />
);
