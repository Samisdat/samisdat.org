'use client';

import { FC } from 'react';

export const Car: FC<{ x: number; width: number }> = ({ x, width }) => {
    return (
        <>
            <rect
                id="Wagon"
                x={x}
                y="275.156"
                width={width}
                height="11"
                strokeWidth="3"
                style={{ fill: '#e91600', stroke: '#381E24' }}
            />
        </>
    );
};
