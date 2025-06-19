'use client';

import { dayLength } from '@/components/const';
import { FC } from 'react';

export const Sun: FC = () => {
    return (
        <>
            <circle
                r="30"
                style={{
                    fill: '#F0FF5E',
                }}
            >
                <animateMotion
                    dur={`${dayLength}s`}
                    repeatCount="indefinite"
                    path="M149.988,297.533c-1.021,-255.076 600.006,-256.533 600.006,-256.533c0,-0 596.385,-0.813 600.006,256.533"
                />
            </circle>
        </>
    );
};
